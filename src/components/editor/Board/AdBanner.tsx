// components/AdBanner.tsx
import { useEffect } from 'react';

interface AdBannerAdsterraProps {
  zoneId: string;
  className?: string;
}

const AdBannerAdsterra = ({ zoneId, className = '' }: AdBannerAdsterraProps) => {
  useEffect(() => {
    // Configurar opciones de Adsterra
    (window as any).atOptions = {
      'key': zoneId,
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };

    // Cargar script de Adsterra
    const script = document.createElement('script');
    script.async = true;
    script.src = '//cdn.adsterra.com/js/video_player.js';
    document.body.appendChild(script);

    return () => {
      // Limpiar si es necesario
      script.remove();
    };
  }, [zoneId]);

  return (
    <div 
      className={`flex justify-center ${className}`}
      style={{
        minHeight: '250px',
        minWidth: '300px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {/* Adsterra inyectará el anuncio aquí automáticamente */}
    </div>
  );
};

export default AdBannerAdsterra;