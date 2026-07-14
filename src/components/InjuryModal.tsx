import { HeartPulse, HeartCrack } from "lucide-react";

export function InjuryModal({
  days,
  careerEnding,
  onContinue,
}: {
  days: number;
  careerEnding: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            careerEnding ? "bg-red-500/10" : "bg-orange-500/10"
          }`}
        >
          {careerEnding ? (
            <HeartCrack className="w-8 h-8 text-red-500" />
          ) : (
            <HeartPulse className="w-8 h-8 text-orange-400" />
          )}
        </div>

        <div className="space-y-2">
          <h3
            className={`text-2xl font-black ${
              careerEnding ? "text-red-400" : "text-orange-400"
            }`}
          >
            {careerEnding ? "Lesão Gravíssima!" : "Você se Lesionou!"}
          </h3>

          {careerEnding ? (
            <p className="text-slate-300">
              Sua Saúde chegou a 0% e você sofreu uma lesão gravíssima em campo.
              Os médicos foram categóricos: sua carreira como jogador
              profissional chega ao fim.
            </p>
          ) : (
            <p className="text-slate-300">
              Durante a temporada você sofreu uma lesão que te tirou dos
              gramados por um bom período, afetando seus jogos e seu
              rendimento.
            </p>
          )}
        </div>

        {!careerEnding && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
            <span className="text-slate-500 font-bold uppercase text-xs block mb-1">
              Tempo de Recuperação
            </span>
            <span className="text-4xl font-black text-orange-400">
              {days} {days === 1 ? "dia" : "dias"}
            </span>
          </div>
        )}

        <button
          onClick={onContinue}
          className={`w-full py-4 font-bold rounded-xl transition-all ${
            careerEnding
              ? "bg-red-500 hover:bg-red-600 text-slate-950"
              : "bg-orange-500 hover:bg-orange-600 text-slate-950"
          }`}
        >
          {careerEnding ? "Encerrar Carreira" : "Continuar"}
        </button>
      </div>
    </div>
  );
}
