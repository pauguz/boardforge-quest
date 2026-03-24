import { useState } from "react";
import { useGameEditor } from "@/context/GameEditorContext";
import { MovementRule, CaptureMode } from "@/types/game";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { findDirections } from "@/utils/movement";

interface Props {
  pieceTypeId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function PieceParametersDialog({ pieceTypeId, open, onOpenChange }: Props) {
  const { gamePieceTypes: pieceTypes, updateGamePieceType: updatePieceType } = useGameEditor();
  const pieceType = pieceTypes.find(pt => pt.id === pieceTypeId);

  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [moveType, setMoveType] = useState<'unit' |'range' | 'indefinite'>('range');
  const [range, setRange] = useState(2);
  const [rotate, setRotate] = useState(false);

  if (!pieceType) return null;

  const addMovement = () => {
    if (dx === 0 && dy === 0) return;
    const rule: MovementRule = {
      direction: { dx, dy }, type: moveType,
      ...(moveType === 'range' ? { range } : {}), rotate,
    };
    if ( findDirections(pieceType, rule.direction) ) return;
    updatePieceType(pieceType.id, { movements: [...pieceType.movements, rule] });
  };

  const removeMovement = (index: number) => {
    updatePieceType(pieceType.id, {
      movements: pieceType.movements.filter((_, i) => i !== index),
    });
  };

  const setCaptureMode = (mode: CaptureMode) => {
    updatePieceType(pieceType.id, { captureMode: mode });
  };

  const typeLabel = (t: string, r?: number) =>
    t === 'range' ? `Rango ${r}` : 'Indefinido';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src={pieceType.imageUrl} alt="" className="w-6 h-6 object-contain rounded" />
            Parámetros: {pieceType.name}
          </DialogTitle>
        </DialogHeader>

      <div className="space-y-2">
        <p className="text-sm font-medium">Movimientos</p>

        {pieceType.movements.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Sin movimientos configurados
          </p>
        ) : (
          pieceType.movements.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 bg-secondary rounded text-sm flex-wrap"
            >
              <span className="font-mono">
                ({m.direction.dx}, {m.direction.dy})
              </span>

              <Badge variant="secondary">
                {typeLabel(m.type, m.range)}
              </Badge>

              {m.rotate ? (
                <Badge variant="outline">Rotado</Badge>
              ) : null}

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-auto"
                onClick={() => removeMovement(i)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))
        )}
      </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium">Definir dirección</p>
          <div className="flex gap-2 items-end">
            <div>
              <label className="text-xs text-muted-foreground">X (horizontal)</label>
              <Input type="number" value={dx} onChange={e => setDx(Number(e.target.value))} className="w-20 h-8" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Y (vertical)</label>
              <Input type="number" value={dy} onChange={e => setDy(Number(e.target.value))} className="w-20 h-8" />
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <Button variant={moveType === 'range' ? 'default' : 'outline'} size="sm"
              onClick={() => setMoveType('range')}>En rango</Button>
            <Button variant={moveType === 'indefinite' ? 'default' : 'outline'} size="sm"
              onClick={() => setMoveType('indefinite')}>Indefinido</Button>
          </div>

          {moveType === 'range' && (
            <div>
              <label className="text-xs text-muted-foreground">Rango máximo</label>
              <Input type="number" value={range} min={1} onChange={e => setRange(Number(e.target.value))}
                className="w-20 h-8" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch checked={rotate} onCheckedChange={setRotate} />
            <label className="text-sm">Rotar (generar todas las simetrías)</label>
          </div>

          <Button onClick={addMovement} disabled={dx === 0 && dy === 0} size="sm" className="w-full">
            Agregar dirección
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-medium">Modo de captura</p>
          <div className="flex gap-2">
            <Button variant={pieceType.captureMode === 'indian' ? 'default' : 'outline'} size="sm"
              onClick={() => setCaptureMode('indian')}>
              Indio (reemplazo)
            </Button>
            <Button variant={pieceType.captureMode === 'european' ? 'default' : 'outline'} size="sm"
              onClick={() => setCaptureMode('european')}>
              Europeo (pinza)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {pieceType.captureMode === 'indian'
              ? "La ficha se mueve a la casilla del enemigo, eliminándolo."
              : "La ficha captura al enemigo si queda atrapado entre dos fichas aliadas."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
