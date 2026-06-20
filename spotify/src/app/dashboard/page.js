'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getUserProfile, generatePlaylist, createSpotifyPlaylist } from '@/lib/spotify';
import { Sparkles, Wand2, X, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';
import PlaylistDisplay from '@/components/PlaylistDisplay';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Widget States
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [moodPrefs, setMoodPrefs] = useState({
    enabled: false,
    energy: 50,
    valence: 50,
    danceability: 50,
    acousticness: 50
  });
  const [popularityPrefs, setPopularityPrefs] = useState([0, 100]);

  // Playlist and Favorites States
  const [playlist, setPlaylist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const loadDashboardData = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);

        // Cargar favoritos de localStorage
        const savedFavorites = localStorage.getItem('favorite_tracks');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }

        // Cargar preferencias anteriores si existen
        const savedArtists = localStorage.getItem('pref_artists');
        if (savedArtists) setSelectedArtists(JSON.parse(savedArtists));

        const savedGenres = localStorage.getItem('pref_genres');
        if (savedGenres) setSelectedGenres(JSON.parse(savedGenres));

      } catch (err) {
        console.error(err);
        setError('Error de sesión o API. Por favor inicia sesión de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  // Guardar preferencias en localStorage al cambiar
  useEffect(() => {
    if (selectedArtists.length > 0) {
      localStorage.setItem('pref_artists', JSON.stringify(selectedArtists));
    }
  }, [selectedArtists]);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      localStorage.setItem('pref_genres', JSON.stringify(selectedGenres));
    }
  }, [selectedGenres]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const preferences = {
        artists: selectedArtists,
        tracks: selectedTracks,
        genres: selectedGenres,
        decades: selectedDecades,
        popularity: popularityPrefs,
        mood: moodPrefs.enabled
          ? {
              energy: moodPrefs.energy,
              valence: moodPrefs.valence,
              danceability: moodPrefs.danceability,
              acousticness: moodPrefs.acousticness
            }
          : {}
      };

      const resultPlaylist = await generatePlaylist(preferences);
      setPlaylist(resultPlaylist);
    } catch (err) {
      console.error(err);
      alert('Error al generar la playlist: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveTrack = (trackId) => {
    setPlaylist(playlist.filter(t => t.id !== trackId));
  };

  const handleToggleFavorite = (track) => {
    let updated;
    const isFav = favorites.some(f => f.id === track.id);
    if (isFav) {
      updated = favorites.filter(f => f.id !== track.id);
    } else {
      updated = [...favorites, track];
    }
    setFavorites(updated);
    localStorage.setItem('favorite_tracks', JSON.stringify(updated));
  };

  const handleAddTrack = (track) => {
    if (playlist.some(t => t.id === track.id)) return;
    setPlaylist([...playlist, track]);
  };

  const handlePlayTrack = (track) => {
    // Si ya es el track actual, lo mantenemos abierto (para cerrar, el usuario usa la 'X' del reproductor)
    setCurrentPlayingTrack(track);
  };

  const handleSaveToSpotify = async (name) => {
    if (!user || !user.id || playlist.length === 0) return;
    setIsSaving(true);
    try {
      const trackUris = playlist.map(t => t.uri).filter(uri => !!uri);
      const created = await createSpotifyPlaylist(name, trackUris);
      alert(`¡Playlist "${created.name}" creada con éxito en tu cuenta de Spotify!`);
    } catch (err) {
      console.error(err);
      alert('Error al exportar playlist: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954] mx-auto mb-4"></div>
          <p className="text-neutral-400">Cargando Taste Mixer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white p-4">
        <div className="bg-red-950/20 border border-red-500/30 p-8 rounded-2xl max-w-md text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-neutral-400 mb-6">{error}</p>
          <button
            onClick={() => {
              localStorage.clear();
              router.push('/');
            }}
            className="px-6 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl flex items-center gap-3">
            Hola, {user?.display_name || 'Melómano'} <Sparkles className="w-8 h-8 text-[#1db954]" />
          </h1>
          <p className="mt-2 text-neutral-400 text-sm">
            Configura los widgets a continuación para mezclar tu lista de reproducción personalizada basada en tus gustos.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Columna 1 y 2: Contenedor de Widgets */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArtistWidget onSelect={setSelectedArtists} selectedItems={selectedArtists} />
              <TrackWidget onSelect={setSelectedTracks} selectedItems={selectedTracks} />
              <GenreWidget onSelect={setSelectedGenres} selectedItems={selectedGenres} />
              <DecadeWidget onSelect={setSelectedDecades} selectedItems={selectedDecades} />
              <MoodWidget onSelect={setMoodPrefs} selectedItems={moodPrefs} />
              <PopularityWidget onSelect={setPopularityPrefs} selectedItems={popularityPrefs} />
            </div>

            {/* Botón de Generar */}
            <div className="w-full flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (selectedArtists.length === 0 && selectedTracks.length === 0 && selectedGenres.length === 0 && selectedDecades.length === 0)}
                className="w-full md:w-auto px-8 py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-[#1db954] to-emerald-500 text-black font-extrabold rounded-xl transition hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#1db954]/10 hover:shadow-[#1db954]/20 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none cursor-pointer text-center text-sm"
              >
                {isGenerating ? 'Generando Playlist...' : (
                  <>
                    Generar Playlist Mezclada <Wand2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Columna 3: Playlist Display */}
          <div className="lg:col-span-1">
            <PlaylistDisplay
              playlist={playlist}
              favorites={favorites}
              onRemoveTrack={handleRemoveTrack}
              onToggleFavorite={handleToggleFavorite}
              onAddTrack={handleAddTrack}
              onRefresh={handleGenerate}
              onSaveToSpotify={handleSaveToSpotify}
              isGenerating={isGenerating}
              isSaving={isSaving}
              currentPlayingTrack={currentPlayingTrack}
              onPlayTrack={handlePlayTrack}
            />
          </div>
        </div>
      </main>

      {/* Floating Bottom Player */}
      {currentPlayingTrack && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl px-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#181818]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 relative">
            <button
              onClick={() => setCurrentPlayingTrack(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-white transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer"
              title="Cerrar reproductor"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-1 pr-8">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#1db954] animate-pulse">Cargado • Haz clic en Play en el reproductor de abajo para escuchar</span>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-[280px]">
                  {currentPlayingTrack.name}
                </span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs text-neutral-400 truncate">
                  {currentPlayingTrack.artists?.map(a => a.name).join(', ')}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 min-h-[80px]">
                <iframe
                  src={`https://open.spotify.com/embed/track/${currentPlayingTrack.id}?utm_source=generator&theme=0`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allowtransparency="true"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  style={{ borderRadius: '12px' }}
                  title={`Reproductor Spotify para ${currentPlayingTrack.name}`}
                ></iframe>
              </div>
              <a
                href={`https://open.spotify.com/track/${currentPlayingTrack.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs font-semibold text-black bg-[#1db954] hover:bg-[#1ed760] transition-colors rounded-xl px-4 py-3 h-[50px] sm:h-auto whitespace-nowrap"
              >
                Abrir en Web Player <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
