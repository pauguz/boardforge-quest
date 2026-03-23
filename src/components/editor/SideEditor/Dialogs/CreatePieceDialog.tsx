import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreatePieceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  onConfirm: (name: string) => void;
}

export function CreatePieceDialog({ open, onOpenChange, imageUrl, onConfirm }: CreatePieceDialogProps) {
  const [name, setName] = useState("");

  // Limpiar el input cada vez que el diálogo se cierra o se abre con nueva imagen
  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  const handleSubmit = () => {
    if (name.trim()) {
      onConfirm(name.trim());
      // No cerramos aquí, dejamos que el padre decida (aunque lo normal es que el padre cierre)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nombre de la ficha</DialogTitle>
        </DialogHeader>
        
        {imageUrl && (
          <div className="flex justify-center">
            <img src={imageUrl} alt="preview" className="w-16 h-16 object-contain rounded" />
          </div>
        )}
        <Input 
          value={name} 
          onChange={e => setName(e.target.value)}
          placeholder="Ej: Rey, Peón, Torre..." 
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} 
        />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}