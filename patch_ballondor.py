import re

with open('src/components/BallonDorModal.tsx', 'r') as f:
    content = f.read()

new_imports = 'import { Player, SeasonStat } from "../types";\nimport { Award, Trophy, ChevronRight, X } from "lucide-react";\nimport { useState, useEffect } from "react";\nimport { motion, AnimatePresence } from "motion/react";'

content = re.sub(r'import \{ Player.*?motion/react";', new_imports, content, flags=re.DOTALL)

body_pattern = r'export function BallonDorModal\(\{.*?\}\) \{.*?const won = seasonStat.individualAwards\?\.includes\("Bola de Ouro"\);'

new_body_start = """export function BallonDorModal({
  player,
  seasonStat,
  onClose
}: {
  player: Player;
  seasonStat: SeasonStat;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const candidates = seasonStat.ballonDorCandidates || [];
  const won = seasonStat.individualAwards?.includes("Bola de Ouro");

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
    const winnerName = candidates[0]?.name || "Desconhecido";
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
          
          {won && <p className="text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30">Parabéns, você é o melhor do mundo!</p>}
        </motion.div>
      </div>
    );
  }"""

content = re.sub(body_pattern, new_body_start, content, flags=re.DOTALL)

# Now we need to remove the "AnimatePresence" block that was for revealed state and just leave the button.
# Let's replace everything from <AnimatePresence> to the end of that block with just the button since revealed is handled early return.

old_button_block = """        <AnimatePresence>
          {!revealed ? (
            <motion.button
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              onClick={() => setRevealed(true)}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Revelar Vencedor <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className={`p-6 rounded-2xl border mb-6 ${
                won 
                  ? 'bg-emerald-500/10 border-emerald-500/50' 
                  : 'bg-slate-800/80 border-slate-700'
              }`}>
                {won ? (
                  <>
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
                    <h3 className="text-2xl font-black text-emerald-400 mb-2">VOCÊ VENCEU!</h3>
                    <p className="text-slate-300 text-sm">
                      Uma temporada histórica! Você foi eleito o melhor jogador do mundo.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">Não foi desta vez</h3>
                    <p className="text-slate-400 text-sm">
                      O prêmio foi para {candidates[0]?.name}. Continue se esforçando para chegar ao topo!
                    </p>
                  </>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                Continuar
              </button>
            </motion.div>
          )}
        </AnimatePresence>"""

new_button_block = """        <button
          onClick={() => setRevealed(true)}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          Revelar Vencedor <ChevronRight className="w-5 h-5" />
        </button>"""

if old_button_block in content:
    content = content.replace(old_button_block, new_button_block)

with open('src/components/BallonDorModal.tsx', 'w') as f:
    f.write(content)

print("Patched!")
