'use client';

import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { searchItems } from '@/lib/spotify';

export default function TrackWidget({ onSelect, selectedItems = [] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const tracks = await searchItems(query, 'track');
        setResults(tracks);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error al buscar canciones');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleToggleTrack = (track) => {
    const isSelected = selectedItems.some(item => item.id === track.id);
    if (isSelected) {
      onSelect(selectedItems.filter(item => item.id !== track.id));
    } else {
      if (selectedItems.length >= 5) {
        alert('Puedes seleccionar un máximo de 5 canciones.');
        return;
      }
      onSelect([
        ...selectedItems,
        {
          id: track.id,
          name: track.name,
          artists: track.artists.map(a => a.name).join(', '),
          image: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url,
          uri: track.uri
        }
      ]);
    }
  };

  return (
    <div className="bg-[#121212] border border-white/[0.05] rounded-2xl p-6 transition-all hover:border-white/[0.1] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[#1db954]" />
          <h2 className="text-lg font-bold">Canciones Semilla</h2>
        </div>
        <span className="text-xs text-neutral-500 font-semibold bg-white/5 px-2.5 py-1 rounded-full">
          {selectedItems.length}/5
        </span>
      </div>

      {/* Selected Items Tags */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedItems.map(track => (
            <div
              key={track.id}
              className="flex items-center gap-1.5 bg-[#1db954]/10 border border-[#1db954]/20 text-[#1db954] text-xs px-2.5 py-1 rounded-full w-full sm:w-auto"
            >
              {track.image && (
                <img src={track.image} alt={track.name} className="w-4 h-4 rounded object-cover" />
              )}
              <span className="truncate max-w-[120px]">{track.name}</span>
              <button
                onClick={() => onSelect(selectedItems.filter(item => item.id !== track.id))}
                className="hover:text-white ml-auto sm:ml-0.5 cursor-pointer font-bold"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar canciones..."
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#1db954] placeholder-neutral-500 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-3 border-2 border-[#1db954] border-t-transparent rounded-full h-4.5 w-4.5 animate-spin"></div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {/* Results List */}
      {results.length > 0 && (
        <div className="mt-3 max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {results.map(track => {
            const isSelected = selectedItems.some(item => item.id === track.id);
            const artistsNames = track.artists.map(a => a.name).join(', ');
            return (
              <button
                key={track.id}
                onClick={() => handleToggleTrack(track)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1db954]/10 border border-[#1db954]/30'
                    : 'bg-white/[0.02] border border-white/[0.02] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  {track.album?.images?.[2]?.url || track.album?.images?.[0]?.url ? (
                    <img
                      src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                      alt={track.name}
                      className="w-8 h-8 rounded object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                      <Music className="w-4 h-4 text-neutral-500" />
                    </div>
                  )}
                  <div className="flex flex-col truncate">
                    <span className="font-medium truncate">{track.name}</span>
                    <span className="text-xs text-neutral-500 truncate">{artistsNames}</span>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[#1db954] text-xs font-semibold flex items-center gap-1 flex-shrink-0">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
