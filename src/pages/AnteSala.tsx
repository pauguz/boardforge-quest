import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectLudiSalaByCode, listarJugadoresSala } from '../services/salaService.ts';
import { setupJugadoresListener } from '@/services/juegoService.ts';
import { supabase } from '@/utils/supabaseClient';
import NotFound from './NotFound.tsx';
import LudiSala from './LudiSala.tsx';
const AnteSala = () => {
    const { roomCode } = useParams();
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [dispin, setDispin] = useState(null);
    const [piezaTypes, setPiezaTypes] = useState([]);
    const [codigoToIndex, setCodigoToIndex] = useState({});
  
    useEffect(() => {
        selectLudiSalaByCode(roomCode, 
            setCargando, 
            setDatos, 
            setDispin, 
            setPiezaTypes, 
            setCodigoToIndex, 
            setError);
    }, [roomCode]);
  
  
    if (cargando) return <div>Cargando...</div>;
    if (error) return <NotFound />;
    if (!datos) return <NotFound />;
  
    return (
        <LudiSala 
          datos={datos} 
          setDatos={setDatos}
          dispin={dispin}
          piezaTypes={piezaTypes}
          codigoToIndex={codigoToIndex}
        />
      );
  };

export default AnteSala;