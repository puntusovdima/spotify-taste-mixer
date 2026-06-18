'use client';

const PRESETS = [
  { label: 'Happy', energy: 75, valence: 85, danceability: 80, acousticness: 10 },
  { label: 'Sad', energy: 20, valence: 15, danceability: 35, acousticness: 75 },
  { label: 'Energetic', energy: 90, valence: 65, danceability: 85, acousticness: 5 },
  { label: 'Calm', energy: 25, valence: 40, danceability: 30, acousticness: 80 }
];

export default function MoodWidget({ onSelect, selectedItems = {} }) {
  const { enabled = false, energy = 50, valence = 50, danceability = 50, acousticness = 50 } = selectedItems;

  const handleToggleEnable = () => {
    onSelect({
      ...selectedItems,
      enabled: !enabled
    });
  };

  const handleSliderChange = (name, value) => {
    onSelect({
      ...selectedItems,
      [name]: value,
      enabled: true // Auto-activar si se mueve algún slider
    });
  };

  const handleApplyPreset = (preset) => {
    onSelect({
      enabled: true,
      energy: preset.energy,
      valence: preset.valence,
      danceability: preset.danceability,
      acousticness: preset.acousticness
    });
  };

  return (
    <div className="bg-[#121212] border border-white/[0.05] rounded-2xl p-6 transition-all hover:border-white/[0.1] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎛️</span>
          <h2 className="text-lg font-bold">Mood & Atmósfera</h2>
        </div>
        {/* Toggle Filtro */}
        <button
          onClick={handleToggleEnable}
          className={`text-xs px-3 py-1 rounded-full border font-semibold transition-all cursor-pointer ${
            enabled
              ? 'bg-[#1db954] border-[#1db954] text-black shadow-[0_0_10px_rgba(29,185,84,0.2)]'
              : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          {enabled ? 'Activo' : 'Desactivado'}
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-1.5 mb-5">
        {PRESETS.map(preset => (
          <button
            key={preset.label}
            onClick={() => handleApplyPreset(preset)}
            className="bg-white/5 hover:bg-[#1db954]/10 hover:text-[#1db954] py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer border border-transparent hover:border-[#1db954]/20"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className={`space-y-4 transition-opacity ${enabled ? 'opacity-100' : 'opacity-40'}`}>
        {/* Energy */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium text-neutral-300">
            <span>⚡ Energía</span>
            <span className="text-neutral-400">{energy}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={energy}
            onChange={(e) => handleSliderChange('energy', parseInt(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
          />
        </div>

        {/* Valence */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium text-neutral-300">
            <span>😊 Felicidad (Valencia)</span>
            <span className="text-neutral-400">{valence}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={valence}
            onChange={(e) => handleSliderChange('valence', parseInt(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
          />
        </div>

        {/* Danceability */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium text-neutral-300">
            <span>🕺 Bailabilidad</span>
            <span className="text-neutral-400">{danceability}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={danceability}
            onChange={(e) => handleSliderChange('danceability', parseInt(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
          />
        </div>

        {/* Acousticness */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium text-neutral-300">
            <span>🎻 Acústica</span>
            <span className="text-neutral-400">{acousticness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={acousticness}
            onChange={(e) => handleSliderChange('acousticness', parseInt(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
          />
        </div>
      </div>
    </div>
  );
}
