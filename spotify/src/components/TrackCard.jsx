'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, PlusCircle, CheckCircle2, MinusCircle } from 'lucide-react';

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
    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-transparent rounded-xl hover:bg-white/[0.06] hover:border-white/[0.05] transition-all group">
      <div className="flex items-center gap-4 truncate pr-2">
        <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden shadow-md shadow-black/40">
          {track.album?.images?.[2]?.url || track.album?.images?.[0]?.url ? (
            <img
              src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
              alt={track.name}
              className={`w-full h-full object-cover transition-opacity ${isPlaying ? 'opacity-50' : 'opacity-100'}`}
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              <Music className="w-5 h-5 text-neutral-500" />
            </div>
          )}

          {hasPreview && (
            <button
              onClick={handlePlayPause}
              className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-all cursor-pointer ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-[#1db954] drop-shadow-md" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 text-white drop-shadow-md hover:scale-110 transition-transform" fill="currentColor" />
              )}
            </button>
          )}
        </div>

        <div className="flex flex-col truncate">
          <span className={`font-semibold text-sm truncate transition-colors ${isPlaying ? 'text-[#1db954]' : 'text-neutral-100 group-hover:text-white'}`}>
            {track.name}
          </span>
          <span className="text-xs text-neutral-400 truncate mt-0.5">
            {track.artists?.map(a => a.name).join(', ') || 'Artista Desconocido'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-neutral-500 hidden sm:block font-medium">
          {formatDuration(track.duration_ms)}
        </span>

        <button
          onClick={() => onToggleFavorite(track)}
          className={`transition-all cursor-pointer hover:scale-110 active:scale-95 ${
            isFavorite
              ? 'text-[#1db954]'
              : 'text-neutral-500 hover:text-white'
          }`}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          {isFavorite ? (
            <CheckCircle2 className="w-5 h-5" fill="currentColor" stroke="black" strokeWidth={1} />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={() => onRemove(track.id)}
          className="text-neutral-500 hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          title="Eliminar de la lista"
        >
          <MinusCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
