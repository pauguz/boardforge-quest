import { GameEditorProvider, useGameEditor } from '@/context/GameEditorContext';
import { exportGameAsHTML } from '@/utils/gameExport';
import React, { useEffect, useState } from 'react'

const TransitionPage = () => {
    const [seconds, setSeconds] = useState(10);
    const {
            boardRows, boardCols, 
            pieceTypes, boardPieces, victoryConditions,
        } = useGameEditor();
    const handleDownload = () => {
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
        handleDownload();
      }
    }, [seconds]);
  
    return (
    <GameEditorProvider>
      <div className="flex flex-col items-center">
        <h2>Tu descarga comenzará en {seconds} segundos...</h2>
        
        {/* ESPACIO PARA EL ANUNCIO DE ADSENSE */}
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        
        {/*<p>Si no inicia, <a href="URL_REAL">haz clic aquí</a>.</p>*/}
      </div>
     </GameEditorProvider>
    );
}

export default TransitionPage;
