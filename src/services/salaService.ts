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
  handleResult1: Function, 
  handleResult2: Function,
  handleResult3: Function,
  handleError: Function
) => {
  try {
    Espera(true);
    const { data, error } = await supabase.rpc('get_sala_by_code', { p_codigo: roomCode });
    console.log("1. data:", data, "error:", error);
    if (error) throw error;
    const node = data[0];
    console.log("DISPIN:", node.dispin);
    handleResult1(node);

    const piezasData = await gqlQuery(QUERY_PIEZAS_POR_JUEGO, { juegoId: node.juego_id });
    const piezas = piezasData.piezaTipoCollection.edges.map(e => e.node);
    console.log("2. piezas:", piezas);

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
    handleResult3(pieceTypes);

    const playState = mapSalaToPlayState(node, piezas);
    console.log("4. playState:", playState);
    handleResult2(playState);
  } catch (err) {
    console.log("ERROR:", err);
    handleError(err.message);
  } finally {
    Espera(false);
  }
};

export const verifyAuthorship= async (roomCode:string, localId:string, handleResult:Function, handleError:Function)=>{
  try {console.log('ejecutando funcion de verificacion');
    const { data, error } = await supabase
    .rpc("is_owner", { room_id: roomCode });
    handleResult(data);
    console.log("RPC result:", data, error)
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


export const createRoomwithGame = async (localId, nombre, alto, ancho, dispin, codigo,handleResult:Function)=>{
  try{
    console.log("Creando sala con codigo", codigo);
    console.log(nombre, alto, ancho)
    const {data, error} = await supabase.rpc("create_room_with_game", {p_nombre: nombre, p_alto:alto, p_ancho:ancho, p_codigo:codigo, p_ip:'1', p_dispin: dispin});
    handleResult(data);
    console.log(data);
    console.log(error);
  }catch(err){console.log(err)}
}

export const createRoomwithGameIL = async (localId, nombre, alto, ancho, fichero ,dispin, codigo,handleResult:Function)=>{
  try{
    console.log("Creando sala con codigo", codigo);
    console.log(nombre, alto, ancho)
    const {data, error} = await supabase.rpc("create_room_with_game_il", {p_nombre: nombre, p_alto:alto, p_ancho:ancho, p_piezas:fichero ,p_codigo:codigo, p_ip:'1', p_dispin: dispin, });
    handleResult(data);
    console.log('dispin', dispin);
    console.log('fichero', fichero);

    console.log('data', data);
    console.log('error', error);
  }catch(err){console.log(err)}
}

export const SendRoomData = async (alt:number, anc:number, dispin, fichero: PieceType[] ) => {
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

      createRoomwithGameIL(creatorId, 'juego',alt, anc, ficher, dispin ,codSala, ventana );
      localStorage.setItem('salasCreadas', incremento(sc));
      }

    };


