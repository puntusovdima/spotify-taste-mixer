'use client';

import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Header({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="w-full bg-[#121212]/80 backdrop-blur-md border-b border-white/[0.05] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
          <div className="w-8 h-8 bg-[#1db954] rounded-full flex items-center justify-center text-black font-black">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.982-.336.076-.67-.135-.747-.472-.076-.336.136-.67.472-.746 3.847-.88 7.144-.504 9.822 1.135.295.18.387.565.207.858zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.676-1.116 8.243-.574 11.348 1.334.367.226.487.707.26 1.08zm.106-2.833C14.384 8.78 8.557 8.588 5.168 9.617c-.52.158-1.066-.14-1.224-.66-.158-.52.14-1.066.66-1.224 3.883-1.178 10.316-.957 14.384 1.457.468.278.622.883.344 1.35-.278.468-.883.622-1.35.344z" />
            </svg>
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300 hidden sm:block">
            Taste Mixer
          </span>
        </div>

        {/* User profile & logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.images?.[0]?.url ? (
                <img
                  src={user.images[0].url}
                  alt={user.display_name}
                  className="w-8 h-8 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-sm font-semibold border border-white/10">
                  {user.display_name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-sm font-medium text-neutral-300 hidden md:block">
                {user.display_name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs bg-neutral-900 hover:bg-neutral-800 border border-white/10 px-3 py-1.5 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
