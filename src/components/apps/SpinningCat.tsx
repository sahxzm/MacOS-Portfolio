import React, { useEffect, useRef } from 'react';

interface SpinningCatProps {
  onClose: () => void;
}

export default function SpinningCat({ onClose }: SpinningCatProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle fullscreen and media playback
  useEffect(() => {
    const playMedia = async () => {
      try {
        if (videoRef.current && audioRef.current) {
          await videoRef.current.play();
          await audioRef.current.play();
        }
      } catch (error) {
        console.error('Error playing media:', error);
      }
    };

    const enterFullscreen = async () => {
      try {
        if (containerRef.current && !document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
        }
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onClose();
      }
    };

    // Initialize
    playMedia();
    enterFullscreen();
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [onClose]);

  // Handle click outside video to close
  const handleClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src="/cat/catvideo.mp4"
        className="max-w-full max-h-full"
        autoPlay
        loop
        muted
        playsInline
        onClick={(e) => e.stopPropagation()}
      />
      <audio
        ref={audioRef}
        src="/cat/cataudio.mp3"
        loop
      />
    </div>
  );
}
