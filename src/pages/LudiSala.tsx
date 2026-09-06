import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { BoardPiece, PieceType, PlayState } from '@/types/game';
import { useParams } from "react-router-dom";
import { supabase } from '@/utils/supabaseClient';
import { cn } from '@/lib/utils';
import {verifyAuthorship, deleteRoom, unirseASala, listarJugadoresSala } from '../services/salaService.ts'
import { BoardGrid } from '@/components/BoardGrid.tsx';
import { getOrCreateAnonymousUser } from '@/utils/auth.ts';
import { getValidMoves } from '@/utils/movement.ts';
import { setupJugadoresListener } from '@/services/juegoService.ts';
import { setupPresenceChannel } from '@/services/presenceService.ts';
import SalaHeader from '@/components/sala/SalaHeader.tsx';
import { setupPartidaListener } from '@/services/partidaService.tsx';

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
    const channel = setupPresenceChannel(
      supabase,
      roomCode!,
      localId,
      setUsers)      
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

    const channel = setupPartidaListener(supabase, datos.sala_id, codigoToIndex, {
      onJuegoIniciado: () => {
        setDatos(prev => ({ ...prev, enjuego: '1' }));
      },
      onPartidaChange: (updateData) => {
        setDisposicion(prev => ({
          ...prev!,
          pieces: updateData.pieces,
          turn: updateData.turn,
          winner: updateData.winner,
          selected: null,
          validMoves: [],
        }));
      }
    });

    return () => {
      supabase.removeChannel(channel);
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
      <SalaHeader 
        isCreator={isCreator} 
        datos={datos} 
        localId={localId} 
        mag={mag} 
        setError={setError} 
        myPosition={myPosition} setMyPosition={setMyPosition} 
        actualizarJugadores={actualizarJugadores}/>

      <BoardGrid
        rows={alto} cols={ancho}
        pieces={disposicion?.pieces ?? []}
        pieceTypes={piezaTypes}  
        validMoves={disposicion?.validMoves}
        selected={disposicion?.selected}
        winner={disposicion?.winner}
        onCellClick={handleCellClick}
        onVolverClick={() => {setDisposicion(dispin); 
                              setMyPosition(null);
                              setDatos(prev => ({...prev,
                                enjuego: '0',
                                jugadores_actuales: 0
                              }));
                            }}
      />
    </div>
  )
}
export default LudiSala 