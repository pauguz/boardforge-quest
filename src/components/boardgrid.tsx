import { cn } from "@/lib/utils";
import { BoardPiece, PieceType, Position } from "@/types/game";

interface BoardGridProps {
    rows: number;
    cols: number;
    pieces: BoardPiece[];
    pieceTypes: PieceType[];
    validMoves?: Position[];
    selected?: Position | null;
    targetCells?: Position[];
    winner?: number | null;
    onCellClick: (row: number, col: number) => void;
  }
  
  export function BoardGrid({ 
    rows, cols, pieces, pieceTypes,
    validMoves = [], selected = null, targetCells = [],
    winner = null, onCellClick
  }: BoardGridProps) {
    const cellSize = Math.min(Math.floor(600 / Math.max(rows, cols)), 64);
  
    return (
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div
          className="grid border border-border rounded overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const isDark = (row + col) % 2 === 1;
            const piece = pieces.find(p => p.row === row && p.col === col);
            const pt = piece ? pieceTypes[piece.pieceTypeIndex] : null;
            const isValidMove = validMoves.some(m => m.row === row && m.col === col);
            const isSelected = selected?.row === row && selected?.col === col;
            const isTarget = targetCells.some(t => t.row === row && t.col === col);
  
            return (
              <div
                key={`${row}-${col}`}
                onClick={() => onCellClick(row, col)}
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
  
        {winner && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                ¡Jugador {winner} ha ganado!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }