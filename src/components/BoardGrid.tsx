import { cn } from "@/lib/utils";
import { BoardPiece, PieceType, Position } from "@/types/game";
import { on } from "events";
import { useEffect, useRef, useState } from "react";

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
    onVolverClick?: () => void; 
  }

  export function BoardGrid({ 
    rows, cols, pieces, pieceTypes,
    validMoves = [], selected = null, targetCells = [],
    winner = null, onCellClick, onVolverClick
  }: BoardGridProps) {
    const cellSize = Math.min(Math.floor(600 / Math.max(rows, cols)), 64);
    const [movedFromCell, setMovedFromCell] = useState<string | null>(null);
    const prevPiecesRef = useRef<BoardPiece[]>([]);
  
    // Detectar qué pieza se movió
    useEffect(() => {
      let moved: string | null = null;
      
      pieces.forEach(newPiece => {
        // Buscar si esta pieza está en diferente posición
        const oldPiece = prevPiecesRef.current.find(p => 
          p.player === newPiece.player && 
          p.pieceTypeIndex === newPiece.pieceTypeIndex &&
          (p.row !== newPiece.row || p.col !== newPiece.col)
        );
        
        if (oldPiece) {
          // Recordar de dónde vino
          moved = `${oldPiece.row}-${oldPiece.col}`;
        }
      });
      
      setMovedFromCell(moved);
      prevPiecesRef.current = pieces;
      
      // Limpiar después de la animación
      if (moved) {
        const timer = setTimeout(() => {
          setMovedFromCell(null);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }, [pieces]);
  
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
            
            // Calcular si esta pieza se está animando
            const isAnimating = piece && movedFromCell === `${piece.row}-${piece.col}`;
            let offsetRow = 0;
            let offsetCol = 0;
            
            if (isAnimating) {
              const [oldRow, oldCol] = movedFromCell!.split('-').map(Number);
              offsetRow = oldRow - row;
              offsetCol = oldCol - col;
            }
  
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
                    src={pt.img_url}
                    alt={pt.name}
                    draggable={false}
                    className={cn(
                      "w-4/5 h-4/5 object-contain rounded-full transition-transform",
                      isAnimating && "duration-500 ease-out",
                      piece.player === 1
                        ? "ring-2 ring-player1 bg-player1/10"
                        : "ring-2 ring-player2 bg-player2/10"
                    )}
                    style={{
                      transform: isAnimating 
                        ? `translate(${offsetCol * cellSize}px, ${offsetRow * cellSize}px)`
                        : `translate(0, 0)`,
                    }}
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
              <button
                onClick={() => onVolverClick && onVolverClick()}
                className="px-4 py-2 bg-primary text-background rounded hover:bg-primary/80"
              >
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }