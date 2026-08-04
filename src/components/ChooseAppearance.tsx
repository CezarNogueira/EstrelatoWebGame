import { ChevronLeft, ChevronRight, Ruler, Scale, Zap, Activity } from "lucide-react";
import { PLAYER_AVATARS, sanitizeAvatar } from "../data";
import { useState } from "react";
import { calculateBiometricsModifiers } from "../utils";

export function ChooseAppearance({
  onSelect,
  playerName,
}: {
  onSelect: (avatarUrl: string, height: number, weight: number) => void;
  playerName: string;
}) {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [height, setHeight] = useState(175); // 162cm to 200cm
  const [weight, setWeight] = useState(75);  // 60kg to 90kg

  const currentAvatar = sanitizeAvatar(PLAYER_AVATARS[avatarIndex], playerName) || "";

  const handlePrev = () => {
    setAvatarIndex((prev) => (prev - 1 + PLAYER_AVATARS.length) % PLAYER_AVATARS.length);
  };

  const handleNext = () => {
    setAvatarIndex((prev) => (prev + 1) % PLAYER_AVATARS.length);
  };

  const { physicalMod, paceMod } = calculateBiometricsModifiers(height, weight);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">Aparência & Físico</h2>
      </div>

      <div className="flex flex-col items-center gap-6 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full">
        {/* Avatar Carousel */}
        <div className="flex items-center gap-4 w-full justify-center">
          <button
            onClick={handlePrev}
            aria-label="Aparência anterior"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-32 h-32 rounded-2xl border-2 border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            <img src={currentAvatar} alt="Avatar" className="mt-4 object-cover w-full h-full" />
          </div>

          <button
            onClick={handleNext}
            aria-label="Próxima aparência"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 transition-colors shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          {PLAYER_AVATARS.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === avatarIndex ? "bg-emerald-500" : "bg-slate-700"}`}
            />
          ))}
        </div>

        {/* Height & Weight Sliders */}
        <div className="w-full space-y-5 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          {/* Height Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-emerald-400" /> Altura
              </label>
              <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                {height} cm
              </span>
            </div>
            <input
              type="range"
              min={162}
              max={200}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-500">
              <span>162 cm (Agilidade)</span>
              <span>200 cm (Físico)</span>
            </div>
          </div>

          {/* Weight Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-blue-400" /> Peso
              </label>
              <span className="text-sm font-black text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/30">
                {weight} kg
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={90}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-500">
              <span>60 kg (Ritmo)</span>
              <span>90 kg (Físico)</span>
            </div>
          </div>
        </div>

        {/* Attribute Impact Preview */}
        <div className="w-full space-y-2">
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-around gap-2 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Ritmo (RIT)
              </span>
              <span className={`text-lg font-black ${paceMod > 0 ? "text-emerald-400" : paceMod < 0 ? "text-red-400" : "text-slate-300"}`}>
                {paceMod > 0 ? `+${paceMod}` : paceMod}
              </span>
            </div>

            <div className="w-px h-8 bg-slate-800" />

            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" /> Físico (FIS)
              </span>
              <span className={`text-lg font-black ${physicalMod > 0 ? "text-emerald-400" : physicalMod < 0 ? "text-red-400" : "text-slate-300"}`}>
                {physicalMod > 0 ? `+${physicalMod}` : physicalMod}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelect(currentAvatar, height, weight)}
          className="w-full py-3.5 rounded-xl font-black bg-emerald-500 hover:bg-emerald-600 text-white transition-all text-base shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
        >
          Confirmar Personagem
        </button>
      </div>
    </div>
  );
}
