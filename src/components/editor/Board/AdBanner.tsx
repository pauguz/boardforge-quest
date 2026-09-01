// components/AdBanner.tsx
import { useEffect } from 'react';

interface AdBannerProps {
  adSlotId: string;
  className?: string;
}

const AdBanner = ({ adSlotId, className = '' }: AdBannerProps) => {
  useEffect(() => {
    // Cargar Google Publisher Tag (GPT)
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).googletag = (window as any).googletag || { cmd: [] };
      (window as any).googletag.cmd.push(() => {
        (window as any).googletag.display(adSlotId);
      });
    };

    return () => {
      script.remove();
    };
  }, [adSlotId]);

  return (
    <div 
      id={adSlotId}
      className={`flex justify-center ${className}`}
      style={{
        minHeight: '260px',
        minWidth: '310px'
      }}>
    </div>
  );
};

export default AdBanner;