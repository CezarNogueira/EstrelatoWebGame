import { Target, Zap } from "lucide-react";
import { motion } from "motion/react";

export function ChooseMode({ onSelect }: { onSelect: (mode: "STORY" | "QUICK") => void }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518605368461-1ee114757c91?auto=format&fit=crop&q=80&w=2000")' }}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <div className="z-10 w-full max-w-2xl">
        <h2 className="text-3xl font-black text-center text-white mb-2 uppercase tracking-widest">Escolha o Modo de Jogo</h2>
        <p className="text-slate-400 text-center mb-8">Como você quer viver a sua carreira?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect("STORY")}
            className="bg-slate-900 border-2 border-slate-700 hover:border-blue-500 rounded-3xl p-6 text-left transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
            
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wider">Modo História</h3>
            <p className="text-slate-400 text-sm">
              A experiência completa. Gerencie sua carreira, faça amizades, namore, compre imóveis, vá a festas e viva a vida de um super astro dentro e fora de campo.
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect("QUICK")}
            className="bg-slate-900 border-2 border-slate-700 hover:border-emerald-500 rounded-3xl p-6 text-left transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
            
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wider">Modo Rápido</h3>
            <p className="text-slate-400 text-sm">
              Foco total no futebol. Pule relacionamentos, festas e vida pessoal. O celular terá apenas contratos e patrocínios. Ideal para simulações mais rápidas.
            </p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
