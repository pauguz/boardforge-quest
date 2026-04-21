import { useState, useMemo } from "react";
import { useGameEditor } from "@/context/GameEditorContext";
import { BoardPiece, Position } from "@/types/game";
import { getValidMoves } from "@/utils/movement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGeneralEditor } from "@/context/GeneralEditorContext";

interface Props {
  pieceTypeCode: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function PieceTestDialog({ pieceTypeCode, open, onOpenChange }: Props) {
  const { boardRows, boardCols } = useGameEditor();
  const { pieceTypes,} = useGeneralEditor();
  const pieceType = pieceTypes.find(pt => pt.code === pieceTypeCode);
  const [testPos, setTestPos] = useState<Position>({ row: Math.floor(boardRows / 2), col: Math.floor(boardCols / 2) });
  const [showMoves, setShowMoves] = useState(false);

  const validMoves = useMemo(() => {
    if (!pieceType || !showMoves) return [];
    const testPiece: BoardPiece = { pieceTypeCode: pieceType.code, player: 1, row: testPos.row, col: testPos.col };
    const { moves } = getValidMoves(testPiece, pieceType, [testPiece], boardRows, boardCols);
    return moves;
  }, [pieceType, testPos, showMoves, boardRows, boardCols]);

  if (!pieceType) return null;

  const cellSize = Math.min(Math.floor(450 / Math.max(boardRows, boardCols)), 40);

  const handleClick = (row: number, col: number) => {
    if (row === testPos.row && col === testPos.col) {
      setShowMoves(!showMoves);
    } else {
      setTestPos({ row, col });
      setShowMoves(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src={pieceType.imageUrl} alt="" className="w-6 h-6 object-contain rounded" />
            Probar: {pieceType.name}
          </DialogTitle>
          <DialogDescription>
            Click en la ficha para ver movimientos. Click en otra casilla para reposicionar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <div className="grid border border-border rounded overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${boardCols}, ${cellSize}px)` }}>
            {Array.from({ length: boardRows * boardCols }).map((_, i) => {
              const row = Math.floor(i / boardCols);
              const col = i % boardCols;
              const isPiece = testPos.row === row && testPos.col === col;
              const isValid = validMoves.some(m => m.row === row && m.col === col);

              return (
                <div key={i} onClick={() => handleClick(row, col)}
                  className={cn(
                    "flex items-center justify-center cursor-pointer",
                    (row + col) % 2 === 0 ? "bg-board-light" : "bg-board-dark",
                    isValid && "ring-2 ring-inset ring-primary/70",
                    isPiece && showMoves && "ring-2 ring-inset ring-yellow-400",
                  )}
                  style={{ width: cellSize, height: cellSize }}>
                  {isPiece && (
                    <img src={pieceType.imageUrl} alt={pieceType.name}
                      className="w-4/5 h-4/5 object-contain" draggable={false} />
                  )}
                  {isValid && !isPiece && (
                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
