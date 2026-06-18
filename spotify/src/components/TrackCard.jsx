'use client';

import { useState, useRef, useEffect } from 'react';

export default function TrackCard({ track, onRemove, onToggleFavorite, isFavorite }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!track.preview_url) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(track.preview_url);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error('Audio play blocked:', err));
      setIsPlaying(true);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const hasPreview = !!track.preview_url;

  return (
    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group">
      <div className="flex items-center gap-3 truncate pr-2">
        <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
          {track.album?.images?.[2]?.url || track.album?.images?.[0]?.url ? (
            <img
              src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
              alt={track.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xs">
              🎵
            </div>
          )}

          {hasPreview && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-[#1db954]" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white hover:text-[#1db954] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-col truncate">
          <span className="font-semibold text-sm text-neutral-100 truncate group-hover:text-white transition-colors">
            {track.name}
          </span>
          <span className="text-xs text-neutral-400 truncate">
            {track.artists?.map(a => a.name).join(', ') || 'Artista Desconocido'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-500 hidden sm:block">
          {formatDuration(track.duration_ms)}
        </span>

        <button
          onClick={() => onToggleFavorite(track)}
          className={`p-1.5 rounded-full border transition-all cursor-pointer ${
            isFavorite
              ? 'bg-[#1db954]/10 border-[#1db954]/20 text-[#1db954] hover:bg-[#1db954]/20'
              : 'bg-transparent border-transparent text-neutral-500 hover:text-white hover:border-white/10'
          }`}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <svg className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
          </svg>
        </button>

        <button
          onClick={() => onRemove(track.id)}
          className="p-1.5 rounded-full border border-transparent text-neutral-500 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 transition-all cursor-pointer"
          title="Eliminar de la lista"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
