import { useState, useRef } from "react";
import { useGameEditor } from "@/context/GameEditorContext";
import { useGeneralEditor } from "@/context/GeneralEditorContext";
import { Button } from "@/components/ui/mini/button";
import { CreatePieceDialog } from "./Piece/Dialogs/CreatePieceDialog";
import {ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,} from "@/components/ui/context-menu";
import { PieceParametersDialog } from "./Piece/Dialogs/PieceParametersDialog";
import { PieceTestDialog } from "./Piece/Dialogs/PieceTestDialog";
import { Plus } from "lucide-react";
import {Input} from "@/components/ui/input";
import SideItem from "./SideItem";
import { UploadModeDialog } from "./Piece/Dialogs/UploadModalDialog";
import { cn } from "@/lib/utils";
import { set } from "date-fns";
import InputURLDialog from "./Piece/Dialogs/InputURLDialog";
import { validateImageUrl } from "./Piece/PieceHelper";

export function PieceSidebar() {
  const {
    pieceTypes, addPieceType, removePieceType,selectedPieceTypeIndex, setSelectedPieceTypeIndex
  } = useGeneralEditor();
  const {isPlaying,}= useGameEditor();

  const [showNameDialog, setShowNameDialog] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [paramsId, setParamsId] = useState<number | null>(null);
  const [testId, setTestId] = useState<number | null>(null);
  const [pendingName, setPendingName] = useState<string|null>(null);
  const [pendingFile, setPendingFile] = useState<File|null>(null);
  const [showUploadModeDialog, setShowUploadModeDialog] = useState(false);
  const [showInputURLDialog, setShowInputURLDialog] = useState(false);
  const [urlError, setUrlError] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    
    setPendingName(fileNameWithoutExtension);
    setPendingFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage(reader.result as string);
      setShowNameDialog(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = (name: string) => {
    if (pendingImage) {
      addPieceType(name, pendingImage);
      setShowNameDialog(false);
      setPendingImage(null);
      setPendingFile(null);
      setUrlError('');
    }
  };

  const handleUrlSubmit = async (urlInput: string) => {
    if (!urlInput.trim()) {
      setUrlError('Ingresa una URL');
      return;
    }
  
    try {
      const isValid = await validateImageUrl(urlInput, setUrlError);
      if (isValid) {
        // Extraer nombre del URL (si es posible)
        const urlObj = new URL(urlInput);
        const fileName = urlObj.pathname.split('/').pop()?.split('.')[0] || 'imagen';
        
        setPendingName(fileName);
        setPendingImage(urlInput);
        setShowInputURLDialog(false);
        setShowNameDialog(true);
        setUrlError('');
      }
    } catch (error) {
      setUrlError('Error al procesar la URL');
      console.error(error);
    }
  };

  return (
    <div className="w-56 border-l border-border bg-card flex flex-col shrink-0">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-sm font-semibold">Fichas</span>
        <Button variant="outline" size="icon" className="h-7 w-7"
          onClick={() => setShowUploadModeDialog(true)}
          disabled={isPlaying}>
          <Plus className="w-4 h-4" />
        </Button>
        <input 
          ref={fileRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pieceTypes.map((pt, index) => (
          <ContextMenu key={index}>
            <ContextMenuTrigger>
              <div 
                className={cn(
                  "rounded-md",
                  selectedPieceTypeIndex === index && "bg-accent ring-1 ring-primary"
                )}>
                <SideItem 
                  gen={pt} 
                  bloqueo={isPlaying} 
                  remotion={() => removePieceType(index)}  
                  selection={() => setSelectedPieceTypeIndex(index)} 
                /> 
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => setParamsId(index)}>
                Parámetros
              </ContextMenuItem>
              <ContextMenuItem onClick={() => setTestId(index)}>
                Pruebas
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
        {pieceTypes.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Agrega fichas con el botón +
          </p>
        )}
      </div>

      {selectedPieceTypeIndex != null && (
        <div className="p-2 border-t border-border text-xs text-muted-foreground text-center">
          Seleccionada: {pieceTypes[selectedPieceTypeIndex]?.name}
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs ml-1"
            onClick={() => setSelectedPieceTypeIndex(null)}>
            Deseleccionar
          </Button>
        </div>
      )}

      <CreatePieceDialog 
        open={showNameDialog} 
        onOpenChange={setShowNameDialog}
        imageUrl={pendingImage}
        imageName={pendingName}
        onConfirm={handleCreate}
      />

      <PieceParametersDialog 
        pieceTypeIndex={paramsId} 
        open={paramsId !== null} 
        onOpenChange={v => !v && setParamsId(null)} 
      />

      <PieceTestDialog 
        pieceTypeIndex={testId} 
        open={testId !== null} 
        onOpenChange={v => !v && setTestId(null)} 
      />

      <UploadModeDialog
        open={showUploadModeDialog}
        onOpenChange={setShowUploadModeDialog}
        onLocalClick={() => fileRef.current?.click()}
        onUrlClick={() => setShowInputURLDialog(true)}
      />

      <InputURLDialog
        open={showInputURLDialog} 
        onOpenChange={setShowInputURLDialog}
        onSubmit={handleUrlSubmit}
      />
    </div>
  );
}