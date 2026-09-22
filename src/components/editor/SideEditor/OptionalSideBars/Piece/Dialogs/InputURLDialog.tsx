import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogFooter,  } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/mini/button";

const ALLOWED_PROVIDERS = [
    {
      name: "Pixabay",
      domain: "pixabay.com",
      emoji: "🎨",
      color: "bg-red-50",
      example: "https://cdn.pixabay.com/photo/...",
    },
    {
      name: "Pexels",
      domain: "pexels.com",
      emoji: "📸",
      color: "bg-blue-50",
      example: "https://images.pexels.com/photos/...",
    },
    {
      name: "Unsplash",
      domain: "unsplash.com",
      emoji: "🌅",
      color: "bg-gray-50",
      example: "https://images.unsplash.com/photo/...",
    },
    {
      name: "Imgur",
      domain: "imgur.com",
      emoji: "🖼️",
      color: "bg-green-50",
      example: "https://i.imgur.com/...",
    },
  ];

interface InputURLDialogProps {
    open: boolean;
    onOpenChange: (s:boolean) => void;
    onSubmit: (url: string) => void;
}

const InputURLDialog: React.FC<InputURLDialogProps> = ({ open,  onOpenChange, onSubmit }) => {
    const [url, setUrl] = useState('');
    const handleClose = () => {
        setUrl('');
    };

    const handleSubmit = () => {
        onSubmit(url);
        handleClose();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>Ingresa la URL de tu imagen</DialogTitle>
                    <Input
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()} 
                        value={url}
                    />
                <DialogFooter>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Subir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InputURLDialog;