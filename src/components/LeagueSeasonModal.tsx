import { useState } from "react";
import { Player, Team, LeagueSeasonState, LeagueMatch } from "../types";
import {
  calculateOverall,
  simulateLeagueRound,
  simulateLeagueMatchResult,
  resolvePlayerLeagueMatch,
  getPlayerLeaguePosition,
  generateSeasonMatchStats,
} from "../utils";
import { InteractiveMatchModal } from "./InteractiveMatchModal";
import { LeagueTable } from "./LeagueTable";
import { Play, FastForward, ChevronRight, Trophy } from "lucide-react";

type Phase = "PROMPT" | "PLAYING" | "ROUND_SUMMARY";

type SeasonResult = { matches: number; goals: number; assists: number; leaguePosition: number };

// Pré-requisito: só deve ser renderizado quando player.isPro && player.currentTeam.id !== "none".
// Componente CONTROLADO: quem chama (App.tsx) é dono do LeagueSeasonState,
// assim a tabela também pode ser exibida em outros lugares (ex: Dashboard)
// enquanto a temporada está em andamento.
//
// Fluxo rodada a rodada da liga do jogador (turno e returno - 38 jogos para
// uma liga de 20 times). A cada rodada, os outros jogos são simulados
// automaticamente e o jogo do próprio jogador fica pendente até o usuário
// escolher "Jogar" (abre a InteractiveMatchModal) ou "Simular".
export function LeagueSeasonModal({
  player,
  state,
  onStateChange,
  onComplete,
}: {
  player: Player;
  state: LeagueSeasonState;
  onStateChange: (state: LeagueSeasonState) => void;
  onComplete: (result: SeasonResult) => void;
}) {
  const [phase, setPhase] = useState<Phase>("PROMPT");
  const [seasonGoals, setSeasonGoals] = useState(0);
  const [seasonAssists, setSeasonAssists] = useState(0);
  const [lastRoundMatches, setLastRoundMatches] = useState<LeagueMatch[]>([]);
  const [seasonResult, setSeasonResult] = useState<SeasonResult | null>(null);

  const round = state.currentRound;
  const playerFixture = state.fixtures.find((m) => m.round === round && m.isPlayerMatch);
  const opponentTeam: Team | undefined =
    playerFixture && (playerFixture.home.id === player.currentTeam.id ? playerFixture.away : playerFixture.home);
  const isHome = playerFixture?.home.id === player.currentTeam.id;

  const finishRoundAndAdvance = (updatedState: LeagueSeasonState, goalsThisMatch: number, assistsThisMatch: number) => {
    const newGoals = seasonGoals + goalsThisMatch;
    const newAssists = seasonAssists + assistsThisMatch;
    setSeasonGoals(newGoals);
    setSeasonAssists(newAssists);
    setLastRoundMatches(updatedState.fixtures.filter((m) => m.round === round));
    onStateChange(updatedState);

    if (round >= updatedState.totalRounds) {
      const leaguePosition = getPlayerLeaguePosition(updatedState, player.currentTeam.id);
      setSeasonResult({ matches: updatedState.totalRounds, goals: newGoals, assists: newAssists, leaguePosition });
    }
    setPhase("ROUND_SUMMARY");
  };

  const handleSimulateMatch = () => {
    if (!playerFixture) return;
    const result = simulateLeagueMatchResult(playerFixture.home, playerFixture.away);
    const updated = resolvePlayerLeagueMatch(state, round, result.homeGoals, result.awayGoals);

    const currentOvr = calculateOverall(player.attributes, player.position);
    const expectedOvr = player.currentTeam.level * 15 + 35;
    const performanceRatio = Math.min(1.5, Math.max(0.5, currentOvr / expectedOvr));
    const { goals, assists } = generateSeasonMatchStats(player, 1, performanceRatio);

    finishRoundAndAdvance(updated, goals, assists);
  };

  const handlePlayMatch = () => setPhase("PLAYING");

  const handleMatchComplete = (
    _won: boolean,
    playerGoals: number,
    playerAssists: number,
    scoreFor?: number,
    scoreAgainst?: number
  ) => {
    if (!playerFixture) return;
    const goalsFor = scoreFor ?? 0;
    const goalsAgainst = scoreAgainst ?? 0;
    const homeGoals = isHome ? goalsFor : goalsAgainst;
    const awayGoals = isHome ? goalsAgainst : goalsFor;
    const updated = resolvePlayerLeagueMatch(state, round, homeGoals, awayGoals);
    finishRoundAndAdvance(updated, playerGoals, playerAssists);
  };

  const handleContinue = () => {
    if (seasonResult) {
      onComplete(seasonResult);
      return;
    }
    const nextRound = round + 1;
    const withBotsSimulated = simulateLeagueRound(state, nextRound);
    onStateChange({ ...withBotsSimulated, currentRound: nextRound });
    setPhase("PROMPT");
  };

  if (phase === "PLAYING" && playerFixture && opponentTeam) {
    return (
      <InteractiveMatchModal
        player={player}
        finalType={state.leagueName}
        headerLabel={`Rodada ${round}/${state.totalRounds} - ${state.leagueName}`}
        explicitOpponent={opponentTeam}
        allowDraw
        onComplete={handleMatchComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/95 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 shrink-0 text-center">
          <h2 className="text-2xl font-black text-white">{state.leagueName}</h2>
          <p className="text-slate-400 text-sm font-bold mt-1">
            Rodada {round} de {state.totalRounds}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {phase === "PROMPT" && playerFixture && opponentTeam && (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sua partida</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-2 w-24">
                    {player.currentTeam.logo ? (
                      <img src={player.currentTeam.logo} className="w-12 h-12 object-contain" alt={player.currentTeam.name} />
                    ) : (
                      <span className="w-10 h-10 rounded-full" style={{ backgroundColor: player.currentTeam.color || "#64748b" }} />
                    )}
                    <span className="text-xs font-bold text-slate-300 truncate w-full text-center">
                      {player.currentTeam.name}
                    </span>
                  </div>
                  <span className="text-slate-600 font-black">x</span>
                  <div className="flex flex-col items-center gap-2 w-24">
                    {opponentTeam.logo ? (
                      <img src={opponentTeam.logo} className="w-12 h-12 object-contain" alt={opponentTeam.name} />
                    ) : (
                      <span className="w-10 h-10 rounded-full" style={{ backgroundColor: opponentTeam.color || "#64748b" }} />
                    )}
                    <span className="text-xs font-bold text-slate-300 truncate w-full text-center">{opponentTeam.name}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-xs">{isHome ? "Jogo em casa" : "Jogo fora de casa"}</p>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={handlePlayMatch}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" fill="currentColor" /> Jogar Partida
                  </button>
                  <button
                    onClick={handleSimulateMatch}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <FastForward className="w-5 h-5" /> Simular Partida
                  </button>
                </div>
              </div>
            )}

            {phase === "ROUND_SUMMARY" && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> Resultados da Rodada {round}
                </p>
                <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {lastRoundMatches.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg ${
                        m.isPlayerMatch ? "bg-emerald-500/10 border border-emerald-500/40" : "bg-slate-900/60"
                      }`}
                    >
                      <span className="text-slate-300 font-medium truncate flex-1">{m.home.name}</span>
                      <span className="font-black text-slate-100 px-2">
                        {m.homeGoals} - {m.awayGoals}
                      </span>
                      <span className="text-slate-300 font-medium truncate flex-1 text-right">{m.away.name}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleContinue}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {seasonResult ? "Finalizar Temporada" : "Próxima Rodada"} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <LeagueTable standings={state.standings} playerTeamId={player.currentTeam.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
