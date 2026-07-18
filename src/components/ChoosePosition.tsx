import { Position } from "../types";

export function ChoosePosition({ onPositionSelected }: { onPositionSelected: (pos: Position) => void }) {
  const positions: { id: Position; label: string; desc: string }[] = [
    { id: "ATA", label: "Atacante", desc: "Chute e Ritmo" },
    { id: "PON", label: "Ponta", desc: "Ritmo e Drible" },
    { id: "MEI", label: "Meia Atacante", desc: "Passe e Drible" },
    { id: "MC", label: "Meio-Campo", desc: "Passe e Defesa" },
    { id: "VOL", label: "Volante", desc: "Defesa, Passe e Físico" },
    { id: "ZAG", label: "Zagueiro", desc: "Defesa e Físico" },
    { id: "LAT", label: "Lateral", desc: "Ritmo, Defesa e Passe" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-wide flex items-center justify-center gap-3">
            Escolha a Posição
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {positions.map((pos) => (
            <button
              key={pos.id}
              onClick={() => onPositionSelected(pos.id)}
              className="p-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-2xl flex flex-col text-center transition-all group"
            >
              <span className="text-emerald-400 font-black text-2xl mb-2 group-hover:text-emerald-300">
                {pos.id}
              </span>
              <span className="text-slate-200 text-sm font-bold">{pos.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
