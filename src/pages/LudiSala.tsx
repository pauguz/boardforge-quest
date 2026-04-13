import React, { useEffect, useState } from 'react'
import { BoardGrid } from '@/components/editor/Board/BoardGrid';
import CloseButton from '@/components/ui/mini/closeButton';
import { PlayState } from '@/types/game';
import { useParams } from "react-router-dom";
import { supabase } from '@/utils/supabaseClient';
import { cn } from '@/lib/utils';
import {verifyAuthorship, obtenerDatos, deleteRoom } from '../../services/salaServic.ts'
import { incremento, localInt } from '@/utils/roomId.ts';



const LudiSala = () => {



  const [datos, setDatos] = useState<any|null>(); // Estado para guardar los resultados
  const [cargando, setCargando] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null);
  const [fase, setFase] = useState<PlayState|null>();
  const [creator, setCreator] = useState<boolean>(false);
  const [users, setUsers] = useState<{ id: string; number: number }[]>([]);

  const { roomId } = useParams();
  if (! localStorage.getItem('creador')){localStorage.setItem('creador', crypto.randomUUID())}
  const localId= localStorage.getItem('creador');
  

  //Enumeracion de Usuarios en tiempo real 
  useEffect(() => {

    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: { key: localId }
      }
    });
  
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
    
      // Convertir a array de usuarios
      const userIds = Object.keys(state);
    
      // Asignar números
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
    obtenerDatos(roomId, setCargando, setDatos ,setError);
    verifyAuthorship(roomId, localId, setCreator, setError );
  }, [roomId]); // 3. Se vuelve a ejecutar si la prop cambia

  
  

  if (!datos) return <div>Cargando...</div>;
  console.log('El ID local y el de la BD: ', localId, datos.creador_id)



  console.log("Es creador ", creator);
  const {alto:al, ancho:an}=datos;
  const alto= parseInt(al, 2);
  const ancho= parseInt(an, 2);
  console.log('alto y ancho: ', al, an)
  const cellSize = Math.min(Math.floor(600 / Math.max(alto, ancho)), 64);
  const handleCellClick = (row: number, col: number) => {
    console.log("Casilla clickeada!: ", row, col)
    }
  return (
    <div className='bg-[#e0d0b0] flex flex-col h-screen bg-background overflow-hidden"' >
         <div>      {creator &&  <CloseButton onDelete={()=>{console.log('sala eliminada?'); deleteRoom(datos, localId, setError); 
          localStorage.setItem("salasCreadas",  
                              incremento(localInt("salasCreadas"), -1) 
                              ) }}/>} </div>
      <div className="flex-1 flex items-center justify-center p-4 relative ">
            <div
              className="grid border border-border rounded overflow-hidden"
              style={{
                gridTemplateColumns: `repeat(${ancho}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${alto}, ${cellSize}px)`,
              }}
            >
              {Array.from({ length: alto * ancho }).map((_, i) => {
                const row = Math.floor(i / ancho);
                const col = i % ancho;
                const isDark = (row + col) % 2 === 1;

      
                return (
                  <div
                    key={`${row}-${col}`}
                    onClick={() => handleCellClick(row, col)}
                    className={cn(
                      "flex items-center justify-center cursor-pointer relative transition-colors",
                      isDark ? "bg-board-dark" : "bg-board-light",


                    )}
                    style={{ width: cellSize, height: cellSize }}
                  >


                  </div>
                );
              })}
            </div>
      

          </div>
    </div>
  )
}

export default LudiSala
