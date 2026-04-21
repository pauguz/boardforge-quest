import { useState, useRef } from "react";
import { useGameEditor } from "@/context/GameEditorContext";
import { useGeneralEditor } from "@/context/GeneralEditorContext";

import { Button } from "@/components/ui/button";
import { CreatePieceDialog } from "./Dialogs/CreatePieceDialog";
import {ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,} from "@/components/ui/context-menu";
import { PieceParametersDialog } from "./Dialogs/PieceParametersDialog";
import { PieceTestDialog } from "./Dialogs/PieceTestDialog";
import { Plus } from "lucide-react";
import SideItem from "./SideItem";

export function PieceSidebar() {
  const {
    pieceTypes, addPieceType, removePieceType,
  } = useGeneralEditor();

  const {isPlaying,}= useGameEditor();



  const {selectedPieceTypeCode, setSelectedPieceTypeCode}= useGeneralEditor();

  const [showNameDialog, setShowNameDialog] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [paramsId, setParamsId] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string|null>(null);
  const [pendingFile, setPendingFile] = useState<File|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // 1. Extraer el nombre y quitarle la extensión 
    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    
    // 2. Guardar el nombre y el archivo en el estado
    setPendingName(fileNameWithoutExtension);
    setPendingFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage(reader.result as string);
      setShowNameDialog(true);
    };
    reader.readAsDataURL(file);
 

    // Limpiar el input para permitir subir el mismo archivo después si se desea
    //e.target.value = '';
  };

  const handleCreate = (name:string) => {
    if (pendingImage) {
      addPieceType(name, pendingImage, pendingFile);
      setShowNameDialog(false);
      setPendingImage(null);
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
          <ContextMenu key={pt.code}>
            <ContextMenuTrigger>
              <SideItem gen={pt} bloqueo={isPlaying} remotion={removePieceType} selectedID={selectedPieceTypeCode} selection={setSelectedPieceTypeCode} /> 

            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => setParamsId(pt.code)}>Parámetros</ContextMenuItem>
              <ContextMenuItem onClick={() => setTestId(pt.code)}>Pruebas</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))  }
        {pieceTypes.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Agrega fichas con el botón +
          </p>
        )}
      </div>

      {selectedPieceTypeCode && (
        <div className="p-2 border-t border-border text-xs text-muted-foreground text-center">
          Seleccionada: {pieceTypes.find(pt => pt.code === selectedPieceTypeCode)?.name}
          <Button variant="link" size="sm" className="text-xs ml-1"
            onClick={() => {setSelectedPieceTypeCode(null), console.log(pieceTypes)}}>
            Deseleccionar
          </Button>
        </div>
      )}

    <CreatePieceDialog open={showNameDialog} 
            onOpenChange={setShowNameDialog}
            imageUrl={pendingImage}
            imageName={pendingName}
            imageFile={pendingFile}
            onConfirm={handleCreate}
          />

      <PieceParametersDialog pieceTypeCode={paramsId} open={!!paramsId} onOpenChange={v => !v && setParamsId(null)} />
      <PieceTestDialog pieceTypeCode={testId} open={!!testId} onOpenChange={v => !v && setTestId(null)} />
    </div>
  );
}
