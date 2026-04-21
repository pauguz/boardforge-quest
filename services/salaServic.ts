import { AlertOctagon } from 'lucide-react';
import {supabase} from '../src/utils/supabaseClient'

    // 1. Definimos la función asíncrona DENTRO del useEffect
export const obtenerDatos = async (roomId:string, Carga:Function, handleResult:Function, handleError:Function ) => {
      console.log("intentando obtener datos de", roomId)
      try {
        Carga(true);
        
        const { data, error } = await supabase
          .from('ludisala')
          .select('*')
          .eq('codigo', roomId)
          .setHeader('local-id', '');
      console.log("datos obtenidos de la bd: ", data[0] )
        if (error) throw error;
        handleResult(data[0]);
      } catch (err) {
        handleError(err.message);
      } finally {
        Carga(false);
      }
    };

export const verifyAuthorship= async (roomId:string, localId:string, handleResult:Function, handleError:Function)=>{
  try {console.log('ejecutando funcion de verificacion');
    const { data, error } = await supabase
    .rpc("is_owner", { room_id: roomId })
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


export const createRoomwithGame = async (localId, nombre, alto, ancho, dispin, codigo, handleResult:Function)=>{
  try{
    console.log("Creando sala con codigo", codigo);
    console.log(nombre, alto, ancho)
    const {data, error} = await supabase.rpc("create_room_with_game", {p_nombre: nombre, p_alto:alto, p_ancho:ancho, p_codigo:codigo, p_ip:'1'}).setHeader("local-id", localId);
    handleResult(data);
    console.log(data);
    console.log(error);
  }catch(err){console.log(err)}
}

const getRoomNumber = async(localId:string)=>{
  
}

//En esta version supones que el boardRows y boardCols llegan ya en binario
// NOTE: legacy/unused helper. Cast to any to bypass strict typing of the
// generated Supabase Database types (columns are typed as `unknown`).
const createRoom = async (boardRows: number, boardCols: number) => {
  const sc: number = 0;
  const sb: any = supabase;
  if (sc < 3) {
    console.log('Iniciando Creacion de Sala y Juego, sc: ', sc);
    if (sc >= 1) {
      const juego_id = localStorage.getItem('juego_id');
      const { data, error } = await sb
        .from('juego')
        .update([{ nombre: 'Juego', alto: boardRows, ancho: boardCols, magnitud: 2, public: 0 }])
        .eq('id', juego_id)
        .select();
      console.log(data);
      if (error) {
        console.error('Error al insertar:', error.message);
      } else {
        console.log('Registro creado:', data);
      }
    } else {
      localStorage.setItem('creador', crypto.randomUUID());
      const { data, error } = await sb
        .from('juego')
        .insert([{ nombre: 'Juego', alto: boardRows, ancho: boardCols, magnitud: 2, public: 0 }])
        .select();
      console.log('datos: ', data);
      if (data && data[0]) localStorage.setItem('juego_id', String(data[0].id));
      if (error) {
        console.error('Error al insertar:', error.message);
      } else {
        console.log('Registro creado:', data);
      }
    }
    const codSala: string = (globalThis as any).generateRoomId?.() ?? '';

    const { data, error } = await sb
      .from('sala')
      .insert([{ codigo: codSala, ip: '1', juego_id: localStorage.getItem('juego_id'), creador_id: localStorage.getItem('creador') }])
      .select();
    console.log('datos: ', data);
    if (error) {
      console.error('Error al insertar la sala:', error.message);
    } else {
      console.log('Registro creado la tabla:', data);
    }

    (globalThis as any).navigate?.(`/sala/${codSala}`);
    localStorage.setItem('salas_creadas', String((globalThis as any).incremento?.(sc) ?? sc + 1));
  }
};

