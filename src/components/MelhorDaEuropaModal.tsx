import { Player, SeasonStat } from "../types";
import { Star, Trophy, X, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function MelhorDaEuropaModal({
  player,
  seasonStat,
  onClose
}: {
  player: Player;
  seasonStat: SeasonStat;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const won = seasonStat.individualAwards?.includes("Melhor da Europa");

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
    const winnerName = won ? player.name : "Kylian Mbappé"; // Exemplo de concorrente europeu
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0f172a] border border-blue-500 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative flex flex-col items-center text-center"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          
          <Award className="w-20 h-20 text-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
          
          <h3 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Melhor Jogador da Europa</h3>
          <p className="text-3xl font-black text-blue-400 mb-4">{winnerName}</p>
          
          {won ? (
            <p className="text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30">
              ⭐ Parabéns! Você foi eleito o Melhor da Europa pelo seu desempenho fantástico na temporada!
            </p>
          ) : (
            <p className="text-slate-400 text-sm">Continue brilhando no futebol europeu para buscar o prêmio na próxima temporada!</p>
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
        className="bg-[#0f172a] border border-blue-500/40 p-8 rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400"></div>
        
        <div className="text-center mb-6 relative z-10">
          <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white">Melhor da Europa</h2>
          <p className="text-blue-400/90 text-xs uppercase tracking-widest font-bold mt-1">
            Premiação do Futebol Europeu
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-6 space-y-2 text-xs text-slate-300">
          <p className="font-semibold text-blue-400 uppercase tracking-wider text-[11px]">Regras e Funcionamento:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li><strong className="text-slate-200">Quem participa:</strong> Jogadores em atividade ou atletas que atuam em clubes da Europa.</li>
            <li><strong className="text-slate-200">O que é avaliado:</strong> O desempenho individual e os títulos conquistados ao longo de toda a temporada do ano corrente, com grande peso para competições como a Champions League.</li>
          </ul>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl mb-6 text-center">
          <p className="text-sm font-bold text-blue-300">
            {won ? "✨ Você é um dos grandes cotados ao prêmio!" : "Consagrando o maior destaque do futebol europeu no ano!"}
          </p>
        </div>

        <button
          onClick={() => setRevealed(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black py-3.5 rounded-xl text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Trophy className="w-5 h-5" /> Revelar Vencedor
        </button>
      </motion.div>
    </div>
  );
}
