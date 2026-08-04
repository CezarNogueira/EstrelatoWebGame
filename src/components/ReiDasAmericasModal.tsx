import { Player, SeasonStat } from "../types";
import { Crown, Trophy, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function ReiDasAmericasModal({
  player,
  seasonStat,
  onClose
}: {
  player: Player;
  seasonStat: SeasonStat;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const won = seasonStat.individualAwards?.includes("Rei das Américas");

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
    const winnerName = won ? player.name : "Giorgian de Arrascaeta"; // Exemplo de concorrente
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
          
          <Crown className="w-20 h-20 text-amber-400 mb-6 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
          
          <h3 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Novo Rei das Américas</h3>
          <p className="text-3xl font-black text-amber-400 mb-4">{winnerName}</p>
          
          {won ? (
            <p className="text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30">
              👑 Parabéns! Você foi eleito o Rei das Américas pelo seu desempenho na temporada!
            </p>
          ) : (
            <p className="text-slate-400 text-sm">Continue brilhando para conquistar a coroa na próxima temporada!</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1f2e] border border-amber-500/40 p-8 rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500"></div>
        
        <div className="text-center mb-6 relative z-10">
          <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Crown className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white">Rei das Américas</h2>
          <p className="text-amber-400/90 text-xs uppercase tracking-widest font-bold mt-1">
            Premiação do Futebol Continental
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl mb-6 space-y-2 text-xs text-slate-300">
          <p className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">Regras do Prêmio:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li><strong className="text-slate-200">Elegibilidade:</strong> Atletas sul-americanos em atividade ou atuando em clubes das Américas.</li>
            <li><strong className="text-slate-200">Critério:</strong> Avalia desempenho individual e títulos da temporada do ano corrente, com grande peso para a Copa Libertadores.</li>
          </ul>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl mb-6 text-center">
          <p className="text-sm font-bold text-amber-300">
            {won ? "✨ Você é um dos grandes cotados ao prêmio!" : "Consagrando os maiores destaques das Américas no ano!"}
          </p>
        </div>

        <button
          onClick={() => setRevealed(true)}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black py-3.5 rounded-xl text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Trophy className="w-5 h-5" /> Revelar Vencedor
        </button>
      </motion.div>
    </div>
  );
}
