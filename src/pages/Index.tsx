import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="text-6xl font-bold tracking-tight text-foreground mb-2">
        Board<span className="text-primary">Forge</span>
      </h1>
      <p className="text-muted-foreground text-lg mb-10">
        Crea tus propios juegos de mesa de estrategia
      </p>
      <div className="flex flex-col gap-4">
        <Button size="lg" className="text-lg px-10 py-6" onClick={() => navigate('/editor')}>
          Crear Juego
        </Button>

        <Button size="lg" className="text-lg px-10 py-6" onClick={() => navigate('/ayuda')}>
          Ayuda
        </Button>
      </div>
    </div>
  );
};

export default Index;
