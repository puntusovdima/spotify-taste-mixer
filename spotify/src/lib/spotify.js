import { getOrRefreshToken } from './auth';

// Helper local para construir las cabeceras HTTP de forma asíncrona y automática
async function getHeaders() {
  const token = await getOrRefreshToken();
  if (!token) {
    throw new Error('No se pudo obtener un token de acceso válido. Por favor, inicia sesión de nuevo.');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// Obtener perfil del usuario autenticado
export async function getUserProfile() {
  const headers = await getHeaders();
  const response = await fetch('https://api.spotify.com/v1/me', { headers });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Sesión expirada');
    }
    throw new Error('Error al obtener el perfil de usuario');
  }
  return response.json();
}

// Buscar artistas o canciones con límite
export async function searchItems(query, type) {
  if (!query) return [];
  const headers = await getHeaders();
  const response = await fetch(
    `https://api.spotify.com/v1/search?type=${type}&q=${encodeURIComponent(query)}&limit=10`,
    { headers }
  );
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.error('Error de Spotify API al buscar:', response.status, errData);
    throw new Error(`Error al buscar ${type}: [${response.status}] ${errData.error?.message || response.statusText}`);
  }
  const data = await response.json();
  return type === 'artist' ? data.artists.items : data.tracks.items;
}

// Obtener detalles de audio features en lotes de hasta 100 canciones
export async function fetchAudioFeatures(trackIds) {
  if (!trackIds || trackIds.length === 0) return [];
  const headers = await getHeaders();
  
  // Dividir en fragmentos de 100
  const chunks = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    chunks.push(trackIds.slice(i, i + 100));
  }
  
  let allFeatures = [];
  for (const chunk of chunks) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/audio-features?ids=${chunk.join(',')}`,
        { headers }
      );
      if (response.ok) {
        const data = await response.json();
        allFeatures.push(...(data.audio_features || []));
      }
    } catch (e) {
      console.error('Error al obtener audio features:', e);
    }
  }
  return allFeatures.filter(f => f !== null);
}

// Algoritmo principal de generación de playlists basado en búsquedas y filtros
export async function generatePlaylist(preferences) {
  const { 
    artists = [], 
    tracks = [], 
    genres = [], 
    decades = [], 
    popularity = [0, 100], 
    mood = {} 
  } = preferences;
  
  const headers = await getHeaders();
  let candidateTracks = [];

  // 1. Agregar canciones seleccionadas directamente
  if (tracks.length > 0) {
    candidateTracks.push(...tracks);
  }

  // 2. Obtener canciones de artistas seleccionados (Buscando tracks por nombre de artista)
  for (const artist of artists) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=artist:${encodeURIComponent(artist.name)}&limit=10`,
        { headers }
      );
      if (response.ok) {
        const data = await response.json();
        candidateTracks.push(...(data.tracks?.items || []));
      }
    } catch (e) {
      console.error(`Error al obtener canciones de ${artist.name}:`, e);
    }
  }

  // 3. Buscar canciones por géneros musicales
  for (const genre of genres) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=genre:${encodeURIComponent(genre)}&limit=10`,
        { headers }
      );
      if (response.ok) {
        const data = await response.json();
        candidateTracks.push(...(data.tracks?.items || []));
      }
    } catch (e) {
      console.error(`Error al buscar por género ${genre}:`, e);
    }
  }

  // 4. Buscar canciones por décadas (si no hay artistas ni géneros ni canciones seleccionadas, o como extra)
  if (decades.length > 0 && candidateTracks.length < 30) {
    for (const decade of decades) {
      const startYear = parseInt(decade);
      const endYear = startYear + 9;
      try {
        const qGenre = genres.length > 0 ? `genre:${genres[0]} ` : '';
        const response = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=${qGenre}year:${startYear}-${endYear}&limit=10`,
          { headers }
        );
        if (response.ok) {
          const data = await response.json();
          candidateTracks.push(...(data.tracks?.items || []));
        }
      } catch (e) {
        console.error(`Error al buscar por década ${decade}:`, e);
      }
    }
  }

  // Fallback de seguridad si no hay ningún candidato
  if (candidateTracks.length === 0) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=year:2020-2026&limit=10`,
        { headers }
      );
      if (response.ok) {
        const data = await response.json();
        candidateTracks.push(...(data.tracks?.items || []));
      }
    } catch (e) {
      console.error('Error al realizar búsqueda fallback:', e);
    }
  }

  // Deduplicar canciones candidatas por ID y filtrar elementos nulos
  let uniqueCandidates = Array.from(
    new Map(candidateTracks.filter(Boolean).filter(track => track && track.id).map(track => [track.id, track])).values()
  );

  // 5. Filtrar suavemente por Década si está seleccionado (solo si no deja la lista vacía)
  if (decades.length > 0) {
    const decadeFiltered = uniqueCandidates.filter(track => {
      const releaseDate = track.album?.release_date;
      if (!releaseDate) return false;
      const year = parseInt(releaseDate.split('-')[0]);
      return decades.some(decade => {
        const start = parseInt(decade);
        return year >= start && year <= start + 9;
      });
    });
    // Si el filtro estricto vacía la lista, nos quedamos con las canciones originales
    if (decadeFiltered.length > 0) {
      uniqueCandidates = decadeFiltered;
    } else {
      console.warn('El filtro de década habría vaciado la playlist. Ignorando filtro de década.');
    }
  }

  // 6. Filtrar por Popularidad (solo si no deja la lista vacía)
  const [minPop, maxPop] = popularity;
  const popFiltered = uniqueCandidates.filter(
    track => track.popularity >= minPop && track.popularity <= maxPop
  );
  if (popFiltered.length > 0) {
    uniqueCandidates = popFiltered;
  } else {
    console.warn('El filtro de popularidad habría vaciado la playlist. Ignorando filtro.');
  }

  // 7. Filtrar/Ordenar por Mood (Energy, Valence, Danceability, Acousticness) usando Audio Features
  const hasMoodFilters = 
    mood.energy !== undefined || 
    mood.valence !== undefined || 
    mood.danceability !== undefined || 
    mood.acousticness !== undefined;

  if (hasMoodFilters && uniqueCandidates.length > 0) {
    const trackIds = uniqueCandidates.map(t => t.id);
    const features = await fetchAudioFeatures(trackIds);
    const featuresMap = new Map(features.map(f => [f.id, f]));

    const scoredTracks = uniqueCandidates.map(track => {
      const feat = featuresMap.get(track.id);
      if (!feat) return { track, score: 999 }; // Penalización

      let diff = 0;
      let count = 0;

      if (mood.energy !== undefined) {
        diff += Math.pow((feat.energy * 100) - mood.energy, 2);
        count++;
      }
      if (mood.valence !== undefined) {
        diff += Math.pow((feat.valence * 100) - mood.valence, 2);
        count++;
      }
      if (mood.danceability !== undefined) {
        diff += Math.pow((feat.danceability * 100) - mood.danceability, 2);
        count++;
      }
      if (mood.acousticness !== undefined) {
        diff += Math.pow((feat.acousticness * 100) - mood.acousticness, 2);
        count++;
      }

      const score = count > 0 ? Math.sqrt(diff / count) : 0;
      return { track, score };
    });

    // Ordenar de menor diferencia a mayor diferencia
    scoredTracks.sort((a, b) => a.score - b.score);
    uniqueCandidates = scoredTracks.map(st => st.track);
  }

  // Limitar al tamaño de playlist final (30 canciones)
  return uniqueCandidates.slice(0, 30);
}

// Crear una nueva playlist en el perfil del usuario de Spotify
export async function createSpotifyPlaylist(name, trackUris) {
  const headers = await getHeaders();
  
  // 1. Crear playlist vacía
  const createResponse = await fetch(`https://api.spotify.com/v1/me/playlists`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: name,
      description: 'Generada por Spotify Taste Mixer',
      public: false
    })
  });
  
  if (!createResponse.ok) {
    const errData = await createResponse.json();
    throw new Error(errData.error?.message || 'Error al crear la playlist en Spotify');
  }
  
  const playlist = await createResponse.json();
  
  // 2. Agregar canciones en bloques de 100
  if (trackUris && trackUris.length > 0) {
    const chunks = [];
    for (let i = 0; i < trackUris.length; i += 100) {
      chunks.push(trackUris.slice(i, i + 100));
    }
    
    for (const chunk of chunks) {
      const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ uris: chunk })
      });
      
      if (!addResponse.ok) {
        const errData = await addResponse.json().catch(() => ({}));
        console.error('Error de Spotify al añadir canciones:', addResponse.status, errData);
        throw new Error(errData.error?.message || 'Error al agregar canciones a la playlist');
      }
    }
  }
  
  return playlist;
}