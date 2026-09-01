import { useEffect } from 'react';

// components/AdBanner.tsx - Versión Adsterra
const AdBannerAdsterra = ({ zoneId }: { zoneId: string }) => {
    useEffect(() => {
      const script = document.createElement('script');
      script.src = `//cdn.adsterra.com/js/video_player.js`;
      script.async = true;
      document.head.appendChild(script);
    }, []);
  
    return (
      <div id={`adn-${zoneId}`}>
        <script async src="//cdn.adsterra.com/js/video_player.js"></script>
      </div>
    );
  };
  
  export default AdBannerAdsterra;