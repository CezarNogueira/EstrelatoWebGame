import { Position } from "../types";
import { User } from "lucide-react";

export function ChoosePosition({ onPositionSelected }: { onPositionSelected: (pos: Position) => void }) {
  const positions: { id: Position; label: string; desc: string }[] = [
    { id: "ATA", label: "Atacante", desc: "Prioridade: Chute e Ritmo" },
    { id: "PON", label: "Ponta", desc: "Prioridade: Ritmo e Drible" },
    { id: "MEI", label: "Meia Atacante", desc: "Prioridade: Passe e Drible" },
    { id: "MC", label: "Meio-Campo", desc: "Prioridade: Passe e Defesa" },
    { id: "VOL", label: "Volante", desc: "Prioridade: Defesa, Passe e Físico" },
    { id: "ZAG", label: "Zagueiro", desc: "Prioridade: Defesa e Físico" },
    { id: "LAT", label: "Lateral", desc: "Prioridade: Ritmo, Defesa e Passe" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 flex items-center justify-center gap-3">
            <User className="text-emerald-500 w-8 h-8" />
            Qual a sua Posição?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {positions.map((pos) => (
            <button
              key={pos.id}
              onClick={() => onPositionSelected(pos.id)}
              className="p-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-2xl flex flex-col items-start text-left transition-all group"
            >
              <span className="text-emerald-400 font-black text-2xl mb-1 group-hover:text-emerald-300">
                {pos.id}
              </span>
              <span className="text-white font-bold mb-2">{pos.label}</span>
              <span className="text-slate-500 text-sm">{pos.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
