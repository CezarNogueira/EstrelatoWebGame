import { Team } from "../types";
import { Handshake } from "lucide-react";

export function ContractOffersModal({
  offers,
  currentTeamId,
  onSelect,
}: {
  offers: Team[];
  currentTeamId: string;
  onSelect: (team: Team) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-6">
        <div className="text-center">
          <div className="p-4 bg-emerald-500/10 rounded-full inline-flex mb-2">
            <Handshake className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-100">Fim de Contrato!</h3>
          <p className="text-slate-400 mt-2">
            {offers.length > 1
              ? `Seu contrato chegou ao fim e ${offers.length} clubes têm interesse em te contratar. Escolha seu próximo destino:`
              : "Seu contrato chegou ao fim. Escolha como seguir sua carreira:"}
          </p>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {offers.map((team) => {
            const isCurrent = team.id === currentTeamId;
            return (
              <button
                key={team.id}
                onClick={() => onSelect(team)}
                className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-950 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {team.logo ? (
                    <img 
                      src={team.logo} 
                      alt={`Logo do ${team.name}`}
                      className="w-10 h-10 rounded-none object-contain shrink-0" 
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full border-2 border-slate-700 shrink-0"
                      style={{ backgroundColor: team.color }}
                    />
                  )}

                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 truncate">{team.name}</div>
                    <div className="text-xs text-slate-500">
                      {team.country} · {"★".repeat(team.level)}
                    </div>
                  </div>
                </div>
                {isCurrent && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full shrink-0">
                    Renovar
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
