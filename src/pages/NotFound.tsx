import { useNavigate } from "react-router-dom";

type ErrorType = '404' | 'room-not-found' | 'game-error';

interface NotFoundProps {
  errorType?: ErrorType;
  roomCode?: string;
}

const errorMessages: Record<ErrorType, { title: string; message: string }> = {
  '404': {
    title: '404',
    message: '¡Uups! Página no encontrada'
  },
  'room-not-found': {
    title: 'Sala no encontrada',
    message: 'La sala que intentas acceder no existe o fue eliminada'
  },
  'game-error': {
    title: 'Error en la sala',
    message: 'Ocurrió un error al cargar la sala'
  }
};

const NotFound = ({ errorType = '404', roomCode }: NotFoundProps) => {
  const navigate = useNavigate();
  const { title, message } = errorMessages[errorType];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{title}</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          {message}
          {roomCode && errorType === 'room-not-found' && (
            <div className="mt-2 text-sm">Código: <code className="bg-background px-2 py-1 rounded">{roomCode}</code></div>
          )}
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate(-1)} className="text-primary underline hover:text-primary/90">
            Volver atrás
          </button>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Retornar al Inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;