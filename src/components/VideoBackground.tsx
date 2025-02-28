
import React, { useEffect, useRef } from 'react';

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden video-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute min-w-full min-h-full object-cover"
      >
        <source
          src="https://cdn.pixabay.com/vimeo/328940142/ink-16798.mp4?width=1280&hash=7fb034c887d1f07af6494ad5c1d5a78f0aa20e88"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;
