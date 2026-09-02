import React, { useEffect, useState } from 'react'
import CloseButton from '@/components/ui/mini/closeButton';
import { useLocation, useNavigate } from "react-router-dom";
import { BoardPiece, PieceType, PlayState } from '@/types/game';
import { useParams } from "react-router-dom";
import { supabase } from '@/utils/supabaseClient';
import { cn } from '@/lib/utils';
import {verifyAuthorship, deleteRoom, selectLudiSalaByCode, unirseASala, listarJugadoresSala } from '../services/salaService.ts'
import { BoardGrid } from '@/components/boardgrid.tsx';
import { incremento, localInt } from '@/utils/roomCode.ts';
import { getOrCreateAnonymousUser } from '@/utils/auth.ts';
import { getValidMoves } from '@/utils/movement.ts';
import NotFound from './NotFound.tsx';

const LudiSala = () => {

  const [datos, setDatos] = useState<any|null>(); // Estado para guardar los resultados
  const [cargando, setCargando] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null);
  const [fase, setFase] = useState<PlayState|null>();
  const [piezaTypes, setPiezaTypes] = useState<PieceType[]>([]);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [codigoToIndex, setCodigoToIndex] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<string[]>([]);
  const { roomCode } = useParams();
  const [localId, setLocalId] = useState<string | null>(null);
  const [myPosition, setMyPosition] = useState<number | null>(null);
  const navigate = useNavigate();

  const cargarSala = () => {
    selectLudiSalaByCode(roomCode, setCargando, setDatos, setFase, setPiezaTypes, setCodigoToIndex, (err) => {
      console.error('Error al cargar sala:', err);
      if (err === 'SALA_NOT_FOUND') {  // ← Compara directamente contra el string
          setError('room-not-found');  // ← Solo setea el error, sin navegar
      } else {
        setError(err);
      }
    });  
  }

  const actualizarJugadores = (nuevoContador: number) => {
    setDatos(prev => ({
      ...prev,
      jugadores_actuales: nuevoContador
    }));
  };

  useEffect(() => {
    getOrCreateAnonymousUser().then(setLocalId);
  }, []);

  // useEffect 1: canal de presence y realtime (solo se crea una vez con localId)
  useEffect(() => {
    if (!localId) return;
    const channel = supabase.channel(`room:${roomCode}`, {
      config: { presence: { key: localId } }
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const userIds = Object.keys(state);
      setUsers(userIds);
    });

    channel.subscribe(async () => {
      await channel.track({
        localId,
        joined_at: new Date().toISOString()
        });
      });

    verifyAuthorship(roomCode, localId, setIsCreator, setError);
    cargarSala();

    return () => { supabase.removeChannel(channel); };  // cleanup

  }, [roomCode, localId, navigate]);

  // useEffect 2: cargar jugadores iniciales y listar
  useEffect(() => {
    if (!localId || !datos?.sala_id) return;
    listarJugadoresSala(datos, localId, setMyPosition, actualizarJugadores);
  }, [localId, datos?.sala_id]);

  // useEffect 3: realtime del contador de jugadores (tabla jugador)
  useEffect(() => {
    if (!localId || !datos?.sala_id) return;
    const jugadorChannel = supabase.channel(`jugadores:${datos.sala_id}`);

    jugadorChannel.on(
      'postgres_changes',
      {
        event: '*', // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'jugador',
        filter: `sala_id=eq.${datos.sala_id}`,
      },
      (payload) => {
        console.log('👥 CAMBIO EN JUGADORES:', payload);
        // Recargar lista completa de jugadores
        listarJugadoresSala(datos, localId, setMyPosition, actualizarJugadores);
      }
    ).subscribe((status) => {
      console.log('📡 JUGADORES CHANNEL STATUS:', status);
    });

    return () => {
      supabase.removeChannel(jugadorChannel);
    };
  }, [localId, datos?.sala_id]);

  // useEffect 4: realtime del tablero (tabla partida)
  // También detecta cuándo comienza la partida
  useEffect(() => {
    if (!localId || !datos?.sala_id) return;

    const partidaChannel = supabase.channel(`partida:${datos.sala_id}`);

    partidaChannel.on(
      'postgres_changes',
      {
        event: '*', // INSERT o UPDATE
        schema: 'public',
        table: 'partida',
        filter: `sala_id=eq.${datos.sala_id}`,
      },
      (payload) => {
        console.log('🔥 CAMBIO EN PARTIDA:', payload);
        
        const nuevaPartida = payload.new;
        if (!nuevaPartida) return;

        // Marcar que el juego comenzó (partida existe = enjuego es true)
        setDatos(prev => ({
          ...prev,
          enjuego: '1'
        }));

        const tablero =
          typeof nuevaPartida.tablero === 'string'
            ? JSON.parse(nuevaPartida.tablero)
            : nuevaPartida.tablero;

        const pieces: BoardPiece[] = tablero.map((entry: any) => ({
          pieceTypeIndex: codigoToIndex[entry.code] ?? 0,
          player: entry.player,
          row: entry.row,
          col: entry.col,
        }));

        setFase(prev => ({
          ...prev!,
          pieces,
          turn: nuevaPartida.turn,
          selected: null,
          validMoves: [],
          winner: nuevaPartida.winner,
        }));
      }
    ).subscribe((status) => {
      console.log('📡 PARTIDA CHANNEL STATUS:', status);
    });

    return () => {
      supabase.removeChannel(partidaChannel);
    };
  }, [localId, datos?.sala_id, codigoToIndex]);

  if (!datos || cargando) return <div>Cargando...</div>;

  // Mostrar error si existe
  if (error) {
    return (
      <NotFound 
        errorType={error === 'room-not-found' ? 'room-not-found' : 'game-error'}
        roomCode={roomCode}
      />
    );
  }
  //console.log('El ID local ', localId)
  console.log("Es creador ", isCreator);
  const {alto:al, ancho:an, magnitud:mag}=datos;
  const alto= parseInt(al, 2);
  const ancho= parseInt(an, 2);
  console.log('magnitud y jugadores actuales: ', mag, datos.jugadores_actuales);
 
  const handleCellClick = async (row: number, col: number) => {
    if (!fase || fase.winner) return;
    if (!myPosition || myPosition !== fase.turn) return;
  
    // selección
    if (!fase.selected) {
      const piece = fase.pieces.find(p => p.row === row && p.col === col && p.player === myPosition);
      if (!piece) return;
      const pt = piezaTypes[piece.pieceTypeIndex];
      if (!pt) return;
      const { moves } = getValidMoves(piece, pt, fase.pieces, alto, ancho);
      setFase({ ...fase, selected: { row, col }, validMoves: moves });
      return;
    }
  
    // movimiento
    if (fase.validMoves.some(m => m.row === row && m.col === col)) {
      const { data, error } = await supabase.rpc('hacer_movimiento', {
        p_sala_id: datos.sala_id,
        p_from_row: fase.selected.row,
        p_from_col: fase.selected.col,
        p_to_row: row,
        p_to_col: col,
      });
  
      if (error) {
        console.error('Error al mover:', error);
        return;
      }
  
      console.log('Resultado movimiento:', data);
    } else {
      setFase({ ...fase, selected: null, validMoves: [] });
    }
  };
  return (
    <div className='bg-[#e0d0b0] flex flex-col h-screen bg-background overflow-hidden"' >
      <div>      
        {isCreator &&  <CloseButton 
                    onDelete={()=>{console.log('sala eliminada?'); deleteRoom(datos, localId, setError); 
                    localStorage.setItem("salasCreadas",  incremento(localInt("salasCreadas"), -1) 
                              ) }}/>} 
        {datos.enjuego === '0' && (
          <div>
            <p>{datos.jugadores_actuales}/{mag} jugadores en la sala</p>
            <button 
              onClick={() => {
                unirseASala(datos, setMyPosition, setError, () => {
                  cargarSala();
                  listarJugadoresSala(datos, localId, setMyPosition, actualizarJugadores);
                }); 
              }}
              disabled={myPosition !== null || datos.jugadores_actuales >= mag}
            >
              {myPosition ? `Jugador ${myPosition}` : 'Unirse'}
            </button>
          </div>
        )}
      </div>

      <BoardGrid
        rows={alto}
        cols={ancho}
        pieces={fase?.pieces ?? []}
        pieceTypes={piezaTypes}  
        validMoves={fase?.validMoves}
        selected={fase?.selected}
        winner={fase?.winner}
        onCellClick={handleCellClick}
      />
    </div>
  )
}
export default LudiSala 