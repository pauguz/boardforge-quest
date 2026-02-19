import { useState, useRef } from "react";
import { useGameEditor } from "@/context/GameEditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
} from "@/components/ui/context-menu";
import { PieceParametersDialog } from "./PieceParametersDialog";
import { PieceTestDialog } from "./PieceTestDialog";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PieceSidebar() {
  const {
    pieceTypes, addPieceType, removePieceType,
    selectedPieceTypeId, setSelectedPieceTypeId, isPlaying,
  } = useGameEditor();

  const [showNameDialog, setShowNameDialog] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [paramsId, setParamsId] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage(reader.result as string);
      setShowNameDialog(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCreate = () => {
    if (pendingImage && newName.trim()) {
      addPieceType(newName.trim(), pendingImage);
      setShowNameDialog(false);
      setPendingImage(null);
      setNewName('');
    }
  };

  return (
    <div className="w-56 border-l border-border bg-card flex flex-col shrink-0">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-sm font-semibold">Fichas</span>
        <Button variant="outline" size="icon" className="h-7 w-7"
          onClick={() => fileRef.current?.click()} disabled={isPlaying}>
          <Plus className="w-4 h-4" />
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pieceTypes.map(pt => (
          <ContextMenu key={pt.id}>
            <ContextMenuTrigger>
              <div
                onDoubleClick={() => !isPlaying && setSelectedPieceTypeId(pt.id)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent transition-colors",
                  selectedPieceTypeId === pt.id && "bg-accent ring-1 ring-primary"
                )}
              >
                <img src={pt.imageUrl} alt={pt.name} className="w-8 h-8 object-contain rounded" />
                <span className="text-sm truncate flex-1">{pt.name}</span>
                {!isPlaying && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100"
                    onClick={e => { e.stopPropagation(); removePieceType(pt.id); }}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => setParamsId(pt.id)}>Parámetros</ContextMenuItem>
              <ContextMenuItem onClick={() => setTestId(pt.id)}>Pruebas</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
        {pieceTypes.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Agrega fichas con el botón +
          </p>
        )}
      </div>

      {selectedPieceTypeId && (
        <div className="p-2 border-t border-border text-xs text-muted-foreground text-center">
          Seleccionada: {pieceTypes.find(pt => pt.id === selectedPieceTypeId)?.name}
          <Button variant="link" size="sm" className="text-xs ml-1"
            onClick={() => setSelectedPieceTypeId(null)}>
            Deseleccionar
          </Button>
        </div>
      )}

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nombre de la ficha</DialogTitle></DialogHeader>
          {pendingImage && (
            <div className="flex justify-center">
              <img src={pendingImage} alt="preview" className="w-16 h-16 object-contain rounded" />
            </div>
          )}
          <Input value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Ej: Rey, Peón, Torre..." autoFocus
            onKeyDown={e => e.key === 'Enter' && handleCreate()} />
          <DialogFooter>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PieceParametersDialog pieceTypeId={paramsId} open={!!paramsId} onOpenChange={v => !v && setParamsId(null)} />
      <PieceTestDialog pieceTypeId={testId} open={!!testId} onOpenChange={v => !v && setTestId(null)} />
    </div>
  );
}
