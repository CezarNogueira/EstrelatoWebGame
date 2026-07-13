import { Trophy, XCircle } from "lucide-react";
import { FinalResult } from "../types";

export function FinalsModal({ finals, onContinue }: { finals: FinalResult[]; onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-6">
        <h3 className="text-3xl font-black text-amber-400 flex items-center justify-center gap-3 mb-2">
          <Trophy className="w-8 h-8" /> 
          Finais da Temporada!
        </h3>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {finals.map((final, idx) => (
            <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${final.won ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <span className="font-bold text-slate-200 text-lg text-left">{final.type}</span>
              {final.won ? (
                <div className="flex items-center gap-2 text-amber-400 font-black">
                  <Trophy className="w-5 h-5" /> Campeão
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <XCircle className="w-5 h-5" /> Vice
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={onContinue}
          className="w-full py-4 mt-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
