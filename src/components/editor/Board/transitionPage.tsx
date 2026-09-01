import { GameEditorProvider, useGameEditor } from '@/context/GameEditorContext';
import { useGeneralEditor } from '@/context/GeneralEditorContext';
import { exportGameAsHTML } from '@/utils/gameExport';
import AdBanner from './AdBanner';

import React, { useEffect, useState } from 'react'

interface TransitionProps{
  st: (1|2|3),
  request: number,
}

const TransitionPage = ( {st, request=0}: TransitionProps) => {
    const [seconds, setSeconds] = useState(10);
    const shouldShowAds = st === 1 || st === 2;

    const {
            boardRows, boardCols, 
            boardPieces, victoryConditions,
        } = useGameEditor();
    const {pieceTypes, setStatus} = useGeneralEditor();

    const doDownload = () => {
        const html = exportGameAsHTML(boardRows, boardCols, pieceTypes, boardPieces, victoryConditions);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'juego-de-mesa.html';
        a.click();
        URL.revokeObjectURL(url);
      };

    useEffect(() => {
      if (seconds > 0) {
        const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Cuando el contador llega a 0, se inicia la descarga real
        doDownload();
        console.log('ANTES DE setStatus:', { st, seconds });
        setStatus(st)
      }
    }, [seconds]);
  
    return (
      <div className="flex flex-col items-center flex-1">
        <h2 className="text-xl font-bold">
          Tu descarga comenzará en {seconds} segundos...
        </h2>
        
        
        {shouldShowAds && (
          <div className="w-full flex justify-center">
            <AdBanner zoneId="6021715" />
          </div>
        )}
      </div>
    );
}

export default TransitionPage;
