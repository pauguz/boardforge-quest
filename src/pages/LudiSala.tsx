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
    
    // 2. Ejecutamos la función
    verifyAuthorship(roomCode, localId, setIsCreator, setError );
    selectLudiSalaByCode(roomCode, setCargando, setDatos, setFase, setPiezaTypes, setError);
    console.log("pieces:", fase?.pieces, "piezaTypes:", piezaTypes);
    
  }, [roomCode]); // 3. Se vuelve a ejecutar si la prop cambia

  useEffect(() => {
    if (users.length === 2 && datos?.sala_id) {
      const myNumber = users.find(u => u.id === localId)?.number;
      if (myNumber === 1) {
        supabase.rpc('iniciar_partida', { p_sala_id: datos.sala_id });
      }
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
 
  const handleCellClick = (row: number, col: number) => {
    console.log("Casilla clickeada!: ", row, col)
    }
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