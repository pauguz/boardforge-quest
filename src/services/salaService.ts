import { AlertOctagon } from 'lucide-react';
import {supabase} from '../utils/supabaseClient';

import { PieceType } from '@/types/game';
import {base64ToBlob, ficheroToBlob, generateRoomCode, incremento, localInt} from '../utils/roomCode';
import { gqlQuery } from '@/api/graphql';
import { QUERY_LUDISALA_POR_CODE, QUERY_PIEZAS_POR_JUEGO } from '@/api/queries';
import { mapSalaToPlayState } from '@/api/mappers';

export const nodeLudiSalaByCode = async (roomCode:string, Espera:Function, handleResult1:Function, handleResult2:Function, handleError:Function ) => {
  console.log("intentando obtener datos de", roomCode)
      try {
        const data = await gqlQuery(QUERY_LUDISALA_POR_CODE, { codigo: roomCode });
        const node = data.ludisalaCollection.edges[0]?.node;
        if (!node) return;
    
        handleResult1(node);
    
        const piezasData = await gqlQuery(QUERY_PIEZAS_POR_JUEGO, { juegoId: node.juego_id });
        const piezas = piezasData.piezaTipoCollection.edges.map(e => e.node);
        const playState = mapSalaToPlayState(node, piezas);
        handleResult2(playState);
      } catch (err) {
        handleError(err.message);
      } finally {
        Espera(false);
      }
}

export const selectLudiSalaByCode = async (roomCode:string, Espera:Function, handleResult:Function, handleError:Function ) => {
      console.log("intentando obtener datos de", roomCode)
      try {
        Espera(true);
        
        const { data, error } = await supabase
          .from('ludisala')
          .select('*')
          .eq('codigo', roomCode)
          .setHeader('local-id', '');
      console.log("datos obtenidos de la bd: ", data[0] )
        if (error) throw error;
        handleResult(data[0]);
      } catch (err) {
        handleError(err.message);
      } finally {
        Espera(false);
      }
    };

export const verifyAuthorship= async (roomCode:string, localId:string, handleResult:Function, handleError:Function)=>{
  try {console.log('ejecutando funcion de verificacion');
    const { data, error } = await supabase
    .rpc("is_owner", { room_id: roomCode })
    .setHeader("local-id", localId);
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
    .delete().eq('id', datos.sala_id).setHeader("local-id", localId );
    
  } catch(err){handleError(err.message); console.log(err);}
}

export const countRoomsperUser = async (localId, handleResult,handleError)=>{
  try{ 
    console.log("contando salas", localId);
    const {data, error} = await supabase.rpc("count_my_rooms").setHeader("local-id", localId);
    handleResult(data)
  } catch(err){handleError(err.message);}
}


export const createRoomwithGame = async (localId, nombre, alto, ancho, dispin, codigo,handleResult:Function)=>{
  try{
    console.log("Creando sala con codigo", codigo);
    console.log(nombre, alto, ancho)
    const {data, error} = await supabase.rpc("create_room_with_game", {p_nombre: nombre, p_alto:alto, p_ancho:ancho, p_codigo:codigo, p_ip:'1', p_dispin: dispin}).setHeader("local-id", localId);
    handleResult(data);
    console.log(data);
    console.log(error);
  }catch(err){console.log(err)}
}

export const createRoomwithGameIL = async (localId, nombre, alto, ancho, fichero ,dispin, codigo,handleResult:Function)=>{
  try{
    console.log("Creando sala con codigo", codigo);
    console.log(nombre, alto, ancho)
    const {data, error} = await supabase.rpc("create_room_with_game_il", {p_nombre: nombre, p_alto:alto, p_ancho:ancho, p_piezas:fichero ,p_codigo:codigo, p_ip:'1', p_dispin: dispin, }).setHeader("local-id", localId);
    handleResult(data);
    console.log('dispin', dispin);
    console.log('fichero', fichero);

    console.log('data', data);
    console.log('error', error);
  }catch(err){console.log(err)}
}

export const SendRoomData = async (alt:number, anc:number, dispin, fichero: PieceType[] ) => {
    const ficher= ficheroToBlob(fichero);
    if( ! localStorage.getItem("creador")){
      localStorage.setItem('creador', crypto.randomUUID());
    }

    const creatorId =localStorage.getItem("creador");
    
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


