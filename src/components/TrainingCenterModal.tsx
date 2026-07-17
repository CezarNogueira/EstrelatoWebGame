import { Dumbbell, X, Zap, Target, MoveRight, Shield } from "lucide-react";
import { Player, Attributes } from "../types";

export function TrainingCenterModal({
  player,
  onClose,
  onTrain
}: {
  player: Player;
  onClose: () => void;
  onTrain: (attr: keyof Attributes) => void;
}) {
  const healthCost = 10;
  const moodCost = 1;
  const canTrain = player.personal.health > healthCost && player.personal.mood >= moodCost;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-blue-500/30 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-10 h-10" />
        </div>

        <h3 className="text-3xl font-black text-blue-400 mb-2">
          Centro de Treinamento
        </h3>
        
        <p className="text-slate-300 mb-6 text-sm">
          Foque no seu desenvolvimento individual. Cada treino consome <strong className="text-red-400">{healthCost} Saúde</strong> e <strong className="text-orange-400">{moodCost} Humor</strong> para dar <strong className="text-emerald-400">+1 ponto</strong> em um atributo.
        </p>

        {!canTrain && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-sm font-bold">
            Você está exausto. Descanse ou melhore seu humor antes de treinar novamente.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onTrain("pace")}
            disabled={!canTrain || player.attributes.pace >= 99}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2"
          >
            <Zap className="w-5 h-5 text-yellow-400" /> 
            <span>Ritmo ({player.attributes.pace})</span>
          </button>
          
          <button 
            onClick={() => onTrain("shooting")}
            disabled={!canTrain || player.attributes.shooting >= 99}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2"
          >
            <Target className="w-5 h-5 text-red-400" /> 
            <span>Finalização ({player.attributes.shooting})</span>
          </button>
          
          <button 
            onClick={() => onTrain("passing")}
            disabled={!canTrain || player.attributes.passing >= 99}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2"
          >
            <MoveRight className="w-5 h-5 text-blue-400" /> 
            <span>Passe ({player.attributes.passing})</span>
          </button>
          
          <button 
            onClick={() => onTrain("dribbling")}
            disabled={!canTrain || player.attributes.dribbling >= 99}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2"
          >
            <Dumbbell className="w-5 h-5 text-purple-400" /> 
            <span>Drible ({player.attributes.dribbling})</span>
          </button>
          
          <button 
            onClick={() => onTrain("defending")}
            disabled={!canTrain || player.attributes.defending >= 99}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2"
          >
            <Shield className="w-5 h-5 text-emerald-400" /> 
            <span>Defesa ({player.attributes.defending})</span>
          </button>
          
          <button 
            onClick={() => onTrain("physical")}
            disabled={!canTrain || player.attributes.physical >= 99}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2"
          >
            <Dumbbell className="w-5 h-5 text-orange-400" /> 
            <span>Físico ({player.attributes.physical})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
