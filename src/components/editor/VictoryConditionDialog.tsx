import { useState } from "react";
import { useGameEditor } from "@/context/GameEditorContext";
import { VictoryCondition, Position } from "@/types/game";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PlayerSwitch } from "../ui/mini/player-switch";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plyr:number;
}

export function VictoryConditionDialog({ open, onOpenChange, plyr }: Props) {
  const {
    boardRows, boardCols, pieceTypes,
    victoryConditions, addVictoryCondition, removeVictoryCondition,
  } = useGameEditor();

  const [mode, setMode] = useState<'arrival' | 'capture'>('capture');
  const [pieceTypeId, setPieceTypeId] = useState('');
  const [targetCells, setTargetCells] = useState<Position[]>([]);
  const [player, setPlayer] = useState(plyr);

  const toggleCell = (row: number, col: number) => {
    setTargetCells(prev => {
      const exists = prev.some(c => c.row === row && c.col === col);
      return exists ? prev.filter(c => !(c.row === row && c.col === col)) : [...prev, { row, col }];
    });
  };

  const handleAdd = () => {
    if (!pieceTypeId) return;
    const vc: VictoryCondition = {
      mode, pieceTypeId,
      ...(mode === 'arrival' ? { targetCells: [...targetCells] } : {}),
    };
    addVictoryCondition(vc, player-1);
    setTargetCells([]);
    setPieceTypeId('');
  };

  const cellSize = Math.min(Math.floor(320 / Math.max(boardRows, boardCols)), 28);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Condiciones de Victoria</DialogTitle>
          <PlayerSwitch blocking={!open} change={setPlayer} plyr={player}/>
        </DialogHeader>

        {victoryConditions[player-1].length > 0 && (
          <div className="space-y-1">
            {victoryConditions[player-1].map((vc, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-secondary rounded text-sm">
                <span>
                  {vc.mode === 'arrival' ? '🏁 Llegada' : '⚔️ Captura'}:{' '}
                  {pieceTypes.find(pt => pt.id === vc.pieceTypeId)?.name || '?'}
                  {vc.targetCells && ` (${vc.targetCells.length} casillas)`}
                </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {console.log("RMCInit"); removeVictoryCondition(i, player-1) }}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium">Agregar condición</p>

          <div className="flex gap-2">
            <Button variant={mode === 'arrival' ? 'default' : 'outline'} size="sm"
              onClick={() => setMode('arrival')}>Llegada</Button>
            <Button variant={mode === 'capture' ? 'default' : 'outline'} size="sm"
              onClick={() => setMode('capture')}>Extinción</Button>
          </div>

          <Select value={pieceTypeId} onValueChange={setPieceTypeId}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Seleccionar tipo de ficha" />
            </SelectTrigger>
            <SelectContent>
              {pieceTypes.map(pt => (
                <SelectItem key={pt.id} value={pt.id}>{pt.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {mode === 'arrival' && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Click en las casillas objetivo (marcadas en rojo)
              </p>
              <div className="flex justify-center">
                <div className="grid border border-border rounded overflow-hidden"
                  style={{ gridTemplateColumns: `repeat(${boardCols}, ${cellSize}px)` }}>
                  {Array.from({ length: boardRows * boardCols }).map((_, i) => {
                    const row = Math.floor(i / boardCols);
                    const col = i % boardCols;
                    const isSelected = targetCells.some(c => c.row === row && c.col === col);
                    return (
                      <div key={i} onClick={() => toggleCell(row, col)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          (row + col) % 2 === 0 ? "bg-board-light" : "bg-board-dark",
                          isSelected && "ring-2 ring-inset ring-destructive bg-destructive/30",
                        )}
                        style={{ width: cellSize, height: cellSize }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleAdd} size="sm" className="w-full"
            disabled={!pieceTypeId || (mode === 'arrival' && targetCells.length === 0)}>
            Agregar condición
          </Button>

          <p className="text-xs text-muted-foreground">
            {mode === 'arrival'
              ? "El primer jugador cuya ficha de este tipo llegue a una casilla objetivo gana."
              : "Si todas las fichas de este tipo de un jugador son capturadas, el otro jugador gana."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
