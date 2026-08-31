import { AlertOctagon } from 'lucide-react';
import {supabase} from '../utils/supabaseClient';

import { PieceType } from '@/types/game';
import { generateRoomCode, incremento, localInt} from '../utils/roomCode';
import { base64ToBlob, ficheroToBlob, } from '@/utils/transformations';
import { gqlQuery } from '@/api/graphql';
import {  QUERY_PIEZAS_POR_JUEGO } from '@/api/queries';
import { mapSalaToPlayState } from '@/api/mappers';
import { getOrCreateAnonymousUser } from '@/utils/auth';


export const selectLudiSalaByCode = async (
  roomCode: string, 
  Espera: Function, 
  handleDatos: Function, 
  handleFase: Function,
  handlePiezaTypes: Function,
  handleCodigoToIndex: Function,
  handleError: Function
) => {
  try {
    Espera(true);
    console.log("Buscando sala con codigo:", roomCode);
    const { data, error } = await supabase.rpc('get_sala_by_code', { p_codigo: roomCode });
    console.log("1. datos de la sala:", data, "error:", error);
    
    // ✅ MEJOR VALIDACIÓN
    if (error) {
      throw new Error(error.message);
    }
    
    // Validar que data existe y tiene contenido
    if (!data || (Array.isArray(data) && data.length === 0)) {
      const notFoundError = new Error('SALA_NOT_FOUND');
      throw notFoundError;
    }

    // Soportar tanto array como objeto directo
    const node = Array.isArray(data) ? data[0] : data;
    
    // Validar que el nodo tiene la propiedad esperada
    if (!node || !node.dispin) {
      const notFoundError = new Error('SALA_NOT_FOUND');
      throw notFoundError;
    }
    
    console.log("DISPIN:", node.dispin);
    handleDatos(node);

    const piezasData = await gqlQuery(QUERY_PIEZAS_POR_JUEGO, { juegoId: node.juego_id });
    const piezas = piezasData.piezaTipoCollection.edges.map(e => e.node);
    console.log("2. piezas (formato BD):", piezas);
    const mapping: Record<string, number> = {};
    piezas.forEach((p, i) => { mapping[p.codigo] = i; });
    handleCodigoToIndex(mapping);  
    
    const pieceTypes: PieceType[] = piezas.map(p => ({
      name:         p.simbolo,
      simbolo:      p.simbolo,
      imageUrl:     p.img_url === 'https://placehold.co/100x100' 
        ? `https://placehold.co/100x100?text=${p.simbolo}`
        : p.img_url,
      moves:        typeof p.movimientos === 'string' ? JSON.parse(p.movimientos) : (p.movimientos ?? []),
      captura_modo: p.cm,
    }));
    console.log("3. pieceTypes:", pieceTypes);
    handlePiezaTypes(pieceTypes);
    const playState = mapSalaToPlayState(node, piezas);
    console.log("4. playState:", playState);
    handleFase(playState);
  } catch (err) {
    console.error("ERROR en selectLudiSalaByCode:", err);
    handleError(err instanceof Error ? err.message : String(err));
  } finally {
    Espera(false);
  }
};

// Versión mejorada de listarJugadoresSala
export const listarJugadoresSala = async (
  datos: any, 
  localId: string, 
  setMyPosition: Function,
  setJugadoresActuales?: Function
) => {
  try {
    const { data, error } = await supabase.rpc('obtener_jugadores_sala', { 
      p_sala_id: datos.sala_id 
    });

    if (error) {
      console.error('Error al obtener jugadores:', error);
      return;
    }

    if (!data) return;

    console.log('👥 Jugadores actuales:', data.length);

    // Actualizar contador si se proporciona
    if (setJugadoresActuales) {
      setJugadoresActuales(data.length);
    }

    // Encontrar mi posición
    const yo = data.find((j: any) => j.user_id === localId);
    if (yo) {
      console.log('🎮 Mi posición:', yo.posicion);
      setMyPosition(yo.posicion);
    }
  } catch (err) {
    console.error('Error en listarJugadoresSala:', err);
  }
};

export const unirseASala = async (datos, handleResult:Function,handleError, recargarSala:Function) => {
  const { data, error } = await supabase.rpc('iniciar_partida', { p_sala_id: datos.sala_id });
  if (error) {
    if (error.message === 'SALA_FULL') alert('Sala llena');
    console.log('Error al unirse a la sala:', error);
    return;
  }
  handleResult(data);
  recargarSala()
};

export const verifyAuthorship= async (roomCode:string, localId:string, handleResult:Function, handleError:Function)=>{
  try {console.log('ejecutando funcion de verificacion');
    const { data, error } = await supabase
    .rpc("is_owner", { room_id: roomCode });
    handleResult(data);
    console.log("Es creador:", data, "Error: " ,error)
  } catch(err:any) {
    handleError(err.message);
  }
};

export const deleteRoom = async (datos, localId, handleError:Function)=>{
  try{
    console.log('borrando id: ', datos)
    const {data, error} = await supabase.from('sala')
    .delete().eq('id', datos.sala_id);
    
  } catch(err){handleError(err.message); console.log(err);}
}

export const countRoomsperUser = async (localId, handleResult,handleError)=>{
  try{ 
    console.log("contando salas", localId);
    const {data, error} = await supabase.rpc("count_my_rooms");
    handleResult(data)
  } catch(err){handleError(err.message);}
}


export const createRoomwithGameIL = async ( p_nombre, p_alto, p_ancho, p_piezas, p_dispin, p_codigo, p_condiciones, handleResult:Function)=>{
  try{
    console.log("Creando sala con codigo", p_codigo);
    console.log(p_nombre, p_alto, p_ancho)
    const {data, error} = await supabase.rpc("create_room_with_game_il", 
      {p_nombre, p_alto, p_ancho, p_piezas, p_ip:'1', p_dispin, p_condiciones});
    handleResult(data);
    console.log('dispin', p_dispin);
    console.log('fichero', p_piezas);

    console.log('data', data);
    console.log('error', error);
  }catch(err){console.log(err)}
}

export const SendRoomData = async (alt:number, anc:number, dispin, fichero: PieceType[], victconds ) => {
    const ficher= ficheroToBlob(fichero);

    const creatorId = await getOrCreateAnonymousUser();
    
    const sc:number= localInt("salasCreadas") || 0;
    console.log("Tienes ", sc, " salas creadas y el id con numero: ", creatorId );

    if(sc<3){
      const codSala = generateRoomCode();
      console.log('Iniciando Creacion de Sala y Juego, sc: ', sc)
      const ventana = (data)=>{      
        window.open(`/sala/${codSala}`, "_blank", "noopener,noreferrer");
      }

      createRoomwithGameIL( 'juego',alt, anc, ficher, dispin ,codSala, victconds, ventana );
      localStorage.setItem('salasCreadas', incremento(sc));
      }

    };


