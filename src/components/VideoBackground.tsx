import React, { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  lowPowerMode?: boolean;
}

const VideoBackground = ({ lowPowerMode = false }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      
      // Lazy load the video for better performance
      if ('loading' in HTMLImageElement.prototype) {
        videoRef.current.loading = 'lazy';
      }
      
      // Reduce quality in low power mode
      if (lowPowerMode && videoRef.current.canPlayType('video/webm')) {
        videoRef.current.src = "https://cdn.pixabay.com/vimeo/328940142/ink-16798.webm?width=640&hash=7fb034c887d1f07af6494ad5c1d5a78f0aa20e88";
      }
    }
  }, [lowPowerMode]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden video-container">
      {/* Placeholder for the video while it loads */}
      <div className="absolute inset-0 bg-urdu-dark animate-pulse"></div>
      
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute min-w-full min-h-full object-cover"
        aria-hidden="true"
      >
        <source
          src="https://cdn.pixabay.com/vimeo/328940142/ink-16798.mp4?width=1280&hash=7fb034c887d1f07af6494ad5c1d5a78f0aa20e88"
          type="video/mp4"
        />
        <source 
          src="https://cdn.pixabay.com/vimeo/328940142/ink-16798.webm?width=1280&hash=7fb034c887d1f07af6494ad5c1d5a78f0aa20e88" 
          type="video/webm" 
        />
        {/* Fallback message for browsers that don't support video */}
        <p>Your browser does not support HTML video.</p>
      </video>
    </div>
  );
};

export default VideoBackground;