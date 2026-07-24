import React, { useState, useEffect } from 'react';

function MusicPlayer({ audioRef, weddingData }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const musicEnabled = weddingData?.settings?.music_enabled === '1';

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioRef]);

  if (!musicEnabled || !weddingData?.music) return null;

  const togglePlay = () => {
    const audio = audioRef?.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  return (
    <button
      onClick={togglePlay}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[var(--color-border)] shadow-md flex items-center justify-center transition-all hover:scale-110"
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      <span className={`text-sm ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
        {isPlaying ? '♪' : '♪'}
      </span>
    </button>
  );
}

export default MusicPlayer;
