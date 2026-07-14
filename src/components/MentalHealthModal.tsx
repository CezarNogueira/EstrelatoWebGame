import { Brain, Frown } from "lucide-react";

export function MentalHealthModal({ type, onContinue }: { type: "depressed" | "isolated"; onContinue: () => void }) {
  const isDepressed = type === "depressed";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Brain className={`w-16 h-16 ${isDepressed ? "text-slate-600" : "text-slate-500"}`} />
            <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1">
              <Frown className={`w-8 h-8 ${isDepressed ? "text-red-500" : "text-orange-500"}`} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">
            {isDepressed ? "Depressão" : "Isolamento"}
          </h2>
          <p className="text-slate-400 font-medium">
            {isDepressed
              ? "Seu humor chegou a 0%. Você foi diagnosticado com depressão grave e não tem condições de entrar em campo. Você perderá todos os jogos até buscar ajuda e melhorar sua saúde mental."
              : "Seu humor está muito baixo. Você tem se isolado do elenco, faltado aos treinos e perdido espaço no time, jogando menos partidas nesta temporada."}
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold uppercase tracking-wider transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
