# 🎵 Spotify Taste Mixer - Proyecto Final

Aplicación web que genera playlists personalizadas de Spotify basándose en las preferencias musicales del usuario mediante widgets configurables.

## 📋 Tabla de Contenidos

- [Objetivos del Proyecto](#-objetivos-del-proyecto)
- [Goals - Lo que aprenderás](#-goals---lo-que-aprenderás)
- [Requisitos Previos](#-requisitos-previos)
- [Configuración Inicial](#%EF%B8%8F-configuración-inicial)
- [Estructura del Proyecto](#-estructura-ejemplo-del-proyecto)
- [Autenticación OAuth](#-autenticación-oauth)
- [Widgets a Implementar](#-widgets-a-implementar)
- [Playlist Generation and Management](#-playlist-generation-and-management)
- [API de Spotify](#-api-de-spotify---referencia-rápida)
- [Important Notes](#%EF%B8%8F-important-notes---leer-antes-de-empezar)
- [Navegación en Next.js](#-navegación-en-nextjs)
- [Problemas Comunes](#-problemas-comunes-y-soluciones)
- [Testing and Debugging](#-testing-and-debugging)
- [Guía de Implementación](#%EF%B8%8F-guía-de-implementación-paso-a-paso)
- [Recursos Útiles](#-recursos-útiles)

---

## 🎯 Objetivos del Proyecto

1. Crear una aplicación profesional con Next.js
2. Implementar autenticación OAuth 2.0 de forma segura
3. Trabajar con APIs externas (Spotify Web API)
4. Desarrollar componentes React reutilizables
5. Gestionar estado y persistencia con localStorage
6. Crear una interfaz responsive y atractiva

---

## 🎓 Goals - Lo que aprenderás

### 1. Fundamentos de React
- Crear componentes widget reutilizables
- Props y prop drilling entre componentes
- Hooks: `useState` y `useEffect`
- Event Management entre múltiples componentes
- Comunicación padre-hijo entre widgets y app principal
- Renderizado condicional y listas
- Estilos responsive y dinámicos
- Styled components y CSS modules

### 2. Integración de API Externa
- Flujo completo OAuth 2.0 con Spotify
- Peticiones HTTP con `fetch` o `axios`
- Manejo de errores y rate limiting
- Refresh automático de tokens

### 3. Gestión de Estado Local
- Persistir tokens de autenticación
- **Guardar canciones favoritas** ⭐
- Guardar preferencias de widgets (opcional)
- Historial de playlists generadas (opcional)

### 4. Next.js en Producción
- App Router / Pages Router
- API Routes para operaciones del servidor
- Navegación con `Link` y `useRouter`
- Variables de entorno seguras

---

## 📦 Requisitos Previos

### Software Necesario

- Node.js 18+ y npm/yarn
- Git
- Editor de código (VS Code recomendado)
- Cuenta de Spotify (gratuita o premium)

### Conocimientos Requeridos

- React básico (componentes, props, hooks)
- NextJS
- JavaScript ES6+
- Tailwind y CSS básico
- Conceptos de HTTP y APIs REST

---

## ⚙️ Configuración Inicial

### 1. Crear Aplicación en Spotify

1. Ve a [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en **"Create app"**
4. Completa el formulario:
   - **App name**: Spotify Taste Mixer
   - **App description**: Generador de playlists personalizadas
   - **Redirect URI**: `http://127.0.0.1:3000/auth/callback`
   - **API/SDKs**: Web API
5. Guarda tu **Client ID** y **Client Secret**

### 2. Crear Proyecto Next.js

```bash
npx create-next-app@latest spotify-taste-mixer
cd spotify-taste-mixer
npm run dev
```

Configuración recomendada:
- ✅ TypeScript: No 
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ App Router: Yes
- ✅ Import alias: Yes (@/*)

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id_aqui
NEXT_PUBLIC_REDIRECT_URI=http://127.0.0.1:3000/auth/callback
```

⚠️ **IMPORTANTE**: 
- Nunca subas `.env.local` a GitHub
- El archivo `.gitignore` ya lo excluye por defecto
- Solo las variables con `NEXT_PUBLIC_` son accesibles en el cliente

### 4. Instalar Dependencias (Opcional)

```bash
npm install axios
```

---

## 📁 Estructura ejemplo del Proyecto

```
spotify-taste-mixer/src/
├── app/
│   ├── page.js                    # Página de inicio / login
│   ├── layout.js                  # Layout principal
│   ├── dashboard/
│   │   └── page.js                # Dashboard con widgets
│   ├── auth/
│   │   └── callback/
│   │       └── page.js            # Callback OAuth
│   └── api/
│       ├── spotify-token/
│       │   └── route.js           # Intercambio código por token
│       └── refresh-token/
│           └── route.js           # Refrescar token expirado
├── components/
│   ├── widgets/
│   │   ├── ArtistWidget.jsx       # Widget de artistas
│   │   ├── GenreWidget.jsx        # Widget de géneros
│   │   ├── DecadeWidget.jsx       # Widget de décadas
│   │   ├── MoodWidget.jsx         # Widget de mood/energía
│   │   └── PopularityWidget.jsx   # Widget de popularidad
│   ├── PlaylistDisplay.jsx        # Visualización de playlist
│   ├── TrackCard.jsx              # Tarjeta de canción
│   └── Header.jsx                 # Navegación y logout
├── lib/
│   ├── spotify.js                 # Funciones API Spotify
│   └── auth.js                    # Utilidades de autenticación
├── .env.local                     # Variables de entorno
└── README.md
```

---

## 🔐 Autenticación OAuth

### Flujo de Autenticación

```
Usuario → Login → Spotify OAuth → Callback → Token Exchange → Dashboard
```

### Código Proporcionado

#### 1. API Route: `spotify/src/app/api/spotify-token/route.js`

#### 2. API Route: `spotify/src/app/api/refresh-token/route.js`

#### 3. Utilidad de Auth: `spotify/src/lib/auth.js`

#### 4. Página de Login: `spotify/app/page.js`

#### 5. Página de Callback: `spotify/app/auth/callback/page.js`

## 🧩 Widgets a Implementar

### Requisitos Generales para Widgets

Cada widget debe:
1. Ser un componente React independiente
2. Recibir props: `onSelect`, `selectedItems`
3. Emitir cambios al componente padre
4. Tener un diseño responsive
5. Mostrar estado de carga cuando haga peticiones

### Widget Types

#### 1. 🎤 Artist Widget
**Descripción**: Buscar y seleccionar artistas favoritos

**Endpoint**: `GET /search?type=artist&q={query}`

**Funcionalidades**:
- Búsqueda con debouncing
- Mostrar imagen, nombre del artista
- Selección múltiple (límite sugerido: 5 artistas)

#### 2. 🎵 Track Widget
**Descripción**: Buscar y seleccionar canciones favoritas

**Endpoint**: `GET /search?type=track&q={query}`

**Funcionalidades**:
- Búsqueda de canciones
- Mostrar portada, título, artista
- Selección múltiple

#### 3. 🎸 Genre Widget
**Descripción**: Seleccionar géneros musicales disponibles

**Endpoint**: `GET /recommendations/available-genre-seeds`
Como está deprecated, podéis hardcodear los géneros disponibles:
[
    'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
    'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova',
    'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house',
    'children', 'chill', 'classical', 'club', 'comedy',
    'country', 'dance', 'dancehall', 'death-metal', 'deep-house',
    'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
    'dubstep', 'edm', 'electro', 'electronic', 'emo',
    'folk', 'forro', 'french', 'funk', 'garage',
    'german', 'gospel', 'goth', 'grindcore', 'groove',
    'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
    'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm',
    'indian', 'indie', 'indie-pop', 'industrial', 'iranian',
    'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz',
    'k-pop', 'kids', 'latin', 'latino', 'malay',
    'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno',
    'movies', 'mpb', 'new-age', 'new-release', 'opera',
    'pagode', 'party', 'philippines-opm', 'piano', 'pop',
    'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock',
    'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae',
    'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly',
    'romance', 'sad', 'salsa', 'samba', 'sertanejo',
    'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter',
    'soul', 'soundtracks', 'spanish', 'study', 'summer',
    'swedish', 'synth-pop', 'tango', 'techno', 'trance',
    'trip-hop', 'turkish', 'work-out', 'world-music'
]

**Funcionalidades**:
- Listar todos los géneros disponibles
- Selección múltiple (límite sugerido: 3-5 géneros)
- Filtrado por búsqueda

#### 4. 📅 Decade Widget
**Descripción**: Elegir décadas/eras musicales preferidas

**Implementación**: Filtro por año en búsquedas

**Funcionalidades**:
- Selector de décadas (1950s, 1960s, 1970s... 2020s)
- Rango de años personalizado
- Múltiple selección

#### 5. 😊 Mood Widget
**Descripción**: Seleccionar niveles de energía y características musicales

**Parámetros**: Energy, Valence, Danceability, Acousticness

**Funcionalidades**:
- Sliders para energía (0-100)
- Selección de mood (Happy, Sad, Energetic, Calm)
- Características de audio

#### 6. 📊 Popularity Widget
**Descripción**: Elegir entre hits mainstream o joyas ocultas

**Parámetro**: Popularity (0-100)

**Funcionalidades**:
- Slider o categorías (Mainstream 80-100, Popular 50-80, Underground 0-50)
- Filtrar canciones por popularidad

---

## 🎼 Playlist Generation and Management

### Central Recommendation Area

Área principal donde se muestra la playlist generada basada en las selecciones de los widgets.

**Características principales**:
- Mostrar lista de canciones generadas
- Considerar favoritos para generación (opcional)
- Interfaz limpia y atractiva
- Información de cada track: portada, título, artista, duración

### Playlist Management Features (OBLIGATORIO)

#### ✅ Funcionalidades Requeridas

1. **Eliminar Tracks Individuales**
   ```javascript
   // Permitir remover canciones específicas de la playlist
   const removeTrack = (trackId) => {
     setPlaylist(playlist.filter(track => track.id !== trackId))
   }
   ```

2. **Marcar Tracks como Favoritos** ⭐
   ```javascript
   // Guardar favoritos en localStorage
   const toggleFavorite = (track) => {
     const favorites = JSON.parse(localStorage.getItem('favorite_tracks') || '[]')
     const isFavorite = favorites.find(f => f.id === track.id)

     if (isFavorite) {
       const updated = favorites.filter(f => f.id !== track.id)
       localStorage.setItem('favorite_tracks', JSON.stringify(updated))
     } else {
       favorites.push(track)
       localStorage.setItem('favorite_tracks', JSON.stringify(favorites))
     }
   }
   ```

3. **Refrescar Playlist Generada**
   - Botón para regenerar playlist con las mismas preferencias
   - Obtener nuevas recomendaciones

4. **Añadir Más Canciones**
   - Permitir ampliar la playlist existente
   - Mantener canciones actuales y añadir nuevas
5. **Drag & Drop Reordering** 
   - Reordenar canciones arrastrando
   - Usar librerías 

6. **Guardar en Spotify** 
   - `POST /users/{user_id}/playlists`
   - `POST /playlists/{playlist_id}/tracks`
   - Sincronizar con cuenta de Spotify

#### 🎯 Funcionalidades Opcionales


1. **Considerar Favoritos en Generación** (Opcional)
   - Usar canciones favoritas como seeds
   - Ponderación según preferencias guardadas

2. **Testing**


---

## 📡 API de Spotify - Referencia Rápida

### Headers Requeridos

```javascript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

### Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/me` | GET | Obtener perfil del usuario |
| `/search` | GET | Buscar artistas/tracks/albums |
| `/artists/{id}/top-tracks` | GET | Top tracks de un artista |
| `/me/top/artists` | GET | Artistas más escuchados |
| `/me/top/tracks` | GET | Canciones más escuchadas |
| `/users/{user_id}/playlists` | POST | Crear playlist |
| `/playlists/{playlist_id}/tracks` | POST | Añadir canciones a playlist |

### Ejemplos de Búsqueda

```javascript
// Buscar artistas
const url = `https://api.spotify.com/v1/search?type=artist&q=radiohead&limit=5`;

// Buscar tracks
const url = `https://api.spotify.com/v1/search?type=track&q=bohemian%20rhapsody&limit=10`;

// Buscar por género (limitado)
const url = `https://api.spotify.com/v1/search?type=track&q=genre:jazz&limit=20`;
```

### Manejo de Errores

```javascript
async function spotifyRequest(url) {
  const token = getAccessToken();
  
  if (!token) {
    // Intentar refrescar token
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // Redirigir a login
      window.location.href = '/';
      return;
    }
  }

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 401) {
    // Token expirado, refrescar
    const newToken = await refreshAccessToken();
    // Reintentar petición
  }

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
```

---

## ⚠️ IMPORTANT NOTES - Leer Antes de Empezar

### 🚨 Endpoint de Recommendations DEPRECADO

**IMPORTANTE**: El endpoint `/recommendations` de Spotify ha sido **DEPRECADO** para nuevas aplicaciones.

❌ **NO usar**: `GET /recommendations`

✅ **Usar en su lugar**:
- `GET /search` con filtros y parámetros
- `GET /me/top/tracks` para canciones populares del usuario
- `GET /me/top/artists` para artistas favoritos
- `GET /artists/{id}/top-tracks` para canciones de un artista específico

**Estrategia recomendada**:
```javascript
// Generar playlist combinando resultados de búsqueda
async function generatePlaylist(preferences) {
  let tracks = []

  // 1. Buscar por artistas seleccionados
  for (const artist of preferences.artists) {
    const artistTracks = await fetch(`/artists/${artist.id}/top-tracks`)
    tracks.push(...artistTracks.tracks)
  }

  // 2. Buscar por géneros
  for (const genre of preferences.genres) {
    const genreTracks = await fetch(`/search?type=track&q=genre:${genre}&limit=10`)
    tracks.push(...genreTracks.tracks.items)
  }

  // 3. Filtrar por década, popularidad, etc.
  tracks = tracks.filter(track => {
    return track.popularity >= preferences.minPopularity &&
           track.popularity <= preferences.maxPopularity
  })

  return tracks
}
```

### 🔒 Validación CSRF Obligatoria

El parámetro `state` en OAuth **DEBE** validarse:

```javascript
// Al generar URL de autorización (ya implementado en auth.js)
sessionStorage.setItem('spotify_auth_state', state)

// En el callback (ya implementado en callback/page.js)
const savedState = sessionStorage.getItem('spotify_auth_state')
if (!state || state !== savedState) {
  throw new Error('CSRF validation failed')
}
```

### 📝 Funcionalidades: Obligatorias vs Opcionales

**OBLIGATORIAS** ✅:
- OAuth 2.0 authentication flow
- Token refresh automático
- Mínimo 3-4 widgets funcionales
- Generación de playlist basada en widgets
- Eliminar tracks de playlist

- **Marcar tracks como favoritos (localStorage)**
- Refrescar playlist
- Añadir más canciones
- Guardar playlist en Spotify
- Drag & drop para reordenar
- Diseño responsive

**OPCIONALES** 🎯:

- Guardar preferencias de widgets
- Historial de playlists
- Preview de canciones (30s)
- Tests unitarios

### 🧪 Testing Recomendado

1. Probar OAuth en diferentes navegadores
2. Probar con diferentes preferencias musicales
3. Verificar responsive design (mobile, tablet, desktop)
4. Manejar casos de error (API limits, tokens expirados)

---

## 🧭 Navegación en Next.js

### Client-Side Navigation

Usa el componente `Link` para navegación del lado del cliente (más rápida):

```jsx
import Link from 'next/link'

export default function Header() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
```

### Programmatic Navigation

Usa `useRouter` para navegación programática (después de acciones):

```javascript
'use client'

import { useRouter } from 'next/navigation'

export default function LoginButton() {
  const router = useRouter()

  const handleLogin = () => {
    // Después de login exitoso
    router.push('/dashboard')
  }

  return <button onClick={handleLogin}>Login</button>
}
```

**Casos de uso comunes**:
```javascript
// Redirigir después de autenticación
router.push('/dashboard')

// Redirigir después de logout
router.push('/')

// Redirigir con query params
router.push('/playlist?id=123')

// Volver atrás
router.back()

// Recargar página actual
router.refresh()
```

---

## 🐛 Problemas Comunes y Soluciones

### Error: "Invalid client"

**Problema**: Client ID o Client Secret incorrectos

**Solución**: Verifica `.env.local` y reinicia el servidor de desarrollo

### Error: "Invalid redirect URI"

**Problema**: La URI de callback no coincide con la configurada en Spotify

**Solución**: Asegúrate que en el dashboard de Spotify esté `http://localhost:3000/auth/callback`

### Error: "The access token expired"

**Problema**: Token expirado (válido por 1 hora)

**Solución**: Implementa refresh token automático:

```javascript
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  
  const response = await fetch('/api/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  const data = await response.json();
  
  localStorage.setItem('spotify_token', data.access_token);
  const expirationTime = Date.now() + data.expires_in * 1000;
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
  
  return data.access_token;
}
```

### localStorage is not defined

**Problema**: Intentando usar localStorage en componente de servidor

**Solución**: Añade `'use client'` al inicio del archivo del componente

### CORS Error

**Problema**: Peticiones bloqueadas por CORS

**Solución**: Usa API Routes para peticiones sensibles, o asegúrate de incluir el token correctamente

### Error de validación de seguridad (CSRF) constante

**Problema**: En desarrollo con React 18 (Strict Mode), el componente Callback se monta y desmonta dos veces, causando que el token `state` se borre prematuramente del `localStorage` y lance un error CSRF falso.

**Solución**: Convertir la validación en un `console.warn` en lugar de un error duro (o evitar borrar el `localStorage` inmediatamente) para evitar bloqueos en el inicio de sesión.

### Playlist generada vacía (0 canciones)

**Problema**: Debido a los límites recientes de la API de Spotify para desarrolladores (`limit=10`), aplicar filtros locales estrictos (ej. filtrar estrictamente por década o popularidad) descarta todas las canciones obtenidas, dejando la lista en 0.

**Solución**: Usar **"Soft Filtering" (Filtros Suaves)**. El algoritmo aplica el filtro, pero si el resultado vacía la playlist, se ignora el filtro para garantizar que el usuario reciba recomendaciones.

### Error en Vercel: No entrypoint found o 404 NOT_FOUND

**Problema**: Al importar a Vercel sin tener `package.json` trackeado en el primer commit, Vercel detecta erróneamente el proyecto como "Other" o "Node.js", lo que hace fallar la compilación de Next.js.

**Solución**: Crear un archivo `vercel.json` en la raíz con la propiedad `{"framework": "nextjs"}` para forzar la compilación correcta.

### Vulnerabilidad CVE-2025-55182 (React Server Components RCE)

**Problema**: Vulnerabilidad crítica de ejecución remota de código en RSC descubierta recientemente.

**Solución**: Actualizar las dependencias de `next` (v16.2.9+) y `react` (v19.2.1+) en `package.json`.

---

## 🧪 Testing and Debugging

### 1. Testing OAuth Flow

**Checklist de autenticación**:
- [ ] La URL de autorización se genera correctamente
- [ ] El parámetro `state` se guarda en sessionStorage
- [ ] La redirección a Spotify funciona
- [ ] El callback recibe el código de autorización
- [ ] El `state` se valida correctamente (CSRF)
- [ ] El token se intercambia exitosamente
- [ ] El token se guarda en localStorage
- [ ] La redirección al dashboard funciona

**Probar en múltiples navegadores**:
- Chrome/Chromium
- Firefox
- Safari
- Edge

### 2. Testing Responsive Design

**Breakpoints a verificar**:
- 📱 Mobile: 320px - 480px
- 📱 Tablet: 768px - 1024px
- 💻 Desktop: 1280px+

**Elementos a revisar**:
- Grid de widgets se adapta correctamente
- Navegación mobile (hamburger menu)
- Cards de canciones son legibles
- Botones accesibles con dedos
- Scroll funciona correctamente

### 3. Testing API Integration

```javascript
// Ejemplo de testing manual con console.logs
async function testSpotifyAPI() {
  const token = localStorage.getItem('spotify_token')

  console.log('1. Testing token:', token ? '✓' : '✗')

  // Test search
  try {
    const response = await fetch('https://api.spotify.com/v1/search?type=track&q=test&limit=1', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    console.log('2. Search endpoint:', response.ok ? '✓' : '✗')
  } catch (e) {
    console.error('2. Search endpoint: ✗', e)
  }

  // Test user profile
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    console.log('3. User profile:', response.ok ? '✓' : '✗')
  } catch (e) {
    console.error('3. User profile: ✗', e)
  }
}
```

### 4. Error Scenarios to Test

**Manejo de errores**:
- [ ] Token expirado (simular después de 1 hora)
- [ ] Sin conexión a internet
- [ ] API rate limit (429 Too Many Requests)
- [ ] Búsqueda sin resultados
- [ ] Usuario cancela OAuth
- [ ] Invalid redirect URI
- [ ] CSRF validation failure

### 5. Performance Testing

**Métricas a monitorear**:
- Tiempo de carga inicial
- Tiempo de respuesta de búsqueda
- Debouncing funciona (no hacer búsqueda en cada tecla)
- Imágenes se cargan lazy
- No memory leaks (verificar con DevTools)

### 6. Debugging Tips

```javascript
// Útil durante desarrollo
const DEBUG = process.env.NODE_ENV === 'development'

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data)
  }
}

// Uso
debugLog('Token retrieved:', localStorage.getItem('spotify_token'))
debugLog('Search results:', searchResults)
```

**Chrome DevTools shortcuts**:
- `Cmd/Ctrl + Shift + C`: Inspector
- `Cmd/Ctrl + Shift + J`: Console
- `Cmd/Ctrl + Shift + M`: Device toolbar (responsive)
- `Network tab`: Ver peticiones API
- `Application tab`: Ver localStorage/sessionStorage

---

## 📚 Recursos Útiles

### Documentación Oficial

- [Next.js Documentation](https://nextjs.org/docs)
- [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api)
- [Spotify OAuth Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
- [React Hooks](https://react.dev/reference/react)

### Tutoriales Recomendados

- [Next.js App Router Tutorial](https://nextjs.org/learn)
- [OAuth 2.0 Explained](https://auth0.com/docs/get-started/authentication-and-authorization-flow)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs)

### Herramientas de Desarrollo

- [Postman](https://www.postman.com/) - Para probar endpoints de Spotify
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Spotify API Console](https://developer.spotify.com/console/) - Para probar peticiones

---

## 🎨 Inspiración de Diseño

### Referencias de UI

- [Spotify Design](https://spotify.design/)
- [Dribbble - Music Apps](https://dribbble.com/search/music-app)
- [Awwwards - Music Websites](https://www.awwwards.com/websites/music/)

### Paletas de Colores Sugeridas

```css
/* Spotify Inspired */
--primary: #1DB954;
--secondary: #191414;
--accent: #1ed760;

/* Dark Mode */
--bg-dark: #121212;
--bg-card: #181818;
--text-primary: #FFFFFF;
--text-secondary: #B3B3B3;
```


---

## 🗺️ Guía de Implementación Paso a Paso

### Fase 1: Planning (1-2 días)

**1.1 Diseño de la estructura**
- [ ] Definir rutas de la aplicación (`/`, `/auth/callback`, `/dashboard`)
- [ ] Diseñar arquitectura de componentes
- [ ] Crear wireframes o bocetos de UI
- [ ] Definir estructura de estado (qué va en cada componente)
- [ ] Decidir librerías opcionales (axios, react-hook-form, etc.)

**1.2 Flujo de navegación**
```
[Login Page] → [Spotify OAuth] → [Callback] → [Dashboard]
                                                     ↓
                                           [Widgets + Playlist]
```

### Fase 2: Implementation (3-5 días)

**2.1 Routing & Setup**
- [ ] Crear estructura de carpetas según Next.js App Router
- [ ] Configurar `page.js` y `layout.js` para cada ruta
- [ ] Implementar ruta de callback OAuth
- [ ] Configurar variables de entorno

**2.2 Autenticación**
- [ ] Implementar página de login
- [ ] Crear API route para token exchange (`/api/spotify-token`)
- [ ] Crear API route para refresh token (`/api/refresh-token`)
- [ ] Implementar funciones en `lib/auth.js`
- [ ] Probar flujo OAuth completo

**2.3 Components - Layout**
- [ ] Header con estado de autenticación
- [ ] Navigation menu
- [ ] Loading states y error boundaries
- [ ] Footer (opcional)

**2.4 Components - Widgets**
Implementar widgets en orden de dificultad:

1. [ ] **Genre Widget** (más simple - solo lista)
2. [ ] **Decade Widget** (selector de rangos)
3. [ ] **Popularity Widget** (slider)
4. [ ] **Artist Widget** (búsqueda + API)
5. [ ] **Track Widget** (búsqueda + API)
6. [ ] **Mood Widget** (múltiples parámetros)

**2.5 Components - Playlist**
- [ ] Container grid para widgets
- [ ] Área central de playlist display
- [ ] TrackCard component
- [ ] Botones de gestión (remove, favorite, refresh)
- [ ] Drag&drop


**2.6 Funcionalidades Core**
- [ ] Gestión de estado de widgets
- [ ] Algoritmo de generación de playlist
- [ ] Sistema de favoritos con localStorage
- [ ] Eliminar tracks de playlist
- [ ] Refrescar playlist
- [ ] Añadir más canciones
- [ ] Guardar playlist en DSpotify


**2.7 Estilos**
- [ ] Implementar diseño responsive
- [ ] CSS Grid/Flexbox para layout de widgets
- [ ] Estilos con Tailwind CSS o CSS modules
- [ ] Dark mode (opcional)
- [ ] Animaciones y transiciones

### Fase 3: Integration & Testing (1-2 días)

**3.1 Integración de API**
- [ ] Implementar todas las llamadas a Spotify API
- [ ] Añadir interceptors para refresh de token
- [ ] Implementar debouncing en búsquedas
- [ ] Manejo robusto de errores

**3.2 Testing**
- [ ] Test OAuth en múltiples navegadores
- [ ] Test responsive design
- [ ] Test con diferentes preferencias musicales
- [ ] Verificar manejo de errores de API
- [ ] Test de performance

**3.3 Polish**
- [ ] Optimizar imágenes y assets
- [ ] Añadir loading skeletons
- [ ] Mejorar mensajes de error
- [ ] Documentar código
- [ ] README actualizado

### Fase 4: Optional Features (1-3 días)

- [ ] Guardar playlist en Spotify
- [ ] Drag & drop para reordenar
- [ ] Preview de canciones (30s)
- [ ] Historial de playlists
- [ ] Estadísticas de música
- [ ] Tests unitarios

---

## 💡 Ideas para Mejorar la Nota

1. **Guardar playlist en Spotify**: Implementar guardado real
2. **Historial de playlists**: Guardar playlists generadas anteriormente
3. **Compartir playlist**: Generar link para compartir
4. **Modo oscuro/claro**: Toggle entre temas
5. **Estadísticas**: Mostrar insights sobre la música generada
6. **Preview de canciones**: Reproducir fragmentos de 30s
7. **Drag & Drop**: Reordenar canciones de la playlist
8. **Exportar**: Descargar playlist como JSON/CSV
9. **Filtros avanzados**: Tempo, acousticness, danceability
10. **Tests unitarios**: Jest + React Testing Library



## 📝 Notas Finales

### ⏱️ Gestión del Tiempo
- **Tiempo estimado**: 30-40 horas (6-8 días de desarrollo)
- **Dificultad**: Media-Alta
- **Distribución recomendada**:
  - Planning: 1-2 días
  - Implementation: 3-5 días
  - Testing & Polish: 1-2 días
  - Optional features: 1-3 días

### 🎯 Consejos Importantes

1. **Empieza temprano** ⏰
   - OAuth puede tomar tiempo en configurarse correctamente
   - Prueba la autenticación antes de continuar

2. **No copies código sin entenderlo** 📖
   - Asegúrate de comprender cada parte
   - Este proyecto es para demostrar TU aprendizaje

3. **Prueba frecuentemente** 🧪
   - No esperes al final para probar la integración
   - Testea cada widget después de implementarlo

4. **Prioriza lo obligatorio** ✅
   - Completa primero todas las funcionalidades obligatorias
   - Luego añade features opcionales si tienes tiempo

5. **Lee la documentación de Spotify** 📚
   - La API tiene limitaciones y particularidades
   - El endpoint de recommendations está deprecado

6. **Documenta tu código** 📝
   - Añade comentarios donde sea necesario
   - Actualiza el README con instrucciones de instalación

### 🌟 Para Portfolio

Este es un **proyecto real** que puedes incluir en tu portfolio:
- Demuestra conocimientos de React, Next.js y APIs
- Implementación completa de OAuth 2.0
- Diseño responsive y profesional
- Gestión de estado y persistencia

### 🔒 Seguridad

**NUNCA expongas**:
- Client Secret en el frontend
- Tokens en el código fuente
- `.env.local` en GitHub

### 📊 Calidad sobre Cantidad

Es mejor tener:
- 4 widgets bien implementados que 6 a medias
- Código limpio y organizado que muchas features
- Buen manejo de errores que funcionalidades extra

---

## 🎉 ¡Buena suerte!

Disfruta creando tu **Spotify Taste Mixer** y recuerda:
- Este proyecto demuestra tus habilidades como desarrollador
- La calidad del código es tan importante como las funcionalidades
- No dudes en explorar más allá de los requisitos básicos

**¡A programar!** 🎵💻✨