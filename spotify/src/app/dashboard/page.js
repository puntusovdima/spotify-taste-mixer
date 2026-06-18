'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getUserProfile } from '@/lib/spotify';
import Header from '@/components/Header';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    // Cargar perfil de usuario
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar perfil. Por favor inicia sesión de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hola, {user?.display_name || 'Melómano'} 👋
          </h1>
          <p className="mt-2 text-neutral-400">
            Configura los widgets a continuación para mezclar tu lista de reproducción personalizada.
          </p>
        </div>

        {/* Dashboard Grid (Sustituido en fases posteriores) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna 1 y 2: Contenedor de Widgets */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 bg-[#121212]/50 border border-white/[0.05] rounded-2xl min-h-[300px] flex items-center justify-center">
              <span className="text-neutral-500">Área de Widgets</span>
            </div>
          </div>

          {/* Columna 3: Área de visualización de Playlist */}
          <div className="space-y-8">
            <div className="p-6 bg-[#121212]/50 border border-white/[0.05] rounded-2xl min-h-[300px] flex items-center justify-center">
              <span className="text-neutral-500">Playlist Generada</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
