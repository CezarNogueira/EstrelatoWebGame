import { Player, SeasonStat } from "../types";
import { Trophy, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function ChuteiraModal({
  player,
  seasonStat,
  onClose
}: {
  player: Player;
  seasonStat: SeasonStat;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const won = seasonStat.individualAwards?.includes("Chuteira de Ouro");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (revealed) {
      timeout = setTimeout(() => {
        onClose();
      }, 5000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [revealed, onClose]);

  if (revealed) {
    const winnerName = won ? player.name : "Erling Haaland"; // Fake other winner
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1a1f2e] border border-amber-500 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative flex flex-col items-center text-center"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          
          <Trophy className="w-20 h-20 text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
          
          <h3 className="text-lg font-bold text-slate-400 mb-1 uppercase tracking-widest">Vencedor</h3>
          <p className="text-3xl font-black text-amber-400 mb-4">{winnerName}</p>
          
          {won && <p className="text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30">Parabéns, você é o maior artilheiro!</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1f2e] border border-amber-500/30 p-8 rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 bg-amber-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white">Chuteira de Ouro</h2>
          <p className="text-slate-400 mt-2 text-sm">
            O maior artilheiro da temporada.
          </p>
        </div>

        <button
          onClick={() => setRevealed(true)}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          Revelar Vencedor <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
