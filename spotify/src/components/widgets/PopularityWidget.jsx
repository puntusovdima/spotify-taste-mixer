'use client';

import { TrendingUp } from 'lucide-react';

const CATEGORIES = [
  { label: 'Underground', min: 0, max: 49 },
  { label: 'Popular', min: 50, max: 79 },
  { label: 'Mainstream', min: 80, max: 100 },
  { label: 'Cualquiera', min: 0, max: 100 }
];

export default function PopularityWidget({ onSelect, selectedItems = [0, 100] }) {
  const [min, max] = selectedItems;

  const handleRangeChange = (index, value) => {
    const newVal = parseInt(value);
    if (index === 0) {
      onSelect([Math.min(newVal, max), max]);
    } else {
      onSelect([min, Math.max(newVal, min)]);
    }
  };

  const handleSelectCategory = (cat) => {
    onSelect([cat.min, cat.max]);
  };

  const activeCategory = CATEGORIES.find(c => c.min === min && c.max === max)?.label || 'Personalizado';

  return (
    <div className="bg-[#121212] border border-white/[0.05] rounded-2xl p-6 transition-all hover:border-white/[0.1] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#1db954]" />
          <h2 className="text-lg font-bold">Popularidad de Canciones</h2>
        </div>
        <span className="text-xs text-[#1db954] font-bold bg-[#1db954]/10 border border-[#1db954]/20 px-2.5 py-1 rounded-full">
          {activeCategory}
        </span>
      </div>

      <p className="text-xs text-neutral-400 mb-4">
        Elige si prefieres grandes éxitos de la radio o joyas ocultas menos conocidas.
      </p>

      {/* Quick Category Tabs */}
      <div className="grid grid-cols-4 gap-1.5 mb-5">
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            onClick={() => handleSelectCategory(cat)}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer border ${
              activeCategory === cat.label
                ? 'bg-[#1db954]/10 border-[#1db954]/30 text-[#1db954]'
                : 'bg-white/5 border-transparent text-neutral-300 hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Dual Sliders */}
      <div className="space-y-4">
        {/* Min popularity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium text-neutral-300">
            <span>Popularidad Mínima</span>
            <span className="text-neutral-400">{min}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={min}
            onChange={(e) => handleRangeChange(0, e.target.value)}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
          />
        </div>

        {/* Max popularity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium text-neutral-300">
            <span>Popularidad Máxima</span>
            <span className="text-neutral-400">{max}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={max}
            onChange={(e) => handleRangeChange(1, e.target.value)}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
          />
        </div>
      </div>
    </div>
  );
}
