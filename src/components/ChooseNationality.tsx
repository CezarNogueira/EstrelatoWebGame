import { Globe } from "lucide-react";
import { NATIONALITIES } from "../data";

export function ChooseNationality({ onSelect }: { onSelect: (nationality: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-500/20 rounded-full">
            <Globe className="w-12 h-12 text-emerald-400" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-slate-100 tracking-tight">Qual sua Nacionalidade?</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Escolha o país que você irá defender caso seja convocado para a Seleção Nacional.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl w-full">
        {NATIONALITIES.map((nat) => (
          <button
            key={nat}
            onClick={() => onSelect(nat)}
            className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-emerald-500 hover:text-emerald-400 transition-all text-lg font-bold text-slate-300"
          >
            {nat}
          </button>
        ))}
      </div>
    </div>
  );
}
