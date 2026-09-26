import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/mini/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
 
interface InputURLDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string) => void;
}
 
// Dominios permitidos con información
const ALLOWED_PROVIDERS = [
  {
    name: "Pixabay",
    domain: "pixabay.com",
    emoji: "🎨",
    example: "https://cdn.pixabay.com/photo/...",
  },
  {
    name: "Pexels",
    domain: "pexels.com",
    emoji: "📸",
    example: "https://images.pexels.com/photos/...",
  },
  {
    name: "Unsplash",
    domain: "unsplash.com",
    emoji: "🌅",
    example: "https://images.unsplash.com/photo/...",
  },
  {
    name: "Imgur",
    domain: "imgur.com",
    emoji: "🖼️",
    example: "https://i.imgur.com/...",
  },
];
 
export default function InputURLDialog({
  open,
  onOpenChange,
  onSubmit,
}: InputURLDialogProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(urlInput);
    setIsLoading(false);
    setUrlInput("");
  };
 
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && urlInput.trim()) {
      handleSubmit();
    }
  };
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ingresar URL de imagen</DialogTitle>
          <DialogDescription>
            Proporciona una imagen de un proveedor permitido
          </DialogDescription>
        </DialogHeader>
 
        <div className="space-y-4 py-4">
          {/* Input */}
          <Input
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="text-sm"
          />
 
          {/* Proveedores permitidos */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-2">
              Proveedores permitidos:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALLOWED_PROVIDERS.map((provider) => (
                <div
                  key={provider.domain}
                  className={`p-3 rounded border border-border`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{provider.emoji}</span>
                    <span className="font-medium text-sm">{provider.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 ml-auto" />
                  </div>
                  <p className="text-xs text-muted-foreground break-words">
                    {provider.domain}
                  </p>
                </div>
              ))}
            </div>
          </div>
 
          {/* Tip */}
          <Alert >
            <AlertDescription className="text-xs ">
              💡 <strong>Tip:</strong> En cada sitio, busca la imagen, haz click derecho y 
              selecciona "Copiar dirección de imagen" para obtener la URL correcta.
            </AlertDescription>
          </Alert>
        </div>
 
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setUrlInput("");
            }}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!urlInput.trim() || isLoading}
          >
            {isLoading ? "Validando..." : "Cargar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}