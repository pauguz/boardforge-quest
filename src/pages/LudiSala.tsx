import React, { useEffect, useState } from 'react'
import CloseButton from '@/components/ui/mini/closeButton';
import { BoardPiece, PieceType, PlayState } from '@/types/game';
import { useParams } from "react-router-dom";
import { supabase } from '@/utils/supabaseClient';
import { cn } from '@/lib/utils';
import {verifyAuthorship, deleteRoom, selectLudiSalaByCode, unirseASala } from '../services/salaService.ts'
import { BoardGrid } from '@/components/boardgrid.tsx';
import { incremento, localInt } from '@/utils/roomCode.ts';
import { getOrCreateAnonymousUser } from '@/utils/auth.ts';
import { getValidMoves } from '@/utils/movement.ts';

const LudiSala = () => {

  const [datos, setDatos] = useState<any|null>(); // Estado para guardar los resultados
  const [cargando, setCargando] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null);
  const [fase, setFase] = useState<PlayState|null>();
  const [piezaTypes, setPiezaTypes] = useState<PieceType[]>([]);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [codigoToIndex, setCodigoToIndex] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<{ id: string; number: number }[]>([]);
  const { roomCode } = useParams();
  const [localId, setLocalId] = useState<string | null>(null);
  const [myPosition, setMyPosition] = useState<number | null>(null);
  const cargarSala = () => {
    selectLudiSalaByCode(roomCode, setCargando, setDatos, setFase, setPiezaTypes, setCodigoToIndex, setError);
  }

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
    const numberedUsers = userIds.map((id, index) => ({
      id,
      number: index + 1
    }));
    setUsers(numberedUsers);
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

}, [roomCode, localId]);

  // useEffect 2: realtime de sala (espera a que datos esté listo)
  useEffect(() => {
    if (!localId || !datos?.sala_id) return;

    const salaChannel = supabase.channel(`sala:${datos.sala_id}`);

    salaChannel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'sala', filter: `id=eq.${datos.sala_id}` },
      (payload) => {
        console.log('PAYLOAD COMPLETO:', payload.new);
        const nuevaSala = payload.new;
        const tablero = typeof nuevaSala.tablero === 'string'
          ? JSON.parse(nuevaSala.tablero)
          : nuevaSala.tablero;
        console.log('TABLERO PARSEADO:', tablero);
        const pieces: BoardPiece[] = tablero.map((entry: any) => ({
          pieceTypeIndex: codigoToIndex[entry.code] ?? 0,
          player: entry.player,
          row: entry.row,
          col: entry.col,
        }));

        setFase(prev => ({
          ...prev!,
          pieces,
          turn: nuevaSala.turn,
          winner: nuevaSala.winner ?? null,
          selected: null,
          validMoves: [],
        }));
      }
    ).subscribe();

    return () => { supabase.removeChannel(salaChannel); };  // cleanup

  }, [localId, datos?.sala_id, codigoToIndex]);

  if (!datos) return <div>Cargando...</div>;

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
              onClick={() => {unirseASala(datos, setMyPosition, setError, cargarSala); 
                              console.log('ERROR CREADO DESDE UNIRSE A SALA' ,error); }}
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