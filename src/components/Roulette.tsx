import { useState, useEffect } from "react";
import { getInitialTeamsForNationality } from "../data";
import { Team } from "../types";
import { motion, useAnimation } from "motion/react";
import { Dices } from "lucide-react";

const ITEM_WIDTH = 140;

export function Roulette({ nationality, onTeamSelected }: { nationality: string; onTeamSelected: (team: Team) => void }) {
  const [rerollsLeft, setRerollsLeft] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [strip, setStrip] = useState<Team[]>([]);
  const [winner, setWinner] = useState<Team | null>(null);

  const eligibleTeams = getInitialTeamsForNationality(nationality);

  const controls = useAnimation();
  const [completed, setCompleted] = useState(false);

  const startSpin = async (isFirst = false) => {
    if (!isFirst) {
      if (rerollsLeft <= 0) return;
      setRerollsLeft(prev => prev - 1);
    }
    
    setIsSpinning(true);
    setCompleted(false);
    setWinner(null);
    
    const newStrip: Team[] = [];
    for(let i=0; i<45; i++) {
      newStrip.push(eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)]);
    }
    const winnerIndex = 38;
    const finalTeam = newStrip[winnerIndex];
    setStrip(newStrip);
    
    await controls.set({ x: 0 });
    
    const containerWidth = 320;
    const offset = -(winnerIndex * ITEM_WIDTH) + (containerWidth / 2) - (ITEM_WIDTH / 2);
    const randomOffset = (Math.random() - 0.5) * (ITEM_WIDTH * 0.6);
    const finalX = offset + randomOffset;

    await controls.start({
      x: finalX,
      transition: { duration: 4, ease: [0.15, 0.85, 0.35, 1] }
    });
    
    setIsSpinning(false);
    setWinner(finalTeam);
    setCompleted(true);
  };

  useEffect(() => {
    startSpin(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    if (winner) {
      onTeamSelected(winner);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6 select-none">
      <div className="space-y-8 text-center flex flex-col items-center max-w-2xl w-full">
        <h2 className="text-3xl font-bold uppercase tracking-wide text-slate-100">
          {isSpinning ? "Sorteando clube formador..." : `Você foi escolhido pelo: ${winner?.name || "Time não selecionado"}`}
        </h2>
        
        <div className="relative overflow-hidden w-80 max-w-full h-40 bg-slate-900 border-4 border-slate-800 rounded-3xl shadow-2xl flex items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-emerald-500 z-10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-emerald-500 z-10" />
          
          <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-emerald-500/20 z-0" />

          <motion.div
            animate={controls}
            className="flex absolute left-0 items-center h-full"
          >
            {strip.map((team, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center shrink-0"
                style={{ width: ITEM_WIDTH }}
              >
                {team.logo ? (
                  <img 
                    src={team.logo} 
                    alt="Logo do time"
                    className="w-16 h-16 mb-2 rounded-none object-contain" 
                  />
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full border-4 border-slate-950 shadow-inner mb-2"
                    style={{ backgroundColor: team.color }}
                  />
                )}
                <span className="text-sm font-black tracking-wide text-white truncate max-w-full px-2 text-center">
                  {team.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="h-32 flex flex-col justify-end w-full max-w-xs">
          {completed && winner && (
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleContinue}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-slate-100 font-black rounded-2xl transition-all uppercase tracking-wide shadow-lg"
              >
                Iniciar Carreira
              </button>
              
              {rerollsLeft > 0 ? (
                <button
                  onClick={() => startSpin(false)}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Dices className="w-5 h-5" />
                  Rodar Novamente ({rerollsLeft})
                </button>
              ) : (
                  <span className="text-slate-500 font-medium text-sm mt-2">Sem rodadas restantes</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
