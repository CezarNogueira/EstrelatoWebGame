import { Globe } from "lucide-react";
import { AMERICAN_NATIONALITIES, EUROPEAN_NATIONALITIES, ASIAN_NATIONALITIES } from "../data";

const CATEGORIES = [
  { title: "América", list: AMERICAN_NATIONALITIES },
  { title: "Europa", list: EUROPEAN_NATIONALITIES },
  { title: "Ásia / Oceania", list: ASIAN_NATIONALITIES },
];

export function ChooseNationality({ onSelect }: { onSelect: (nationality: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-500/20 rounded-full">
            <Globe className="w-12 h-12 text-emerald-400" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-slate-100 uppercase tracking-wide">Escolha a Nacionalidade</h2>
      </div>

      <div className="max-w-4xl w-full space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.title} className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {cat.title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {cat.list.map((nat) => (
                <button
                  key={nat}
                  onClick={() => onSelect(nat)}
                  className="p-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-emerald-500 hover:text-emerald-400 transition-all text-sm font-bold uppercase text-slate-300"
                >
                  {nat}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
