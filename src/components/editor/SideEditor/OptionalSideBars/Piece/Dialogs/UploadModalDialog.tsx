import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/mini/button";
  
  interface UploadModeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLocalClick: () => void;
    onUrlClick: () => void;
  }
  
  export function UploadModeDialog({
    open,
    onOpenChange,
    onLocalClick,
    onUrlClick,
  }: UploadModeDialogProps) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Agregar ficha</DialogTitle>
            <DialogDescription>
              ¿De dónde quieres subir la imagen?
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 py-4">
            <Button
              onClick={() => {
                onLocalClick();
                onOpenChange(false);
              }}
              variant="outline"
              className="h-24 flex flex-col gap-2"
            >
              <span className="text-2xl">📁</span>
              <span className="text-sm">Archivo Local</span>
            </Button>
            <Button
              onClick={() => {
                onUrlClick();
                onOpenChange(false);
              }}
              variant="outline"
              className="h-24 flex flex-col gap-2"
            >
              <span className="text-2xl">🔗</span>
              <span className="text-sm">URL Pública</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }