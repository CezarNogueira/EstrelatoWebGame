import re

with open('src/components/InteractiveMatchModal.tsx', 'r') as f:
    content = f.read()

animated_number_component = """function AnimatedNumber({ target, chance }: { target: number, chance: number }) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let startTime: number;
    const duration = 1500; // 1.5 seconds of fast rolling
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        // Random number during rolling
        setCurrent(Math.floor(Math.random() * 100) + 1);
        requestAnimationFrame(animate);
      } else {
        // Set final target
        setCurrent(target);
        setDone(true);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target]);

  let colorClass = "text-white";
  if (done) {
     colorClass = target <= chance ? "text-emerald-400 scale-125 transition-transform" : "text-red-500 scale-125 transition-transform";
  }

  return <span className={`inline-block ${colorClass}`}>{current}</span>;
}"""

animated_word_component = """const QUALITY_WORDS = ["Perfeito", "Muito Bom", "Bom", "Mediano", "Ruim", "Horrível"];

function getQualityWord(roll: number, chance: number): string {
  if (roll <= chance) {
    if (roll <= chance / 3) return "Perfeito";
    if (roll <= (chance * 2) / 3) return "Muito Bom";
    return "Bom";
  } else {
    const gap = 100 - chance;
    if (roll <= chance + gap / 3) return "Mediano";
    if (roll <= chance + (gap * 2) / 3) return "Ruim";
    return "Horrível";
  }
}

function getQualityColor(word: string): string {
  switch (word) {
    case "Perfeito": return "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]";
    case "Muito Bom": return "text-emerald-400";
    case "Bom": return "text-green-300";
    case "Mediano": return "text-yellow-400";
    case "Ruim": return "text-orange-500";
    case "Horrível": return "text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]";
    default: return "text-white";
  }
}

function AnimatedActionQuality({ rollValue, chance }: { rollValue: number, chance: number }) {
  const [currentWord, setCurrentWord] = useState(QUALITY_WORDS[0]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let startTime: number;
    const duration = 1500;
    let lastChange = 0;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        if (timestamp - lastChange > 100) {
          setCurrentWord(QUALITY_WORDS[Math.floor(Math.random() * QUALITY_WORDS.length)]);
          lastChange = timestamp;
        }
        requestAnimationFrame(animate);
      } else {
        setCurrentWord(getQualityWord(rollValue, chance));
        setDone(true);
      }
    };
    
    requestAnimationFrame(animate);
  }, [rollValue, chance]);

  const colorClass = done ? getQualityColor(currentWord) : "text-slate-300 opacity-50";
  const scaleClass = done ? "scale-110 transition-transform duration-300" : "scale-100";

  return <span className={`inline-block font-black text-2xl md:text-3xl uppercase tracking-widest ${colorClass} ${scaleClass}`}>{currentWord}</span>;
}"""

content = content.replace(animated_number_component, animated_word_component)

dice_ui_old = """          {status === "ROLLING_DICE" && diceRollInfo && (
            <div className="flex flex-col items-center justify-center p-6 space-y-6 animate-in fade-in duration-300">
              <div className="text-xl font-bold text-slate-300">Sorteando a jogada...</div>
              
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                  style={{ animationDuration: '0.8s' }}
                ></div>
                
                <div className="text-4xl font-black z-10 flex flex-col items-center">
                  <span className="text-slate-200">
                     <span className="text-xs text-slate-400 absolute -top-8 -ml-8">Roll</span>
                     <AnimatedNumber target={diceRollInfo.rollValue} chance={diceRollInfo.chance} />
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-800/80 border border-slate-700 px-6 py-4 rounded-2xl text-center w-full max-w-sm">
                <div className="text-sm text-slate-400 mb-1">Chance de Sucesso</div>
                <div className="text-2xl font-bold text-emerald-400">{diceRollInfo.chance}%</div>
                <div className="text-xs text-slate-500 mt-2">Valores {diceRollInfo.chance} ou menores têm sucesso.</div>
              </div>
            </div>
          )}"""

dice_ui_new = """          {status === "ROLLING_DICE" && diceRollInfo && (
            <div className="flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-300">
              <div className="text-lg font-bold text-slate-400 tracking-widest uppercase">Executando a jogada...</div>
              
              <div className="h-32 flex items-center justify-center w-full">
                <AnimatedActionQuality rollValue={diceRollInfo.rollValue} chance={diceRollInfo.chance} />
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700/50 px-6 py-4 rounded-2xl text-center w-full max-w-xs transition-opacity duration-1000 delay-1500 opacity-80">
                <div className="text-xs text-slate-400 mb-1">Dificuldade da Jogada</div>
                <div className="text-lg font-bold text-slate-200">{diceRollInfo.chance}% de chance</div>
              </div>
            </div>
          )}"""

content = content.replace(dice_ui_old, dice_ui_new)

with open('src/components/InteractiveMatchModal.tsx', 'w') as f:
    f.write(content)
