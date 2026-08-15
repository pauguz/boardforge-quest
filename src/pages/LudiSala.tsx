import React, { useEffect, useState } from 'react'
import CloseButton from '@/components/ui/mini/closeButton';
import { PieceType, PlayState } from '@/types/game';
import { useParams } from "react-router-dom";
import { supabase } from '@/utils/supabaseClient';
import { cn } from '@/lib/utils';
import {verifyAuthorship, deleteRoom, selectLudiSalaByCode } from '../services/salaService.ts'
import { BoardGrid } from '@/components/boardgrid.tsx';
import { incremento, localInt } from '@/utils/roomCode.ts';
import { getOrCreateAnonymousUser } from '@/utils/auth.ts';

const LudiSala = () => {

  const [datos, setDatos] = useState<any|null>(); // Estado para guardar los resultados
  const [cargando, setCargando] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null);
  const [fase, setFase] = useState<PlayState|null>();
  const [piezaTypes, setPiezaTypes] = useState<PieceType[]>([]);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [users, setUsers] = useState<{ id: string; number: number }[]>([]);

  const { roomCode } = useParams();
  // Después
  const [localId, setLocalId] = useState<string | null>(null);

  useEffect(() => {
    getOrCreateAnonymousUser().then(setLocalId);
  }, []);

  //Enumeracion de Usuarios en tiempo real 
  useEffect(() => {
    if (!localId) return;  // ← esperar a que localId esté listo
  
    const channel = supabase.channel(`room:${roomCode}`, {
      config: {
        presence: { key: localId }
      }
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
        joined_at: new Date().toISOString()
      });
    });
  
    verifyAuthorship(roomCode, localId, setIsCreator, setError);
    selectLudiSalaByCode(roomCode, setCargando, setDatos, setFase, setPiezaTypes, setError);
  
  }, [roomCode, localId]);  // ← añadir localId // 3. Se vuelve a ejecutar si la prop cambia

  useEffect(() => {
    if (users.length === 2 && datos?.sala_id) {
      const myNumber = users.find(u => u.id === localId)?.number;
      supabase.rpc('iniciar_partida', { p_sala_id: datos.sala_id })
        .then(({ data, error }) => console.log("iniciar_partida:", data, error));
      
    }
  }, [users, datos]);
  if (!datos) return <div>Cargando...</div>;

  console.log('El ID local y el de la BD: ', localId, datos.creador_id)
  console.log("Es creador ", isCreator);
  const {alto:al, ancho:an}=datos;
  const alto= parseInt(al, 2);
  const ancho= parseInt(an, 2);

  console.log('alto y ancho: ', al, an);
  const cellSize = Math.min(Math.floor(600 / Math.max(alto, ancho)), 64);
 
  const handleCellClick = async (row: number, col: number) => {
    if (!fase || fase.winner) return;
    
    const myPosition = users.find(u => u.id === localId)?.number;
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
      <div>      {isCreator &&  <CloseButton onDelete={()=>{console.log('sala eliminada?'); deleteRoom(datos, localId, setError); 
                    localStorage.setItem("salasCreadas",  incremento(localInt("salasCreadas"), -1) 
                              ) }}/>} 
      </div>
      <BoardGrid
        rows={alto}
        cols={ancho}
        pieces={fase?.pieces ?? []}
        pieceTypes={piezaTypes}  // las que cargaste con GraphQL
        validMoves={fase?.validMoves}
        selected={fase?.selected}
        winner={fase?.winner}
        onCellClick={handleCellClick}
      />
    </div>
  )
}

export default LudiSala