import { Trophy, Star, X } from "lucide-react";
import { motion } from "motion/react";

export function IdolModal({ 
  club, 
  reason, 
  onContinue 
}: { 
  club: string; 
  reason: string; 
  onContinue: () => void 
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border-2 border-yellow-500 rounded-3xl max-w-md w-full overflow-hidden relative shadow-[0_0_50px_rgba(234,179,8,0.2)]"
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
            Novo Ídolo!
          </h2>
          <h3 className="text-xl font-bold text-yellow-500 mb-6">
            {club}
          </h3>

          <div className="bg-slate-800/50 border border-yellow-500/20 p-6 rounded-2xl mb-8">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">
              {reason}
            </p>
          </div>

          <button
            onClick={onContinue}
            className="w-full py-4 bg-yellow-500 text-slate-950 font-black rounded-xl hover:bg-yellow-400 transition-colors uppercase"
          >
            Continuar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
