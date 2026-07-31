import { LeagueStanding } from "../types";
import { sortLeagueStandings } from "../utils";

export function LeagueTable({
  standings,
  playerTeamId,
  promotionSpots = 4,
  relegationSpots = 4,
  promotionLabel = "ACESSO",
  relegationLabel = "REBAIXAMENTO",
}: {
  standings: LeagueStanding[];
  playerTeamId?: string;
  promotionSpots?: number;
  relegationSpots?: number;
  promotionLabel?: string;
  relegationLabel?: string;
}) {
  const sorted = sortLeagueStandings(standings);
  const playerPosition = sorted.findIndex((s) => s.teamId === playerTeamId) + 1;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-amber-400 font-black text-[11px] tracking-[0.2em] uppercase">Tabela</span>
        {playerPosition > 0 && (
          <span className="text-slate-500 text-xs font-bold">
            POS <span className="text-amber-400">{playerPosition}º</span>
          </span>
        )}
      </div>

      <div className="space-y-0.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
        {sorted.map((s, idx) => {
          const pos = idx + 1;
          const isPlayerTeam = s.teamId === playerTeamId;
          const inPromotion = promotionSpots > 0 && pos <= promotionSpots;
          const inRelegation = relegationSpots > 0 && pos > sorted.length - relegationSpots;

          return (
            <div
              key={s.teamId}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-colors ${
                isPlayerTeam ? "bg-amber-500/10 border border-amber-500/40" : "border border-transparent"
              }`}
            >
              <span
                className={`w-0.5 h-4 rounded-full shrink-0 ${
                  inPromotion ? "bg-emerald-500" : inRelegation ? "bg-red-500" : "bg-transparent"
                }`}
              ></span>
              <span className="w-4 text-slate-500 font-bold shrink-0">{pos}</span>

              {s.team.logo ? (
                <img src={s.team.logo} alt={s.team.name} className="w-5 h-5 object-contain shrink-0" />
              ) : (
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: s.team.color || "#64748b" }}
                ></span>
              )}

              <span className={`flex-1 font-bold truncate ${isPlayerTeam ? "text-amber-300" : "text-slate-300"}`}>
                {s.team.name.toUpperCase()}
              </span>

              <span className="font-black text-slate-100 w-6 text-right shrink-0">{s.points}</span>
            </div>
          );
        })}
      </div>

      {(promotionSpots > 0 || relegationSpots > 0) && (
        <div className="flex justify-center gap-4 mt-3 text-[10px] font-bold">
          {promotionSpots > 0 && <span className="text-emerald-400">— {promotionLabel}</span>}
          {relegationSpots > 0 && <span className="text-red-400">— {relegationLabel}</span>}
        </div>
      )}
    </div>
  );
}
