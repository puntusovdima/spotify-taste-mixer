'use client';

import { useState } from 'react';
import { RefreshCw, Inbox, Music } from 'lucide-react';
import TrackCard from './TrackCard';
import { searchItems } from '@/lib/spotify';

export default function PlaylistDisplay({
  playlist = [],
  favorites = [],
  onRemoveTrack,
  onToggleFavorite,
  onAddTrack,
  onRefresh,
  onSaveToSpotify,
  isGenerating = false,
  isSaving = false,
  currentPlayingTrack = null,
  onPlayTrack
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState('My Taste Mixer Playlist');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const tracks = await searchItems(q, 'track');
      setSearchResults(tracks);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddTrack = (track) => {
    onAddTrack({
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      uri: track.uri
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!playlistName.trim()) return;
    onSaveToSpotify(playlistName);
    setShowSaveModal(false);
  };

  const totalDurationMs = playlist.reduce((sum, track) => sum + track.duration_ms, 0);
  const totalMinutes = Math.floor(totalDurationMs / 60000);

  return (
    <div className="bg-[#121212] border border-white/[0.05] rounded-2xl p-6 shadow-xl flex flex-col h-full sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Playlist Mezclada</h2>
          {playlist.length > 0 && (
            <p className="text-xs text-neutral-400 mt-1">
              {playlist.length} canciones • {totalMinutes} min
            </p>
          )}
        </div>

        {playlist.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              disabled={isGenerating}
              className="p-2 bg-neutral-900 border border-white/10 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition cursor-pointer disabled:opacity-40"
              title="Regenerar playlist"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setShowSaveModal(true)}
              className="bg-[#1db954] text-black font-semibold text-xs px-4 py-2 rounded-full hover:scale-105 transition shadow-md hover:shadow-[#1db954]/20 cursor-pointer"
            >
              Exportar a Spotify
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-6 max-h-[420px] pr-1 custom-scrollbar min-h-[150px]">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500 gap-3">
            <div className="w-8 h-8 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs">Generando mezcla perfecta...</p>
          </div>
        ) : playlist.length > 0 ? (
          playlist.map(track => {
            const isFav = favorites.some(f => f.id === track.id);
            return (
              <TrackCard
                key={track.id}
                track={track}
                onRemove={onRemoveTrack}
                onToggleFavorite={onToggleFavorite}
                isFavorite={isFav}
                isPlaying={currentPlayingTrack?.id === track.id}
                onPlay={onPlayTrack}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-2xl p-6">
            <Inbox className="w-12 h-12 mb-3 text-neutral-600" strokeWidth={1} />
            <p className="text-sm font-semibold mb-1 text-neutral-300">Playlist vacía</p>
            <p className="text-xs text-neutral-500 max-w-[200px]">
              Selecciona tus preferencias musicales en los widgets de la izquierda y haz clic en "Generar Playlist".
            </p>
          </div>
        )}
      </div>

      {playlist.length > 0 && (
        <div className="border-t border-white/[0.05] pt-4 relative">
          <label className="block text-xs font-semibold text-neutral-400 mb-2">
            ¿Quieres añadir más canciones?
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar y añadir canción..."
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1db954] placeholder-neutral-500 transition"
            />
            {searchLoading && (
              <div className="absolute right-3 top-3.5 border-2 border-[#1db954] border-t-transparent rounded-full h-3.5 w-3.5 animate-spin"></div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-xl max-h-48 overflow-y-auto z-20 shadow-2xl p-1.5 space-y-1">
              {searchResults.map(track => (
                <button
                  key={track.id}
                  onClick={() => handleAddTrack(track)}
                  className="w-full flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg text-left text-xs text-neutral-300 hover:text-white truncate cursor-pointer"
                >
                  {track.album?.images?.[2]?.url ? (
                    <img src={track.album.images[2].url} className="w-6 h-6 rounded" alt="" />
                  ) : (
                    <div className="w-6 h-6 bg-neutral-800 flex items-center justify-center">
                      <Music className="w-3 h-3 text-neutral-500" />
                    </div>
                  )}
                  <div className="truncate flex-1">
                    <span className="font-semibold block truncate">{track.name}</span>
                    <span className="text-[10px] text-neutral-500 truncate">{track.artists.map(a => a.name).join(', ')}</span>
                  </div>
                  <span className="text-[#1db954] font-bold text-lg px-2">+</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <form
            onSubmit={handleSaveSubmit}
            className="bg-[#181818] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col gap-4"
          >
            <h3 className="text-lg font-bold">Exportar a Spotify</h3>
            <p className="text-xs text-neutral-400">
              Esta acción creará una nueva lista de reproducción en tu biblioteca de Spotify con todas las canciones de la mezcla actual.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400">Nombre de la Playlist</label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1db954]"
              />
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-xs font-semibold hover:text-white text-neutral-400 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-[#1db954] text-black font-bold text-xs rounded-full cursor-pointer hover:scale-105 transition"
              >
                {isSaving ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
