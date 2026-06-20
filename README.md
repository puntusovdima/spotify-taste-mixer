# 🎵 Spotify Taste Mixer

**Spotify Taste Mixer** es una aplicación web interactiva de nivel premium que permite a los usuarios mezclar, previsualizar y exportar listas de reproducción personalizadas de Spotify basándose en sus gustos exactos. Diseñada con una estética moderna de modo oscuro, bordes *glassmorphism* y microanimaciones fluidas.

---

## ✨ Características Principales

*   **Panel de Control Modular (Widgets):**
    *   **Artistas Semilla:** Busca y selecciona hasta 5 artistas favoritos para guiar la mezcla.
    *   **Canciones Semilla:** Selecciona canciones de referencia para el algoritmo.
    *   **Géneros Musicales:** Filtra y sintoniza géneros específicos (Pop, Rock, Jazz, etc.).
    *   **Filtro por Décadas:** Selecciona las eras musicales que deseas incluir (desde los 60s hasta los 2020s).
    *   **Sintonizador de Mood:** Controla parámetros avanzados como Energía, Valencia (felicidad), Danceability (ritmo) y Acústica.
    *   **Rango de Popularidad:** Ajusta si quieres canciones muy comerciales o tesoros ocultos de nicho.
*   **Generador Dinámico de Mezclas:** Algoritmo integrado que combina las preferencias del usuario, realiza solicitudes cruzadas a la API de Spotify y ordena/filtra los resultados basándose en características de audio en tiempo real.
*   **Reproductor Global Inferior:**
    *   Panel de preescucha integrado estilo Spotify Web en la parte inferior de la pantalla.
    *   Control centralizado: Carga y reproduce de forma fluida sin recargar ni duplicar componentes.
    *   Enlace directo al Web Player de Spotify para evadir restricciones de DRM o sandbox de los navegadores.
*   **Exportación Directa a Spotify:**
    *   Exporta tu playlist mezclada a tu cuenta de Spotify con un solo clic.
    *   Utiliza la especificación de API actualizada de Spotify (Febrero de 2026 `/items`) para máxima compatibilidad y rapidez.

---

## 🛠️ Stack Tecnológico

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Biblioteca Principal:** [React 19](https://react.dev/)
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Iconos:** [Lucide React](https://lucide.dev/)
*   **Integración de API:** Spotify Web API (OAuth 2.0 Auth Code Flow con refresco automático de tokens)

---

## ⚙️ Instalación y Configuración Local

Sigue estos pasos para ejecutar la aplicación en tu entorno local:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/puntusovdima/spotify-taste-mixer.git
cd spotify-taste-mixer/spotify
```

### 2. Configurar las Variables de Entorno
Crea un archivo llamado `.env.local` dentro de la carpeta `spotify` y añade tus credenciales de la plataforma de desarrolladores de Spotify:

```env
# Credenciales de Spotify Developer Dashboard
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui

# URL de Redirección OAuth (debe coincidir con la configurada en el dashboard de Spotify)
NEXT_PUBLIC_REDIRECT_URI=http://127.0.0.1:3000/auth/callback
```

*Nota: Asegúrate de registrar `http://127.0.0.1:3000/auth/callback` como **Redirect URI** en tu aplicación dentro de [Spotify for Developers](https://developer.spotify.com/dashboard).*

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación funcionando.

---

## 🚀 Despliegue en Producción

La aplicación está lista para ser desplegada en plataformas como **Vercel** o **Netlify**. Asegúrate de configurar las mismas variables de entorno del archivo `.env.local` en el panel de configuración de tu hosting de producción y actualizar el Redirect URI correspondiente en el Dashboard de desarrolladores de Spotify.

---

## 🔒 Licencia y Autor
Proyecto final desarrollado por [puntusovdima](https://github.com/puntusovdima). Todos los derechos reservados.