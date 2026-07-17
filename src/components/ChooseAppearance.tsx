import { getRandomAvatar, sanitizeAvatar } from "../data";
import { useState } from "react";

export function ChooseAppearance({ onSelect, playerName }: { onSelect: (avatarUrl: string) => void; playerName: string }) {
  const [currentAvatar, setCurrentAvatar] = useState<string>(sanitizeAvatar(getRandomAvatar("male"), playerName) || "");

  const handleShuffle = () => {
    setCurrentAvatar(sanitizeAvatar(getRandomAvatar("male"), playerName) || "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-100 tracking-tight">Sua Aparência</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Escolha sua Aparência
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full">
        <div className="w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden">
          <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleShuffle}
            className="w-full py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Trocar
          </button>

          <button
            onClick={() => onSelect(currentAvatar)}
            className="w-full py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}