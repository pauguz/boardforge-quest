import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

type ErrorType = '404' | 'room-not-found' | 'game-error';

interface ErrorMessages {
  title: string;
  message: string;
}

const errorMessages: Record<ErrorType, ErrorMessages> = {
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

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorType: ErrorType = (location.state?.error as ErrorType) || '404';
  const { title, message } = errorMessages[errorType];

  useEffect(() => {
    console.error(`${errorType} Error:`, location.state?.details || location.pathname);
  }, [location.pathname, errorType, location.state]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{title}</h1>
        <p className="mb-8 text-xl text-muted-foreground">{message}</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="text-primary underline hover:text-primary/90"
          >
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