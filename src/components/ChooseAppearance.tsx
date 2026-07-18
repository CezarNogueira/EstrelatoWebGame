import { ChevronLeft, ChevronRight } from "lucide-react";
import { PLAYER_AVATARS, sanitizeAvatar } from "../data";
import { useState } from "react";

export function ChooseAppearance({ onSelect, playerName }: { onSelect: (avatarUrl: string) => void; playerName: string }) {
  const [avatarIndex, setAvatarIndex] = useState(0);

  const currentAvatar = sanitizeAvatar(PLAYER_AVATARS[avatarIndex], playerName) || "";

  const handlePrev = () => {
    setAvatarIndex((prev) => (prev - 1 + PLAYER_AVATARS.length) % PLAYER_AVATARS.length);
  };

  const handleNext = () => {
    setAvatarIndex((prev) => (prev + 1) % PLAYER_AVATARS.length);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-100 tracking-tight">Sua Aparência</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Escolha como você se parece.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            aria-label="Aparência anterior"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-34 h-40 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
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

        <button
          onClick={() => onSelect(currentAvatar)}
          className="w-full py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
        >
          Confirmar Aparência
        </button>
      </div>
    </div>
  );
}