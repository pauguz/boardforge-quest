import React, { useEffect, useState } from 'react'
import CloseButton from '@/components/ui/mini/closeButton';
import { useLocation, useNavigate } from "react-router-dom";
import { BoardPiece, PieceType, PlayState } from '@/types/game';
import { useParams } from "react-router-dom";
import { supabase } from '@/utils/supabaseClient';
import { cn } from '@/lib/utils';
import {verifyAuthorship, deleteRoom, unirseASala, listarJugadoresSala } from '../services/salaService.ts'
import { BoardGrid } from '@/components/BoardGrid.tsx';
import { incremento, localInt } from '@/utils/roomCode.ts';
import { getOrCreateAnonymousUser } from '@/utils/auth.ts';
import { getValidMoves } from '@/utils/movement.ts';
import NotFound from './NotFound.tsx';
import { setupJugadoresListener } from '@/services/juegoService.ts';

interface LudiSalaProps {
  datos: any;
  setDatos: React.Dispatch<React.SetStateAction<any>>;
  dispin: PlayState | null;
  piezaTypes: PieceType[];
  codigoToIndex: Record<string, number>;
}

const LudiSala = ({datos, setDatos, dispin, piezaTypes, codigoToIndex}:LudiSalaProps) => {

  const [error, setError] = useState(null);
  const [disposicion, setDisposicion] = useState<PlayState|null>();
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([]);
  const { roomCode } = useParams();
  const [localId, setLocalId] = useState<string | null>(null);
  const [myPosition, setMyPosition] = useState<number | null>(null);
  const navigate = useNavigate();


  const actualizarJugadores = (nuevoContador: number) => {
    setDatos(prev => ({
      ...prev,
      jugadores_actuales: nuevoContador
    }));
  };

  useEffect(() => {
    getOrCreateAnonymousUser().then(setLocalId);
  }, []);

  useEffect(() => {
    if (dispin) {
      setDisposicion(dispin);
    } else {
      setDisposicion(null);
    }
  }, [dispin]);

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
    
    const channel = setupJugadoresListener(supabase, datos.sala_id, datos, localId, {
      onJugadorChange: () => {
        listarJugadoresSala(datos, localId, setMyPosition, actualizarJugadores);
      }
    });
  
    return () => {
      supabase.removeChannel(channel);  // Sin await
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

        setDisposicion(prev => ({
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


  //console.log('El ID local ', localId)
  console.log("Es creador ", isCreator);
  const {alto:al, ancho:an, magnitud:mag}=datos;
  const alto= parseInt(al, 2);
  const ancho= parseInt(an, 2);
  console.log('magnitud y jugadores actuales: ', mag, datos.jugadores_actuales);
 
  const handleCellClick = async (row: number, col: number) => {
    if (!disposicion || disposicion.winner) return;
    if (!myPosition || myPosition !== disposicion.turn) return;
  
    // selección
    if (!disposicion.selected) {
      const piece = disposicion.pieces.find(p => p.row === row && p.col === col && p.player === myPosition);
      if (!piece) return;
      const pt = piezaTypes[piece.pieceTypeIndex];
      if (!pt) return;
      const { moves } = getValidMoves(piece, pt, disposicion.pieces, alto, ancho);
      setDisposicion({ ...disposicion, selected: { row, col }, validMoves: moves });
      return;
    }
  
    // movimiento
    if (disposicion.validMoves.some(m => m.row === row && m.col === col)) {
      const { data, error } = await supabase.rpc('hacer_movimiento', {
        p_sala_id: datos.sala_id,
        p_from_row: disposicion.selected.row,
        p_from_col: disposicion.selected.col,
        p_to_row: row,
        p_to_col: col,
      });
  
      if (error) {
        console.error('Error al mover:', error);
        return;
      }
  
      console.log('Resultado movimiento:', data);
    } else {
      setDisposicion({ ...disposicion, selected: null, validMoves: [] });
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
        pieces={disposicion?.pieces ?? []}
        pieceTypes={piezaTypes}  
        validMoves={disposicion?.validMoves}
        selected={disposicion?.selected}
        winner={disposicion?.winner}
        onCellClick={handleCellClick}
        onVolverClick={() => {setDisposicion(dispin); 
                              setMyPosition(null);
                              setDatos(prev => ({
                                ...prev,
                                enjuego: '0',
                                jugadores_actuales: 0
                              }));
                            }}
      />
    </div>
  )
}
export default LudiSala 