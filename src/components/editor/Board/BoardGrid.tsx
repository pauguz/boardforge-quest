import { useGameEditor } from "@/context/GameEditorContext";
import { useGeneralEditor } from "@/context/GeneralEditorContext";
import { cn } from "@/lib/utils";

export function BoardGrid() {
  const {
    boardRows, boardCols, boardPieces, setBoardPieces,
    currentPlayer, isPlaying, playState, handlePlayClick, victoryConditions,
    
  } = useGameEditor();
  const {selectedPieceTypeCode, pieceTypes, addPieceType, }=useGeneralEditor();
    
  const handleCellClick = (row: number, col: number) => {
    if (isPlaying) {
      handlePlayClick(row, col);
      return;
    }
    const existing = boardPieces.find(p => p.row === row && p.col === col);
    if (existing) {
      setBoardPieces(prev => prev.filter(p => !(p.row === row && p.col === col)));
    } 
    else if (selectedPieceTypeCode) {
      
      setBoardPieces(prev => [...prev, {
        pieceTypeCode: selectedPieceTypeCode, player: currentPlayer, row, col,
      }]);  
    }

  };

  const pieces = isPlaying && playState ? playState.pieces : boardPieces;
  const validMoves = playState?.validMoves || [];
  const selected = playState?.selected;
  const targetCells = victoryConditions.flat()
    .filter(vc => vc.mode === 'arrival' && vc.targetCells)
    .flatMap(vc => vc.targetCells!);

  const cellSize = Math.min(Math.floor(600 / Math.max(boardRows, boardCols)), 64);

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative">
      <div
        className="grid border border-border rounded overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${boardCols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${boardRows}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: boardRows * boardCols }).map((_, i) => {
          const row = Math.floor(i / boardCols);
          const col = i % boardCols;
          const isDark = (row + col) % 2 === 1;
          const piece = pieces.find(p => p.row === row && p.col === col);
          const pt = piece ? pieceTypes.find(t => t.code === piece.pieceTypeCode) : null;
          const isValidMove = validMoves.some(m => m.row === row && m.col === col);
          const isSelected = selected?.row === row && selected?.col === col;
          const isTarget = targetCells.some(t => t.row === row && t.col === col);

          return (
            <div
              key={`${row}-${col}`}
              onClick={() => handleCellClick(row, col)}
              className={cn(
                "flex items-center justify-center cursor-pointer relative transition-colors",
                isDark ? "bg-board-dark" : "bg-board-light",
                isSelected && "ring-2 ring-inset ring-yellow-400",
                isValidMove && !piece && "ring-2 ring-inset ring-primary/70",
                isTarget && "border-2 border-destructive",
              )}
              style={{ width: cellSize, height: cellSize }}
            >
              {piece && pt && (
                <img
                  src={pt.imageUrl}
                  alt={pt.name}
                  draggable={false}
                  className={cn(
                    "w-4/5 h-4/5 object-contain rounded-full",
                    piece.player === 1
                      ? "ring-2 ring-player1 bg-player1/10"
                      : "ring-2 ring-player2 bg-player2/10"
                  )}
                />
              )}
              {isValidMove && !piece && (
                <div className="w-3 h-3 rounded-full bg-primary/50" />
              )}
              {isValidMove && piece && (
                <div className="absolute inset-0 ring-2 ring-inset ring-primary/70 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {isPlaying && playState?.winner && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">
              ¡Jugador {playState.winner} ha ganado!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
