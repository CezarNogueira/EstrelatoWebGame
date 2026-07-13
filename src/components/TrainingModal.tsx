import { Dumbbell, Target, MoveRight, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { Attributes } from "../types";

export function TrainingModal({ onTrain }: { onTrain: (points: Partial<Attributes>) => void }) {
  const [training, setTraining] = useState<keyof Attributes | null>(null);

  const handleTrain = (type: keyof Attributes) => {
    setTraining(type);
    setTimeout(() => {
      const points = Math.floor(Math.random() * 11) + 2; // 2 to 12
      onTrain({ [type]: points });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
        <h3 className="text-3xl font-black text-emerald-400 flex items-center justify-center gap-2">
          <Dumbbell className="w-8 h-8" /> 
          Treino Especial
        </h3>
        <p className="text-slate-300 text-lg">
          O treinador chamou você para um treino intensivo! O que deseja aprimorar?
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => handleTrain("pace")}
            disabled={training !== null}
            className="w-full py-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {training === "pace" ? "Treinando..." : <><Zap className="w-5 h-5" /> Ritmo</>}
          </button>

          <button 
            onClick={() => handleTrain("shooting")}
            disabled={training !== null}
            className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {training === "shooting" ? "Treinando..." : <><Target className="w-5 h-5" /> Finalização</>}
          </button>
          
          <button 
            onClick={() => handleTrain("passing")}
            disabled={training !== null}
            className="w-full py-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {training === "passing" ? "Treinando..." : <><MoveRight className="w-5 h-5" /> Passes</>}
          </button>

          <button 
            onClick={() => handleTrain("defending")}
            disabled={training !== null}
            className="w-full py-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {training === "defending" ? "Treinando..." : <><Shield className="w-5 h-5" /> Defesa</>}
          </button>
        </div>
      </div>
    </div>
  );
}
