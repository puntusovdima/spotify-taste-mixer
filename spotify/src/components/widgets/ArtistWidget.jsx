'use client';

import { useState, useEffect } from 'react';
import { searchItems } from '@/lib/spotify';

export default function ArtistWidget({ onSelect, selectedItems = [] }) {
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
        const artists = await searchItems(query, 'artist');
        setResults(artists);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error al buscar artistas');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleToggleArtist = (artist) => {
    const isSelected = selectedItems.some(item => item.id === artist.id);
    if (isSelected) {
      onSelect(selectedItems.filter(item => item.id !== artist.id));
    } else {
      if (selectedItems.length >= 5) {
        alert('Puedes seleccionar un máximo de 5 artistas.');
        return;
      }
      onSelect([...selectedItems, { id: artist.id, name: artist.name, image: artist.images?.[0]?.url }]);
    }
  };

  return (
    <div className="bg-[#121212] border border-white/[0.05] rounded-2xl p-6 transition-all hover:border-white/[0.1] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎤</span>
          <h2 className="text-lg font-bold">Artistas Favoritos</h2>
        </div>
        <span className="text-xs text-neutral-500 font-semibold bg-white/5 px-2.5 py-1 rounded-full">
          {selectedItems.length}/5
        </span>
      </div>

      {/* Selected Items Tags */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedItems.map(artist => (
            <div
              key={artist.id}
              className="flex items-center gap-1.5 bg-[#1db954]/10 border border-[#1db954]/20 text-[#1db954] text-xs px-2.5 py-1 rounded-full"
            >
              {artist.image && (
                <img src={artist.image} alt={artist.name} className="w-4 h-4 rounded-full object-cover" />
              )}
              <span className="truncate max-w-[120px]">{artist.name}</span>
              <button
                onClick={() => onSelect(selectedItems.filter(item => item.id !== artist.id))}
                className="hover:text-white ml-0.5 cursor-pointer font-bold"
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
          placeholder="Buscar artistas..."
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
          {results.map(artist => {
            const isSelected = selectedItems.some(item => item.id === artist.id);
            return (
              <button
                key={artist.id}
                onClick={() => handleToggleArtist(artist)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1db954]/10 border border-[#1db954]/30'
                    : 'bg-white/[0.02] border border-white/[0.02] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {artist.images?.[2]?.url || artist.images?.[0]?.url ? (
                    <img
                      src={artist.images?.[2]?.url || artist.images?.[0]?.url}
                      alt={artist.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs text-neutral-400">
                      🎤
                    </div>
                  )}
                  <span className="font-medium truncate max-w-[180px]">{artist.name}</span>
                </div>
                {isSelected && (
                  <span className="text-[#1db954] text-xs font-semibold flex items-center gap-1">
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
