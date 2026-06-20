'use client';

import { CalendarDays } from 'lucide-react';

const DECADES = [
  { label: '50s (1950-1959)', value: '1950' },
  { label: '60s (1960-1969)', value: '1960' },
  { label: '70s (1970-1979)', value: '1970' },
  { label: '80s (1980-1989)', value: '1980' },
  { label: '90s (1990-1999)', value: '1990' },
  { label: '00s (2000-2009)', value: '2000' },
  { label: '10s (2010-2019)', value: '2010' },
  { label: '20s (2020-2029)', value: '2020' }
];

export default function DecadeWidget({ onSelect, selectedItems = [] }) {
  const handleToggleDecade = (value) => {
    const isSelected = selectedItems.includes(value);
    if (isSelected) {
      onSelect(selectedItems.filter(item => item !== value));
    } else {
      onSelect([...selectedItems, value]);
    }
  };

  return (
    <div className="bg-[#121212] border border-white/[0.05] rounded-2xl p-6 transition-all hover:border-white/[0.1] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#1db954]" />
          <h2 className="text-lg font-bold">Era / Décadas</h2>
        </div>
        {selectedItems.length > 0 && (
          <span className="text-[10px] text-[#1db954] font-bold bg-[#1db954]/10 border border-[#1db954]/20 px-2 py-0.5 rounded-full">
            Filtrado activo
          </span>
        )}
      </div>

      <p className="text-xs text-neutral-400 mb-4">
        Filtra los resultados de la playlist para que pertenezcan a las épocas musicales seleccionadas.
      </p>

      {/* Grid of Checkboxes */}
      <div className="grid grid-cols-2 gap-3">
        {DECADES.map(decade => {
          const isSelected = selectedItems.includes(decade.value);
          return (
            <button
              key={decade.value}
              onClick={() => handleToggleDecade(decade.value)}
              className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#1db954]/10 border-[#1db954]/30 text-[#1db954]'
                  : 'bg-white/[0.02] border-white/[0.05] text-neutral-300 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              {/* Checkbox Icon */}
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-[#1db954] border-[#1db954]'
                    : 'border-neutral-600 bg-neutral-900'
                }`}
              >
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span>{decade.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
