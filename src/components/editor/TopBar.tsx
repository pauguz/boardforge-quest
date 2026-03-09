import { useState } from "react";
import { useGameEditor } from "@/context/GameEditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { VictoryConditionDialog } from "./VictoryConditionDialog";
import { exportGameAsHTML } from "@/utils/gameExport";
import { Play, Square, Download, Trophy } from "lucide-react";
import { PlayerSwitch } from "../ui/mini/player-switch";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const {
    boardRows, boardCols, setBoardRows, setBoardCols,
    currentPlayer, setCurrentPlayer,
    isPlaying, startGame, stopGame, playState,
    pieceTypes, boardPieces, victoryConditions,
  } = useGameEditor();
  const [showVictory, setShowVictory] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-card shrink-0 flex-wrap" >

        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Filas</span>
          <Input type="number" min={2} max={20} value={boardRows}
            onChange={e => setBoardRows(Math.max(2, Math.min(20, Number(e.target.value))))}
            className="w-16 h-8" disabled={isPlaying} />
          <span className="text-muted-foreground">×</span>
          <Input type="number" min={2} max={20} value={boardCols}
            onChange={e => setBoardCols(Math.max(2, Math.min(20, Number(e.target.value))))}
            className="w-16 h-8" disabled={isPlaying} />
        </div>

        <div className="h-5 w-px bg-border" />

        <PlayerSwitch blocking={isPlaying} change={setCurrentPlayer} plyr={currentPlayer} />

        <div className="h-5 w-px bg-border" />

        <Button variant="outline" size="sm" onClick={() => setShowVictory(true)} disabled={isPlaying}>
          <Trophy className="w-4 h-4 mr-1" /> Victoria
        </Button>

        {isPlaying ? (
          <Button variant="destructive" size="sm" onClick={stopGame}>
            <Square className="w-4 h-4 mr-1" /> Detener
          </Button>
        ) : (
          <Button size="sm" onClick={startGame} disabled={boardPieces.length === 0}>
            <Play className="w-4 h-4 mr-1" /> Correr
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={handleDownload} disabled={boardPieces.length === 0 || isPlaying}>
          <Download className="w-4 h-4 mr-1" /> Descargar
        </Button>

        {isPlaying && playState && (
          <div className="ml-auto text-sm font-medium">
            {playState.winner
              ? <span className="text-primary text-lg">¡Jugador {playState.winner} ha ganado!</span>
              : <span>Turno: <span className={playState.turn === 1 ? "text-player1" : "text-player2"}>
                  Jugador {playState.turn}
                </span></span>
            }
          </div>
        )}
      </div>
      <VictoryConditionDialog open={showVictory} onOpenChange={setShowVictory} plyr={currentPlayer}/>
    </>
  );
}
