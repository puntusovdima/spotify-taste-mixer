'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white px-4 relative overflow-hidden">
      {/* Esferas decorativas de brillo degradado */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-[#1db954]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-[#8b5cf6]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl text-center z-10 flex flex-col items-center">
        {/* Icono de Logo animado */}
        <div className="w-20 h-20 bg-gradient-to-tr from-[#1db954] to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-[#1db954]/20 mb-8 animate-pulse">
          <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.982-.336.076-.67-.135-.747-.472-.076-.336.136-.67.472-.746 3.847-.88 7.144-.504 9.822 1.135.295.18.387.565.207.858zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.676-1.116 8.243-.574 11.348 1.334.367.226.487.707.26 1.08zm.106-2.833C14.384 8.78 8.557 8.588 5.168 9.617c-.52.158-1.066-.14-1.224-.66-.158-.52.14-1.066.66-1.224 3.883-1.178 10.316-.957 14.384 1.457.468.278.622.883.344 1.35-.278.468-.883.622-1.35.344z" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400 mb-6">
          Spotify Taste Mixer
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-xl mb-10 leading-relaxed">
          Crea la playlist perfecta combinando tus artistas y canciones favoritas, seleccionando géneros, ajustando la era y sintonizando el mood ideal.
        </p>

        {/* Botón de conexión */}
        <button
          onClick={handleLogin}
          className="group relative px-8 py-4 bg-[#1db954] text-black font-semibold rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(29,185,84,0.3)] hover:shadow-[0_0_40px_rgba(29,185,84,0.5)] cursor-pointer"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          <span className="flex items-center gap-3">
            Conectarse con Spotify
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>

        {/* Resumen de características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24 max-w-4xl text-left">
          <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-all">
            <div className="text-[#1db954] mb-3 text-2xl">🧩</div>
            <h3 className="font-semibold text-lg mb-2">Widgets Modulares</h3>
            <p className="text-neutral-400 text-sm">Elige artistas, tracks, géneros y décadas mediante paneles dedicados.</p>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-all">
            <div className="text-purple-400 mb-3 text-2xl">🎛️</div>
            <h3 className="font-semibold text-lg mb-2">Sintonizador de Mood</h3>
            <p className="text-neutral-400 text-sm">Filtra mediante audio features como energía, valencia, danceability y acústica.</p>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-all">
            <div className="text-emerald-400 mb-3 text-2xl">⚡</div>
            <h3 className="font-semibold text-lg mb-2">Exportar al Instante</h3>
            <p className="text-neutral-400 text-sm">Guarda directamente las listas mezcladas como nuevas playlists en tu cuenta de Spotify.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
