'use client';

import { useState } from 'react';
import { Guitar } from 'lucide-react';

const AVAILABLE_GENRES = [
  'acoustic', 'alternative', 'ambient', 'blues', 'classical',
  'country', 'dance', 'disco', 'electro', 'electronic',
  'folk', 'funk', 'grunge', 'heavy-metal', 'hip-hop',
  'house', 'indie', 'indie-pop', 'jazz', 'latin',
  'metal', 'pop', 'punk', 'r-n-b', 'reggae',
  'reggaeton', 'rock', 'salsa', 'samba', 'soul',
  'spanish', 'techno', 'trance', 'trip-hop'
];

export default function GenreWidget({ onSelect, selectedItems = [] }) {
  const [search, setSearch] = useState('');

  const filteredGenres = AVAILABLE_GENRES.filter(genre =>
    genre.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleGenre = (genre) => {
    const isSelected = selectedItems.includes(genre);
    if (isSelected) {
      onSelect(selectedItems.filter(item => item !== genre));
    } else {
      if (selectedItems.length >= 5) {
        alert('Puedes seleccionar un máximo de 5 géneros.');
        return;
      }
      onSelect([...selectedItems, genre]);
    }
  };

  return (
    <div className="bg-[#121212] border border-white/[0.05] rounded-2xl p-6 transition-all hover:border-white/[0.1] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Guitar className="w-5 h-5 text-[#1db954]" />
          <h2 className="text-lg font-bold">Géneros Musicales</h2>
        </div>
        <span className="text-xs text-neutral-500 font-semibold bg-white/5 px-2.5 py-1 rounded-full">
          {selectedItems.length}/5
        </span>
      </div>

      {/* Selected Items Tags */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedItems.map(genre => (
            <div
              key={genre}
              className="flex items-center gap-1.5 bg-[#1db954]/10 border border-[#1db954]/20 text-[#1db954] text-xs px-2.5 py-1 rounded-full"
            >
              <span className="capitalize">{genre}</span>
              <button
                onClick={() => onSelect(selectedItems.filter(item => item !== genre))}
                className="hover:text-white ml-0.5 cursor-pointer font-bold"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filter Input */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filtrar géneros..."
        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#1db954] placeholder-neutral-500 transition-all mb-3"
      />

      {/* Grid List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
        {filteredGenres.map(genre => {
          const isSelected = selectedItems.includes(genre);
          return (
            <button
              key={genre}
              onClick={() => handleToggleGenre(genre)}
              className={`py-1.5 px-3 rounded-lg text-left text-xs font-medium capitalize transition-all truncate cursor-pointer border ${
                isSelected
                  ? 'bg-[#1db954]/10 border-[#1db954]/30 text-[#1db954]'
                  : 'bg-white/[0.02] border-transparent hover:bg-white/5 text-neutral-300'
              }`}
            >
              <span className="mr-1">{isSelected ? '✓' : ''}</span>
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
