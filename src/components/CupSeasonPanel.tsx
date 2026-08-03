import { useEffect, useRef, useState } from "react";
import { Player, Team, CupSeasonState } from "../types";
import {
  calculateOverall,
  simulateCupRoundBots,
  resolvePlayerCupMatch,
  advanceCupToNextRound,
  cupReachedFinalRound,
  countCupMatchesPlayed,
  generateSeasonMatchStats,
} from "../utils";
import { InteractiveMatchModal } from "./InteractiveMatchModal";
import { Play, FastForward, Trophy, SkipForward } from "lucide-react";

type CupResult = { cupName: string; isContinental: boolean; reachedFinal: boolean; won: boolean; goals: number; assists: number; matches: number };

// Pré-requisito: só deve ser renderizado enquanto !state.eliminated && !state.champion,
// OU no instante em que acabou de ser eliminado/coroado campeão (pra mostrar o resultado).
// Painel embutido na Dashboard (não é modal) para copas nacionais/continentais
// jogadas em chaveamento eliminatório, rodada a rodada.
export function CupSeasonPanel({
  player,
  state,
  onStateChange,
  onComplete,
}: {
  player: Player;
  state: CupSeasonState;
  onStateChange: (state: CupSeasonState) => void;
  onComplete: (result: CupResult) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [autoSimAll, setAutoSimAll] = useState(false);
  const autoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDone = state.eliminated || state.champion;
  const roundIdx = state.currentRoundIndex;
  const roundName = state.roundNames[roundIdx];
  const matches = state.roundsMatches[roundIdx] || [];
  const playerFixture = matches.find((m) => m.isPlayerMatch);
  const opponentTeam: Team | undefined =
    playerFixture && (playerFixture.home.id === player.currentTeam.id ? playerFixture.away : playerFixture.home);
  const isHome = playerFixture?.home.id === player.currentTeam.id;

  const resolveAndAdvance = (updated: CupSeasonState) => {
    const withBots = simulateCupRoundBots(updated);
    const advanced = advanceCupToNextRound(withBots);
    if (advanced.champion || advanced.eliminated) {
      onStateChange(advanced);
      return;
    }
    const nextRoundWithBots = simulateCupRoundBots(advanced);
    onStateChange(nextRoundWithBots);
  };

  const simulateCurrentTie = () => {
    if (!playerFixture || !opponentTeam) return;
    const currentOvr = calculateOverall(player.attributes, player.position);
    const expectedOvr = player.currentTeam.level * 15 + 35;
    const performanceRatio = Math.min(1.5, Math.max(0.5, currentOvr / expectedOvr));
    const { goals, assists } = generateSeasonMatchStats(player, 1, performanceRatio);

    // Placar-base coerente com o nível dos dois times, mata-mata decide empate.
    const base = Math.max(0, Math.round((currentOvr - 60) / 20));
    const homeGoals = isHome ? base + goals : Math.max(0, base - 1);
    const awayGoals = isHome ? Math.max(0, base - 1) : base + goals;

    const updated = resolvePlayerCupMatch(state, homeGoals, awayGoals, goals, assists);
    resolveAndAdvance(updated);
  };

  const handlePlayMatch = () => setPlaying(true);

  const handleMatchComplete = (
    _won: boolean,
    playerGoals: number,
    playerAssists: number,
    scoreFor?: number,
    scoreAgainst?: number
  ) => {
    setPlaying(false);
    if (!playerFixture) return;
    const goalsFor = scoreFor ?? 0;
    const goalsAgainst = scoreAgainst ?? 0;
    const homeGoals = isHome ? goalsFor : goalsAgainst;
    const awayGoals = isHome ? goalsAgainst : goalsFor;
    const updated = resolvePlayerCupMatch(state, homeGoals, awayGoals, playerGoals, playerAssists);
    resolveAndAdvance(updated);
  };

  useEffect(() => {
    if (!autoSimAll || playing || isDone) return;
    autoTimeoutRef.current = setTimeout(() => {
      simulateCurrentTie();
    }, 350);
    return () => {
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSimAll, roundIdx, playing, isDone]);

  useEffect(() => {
    if (isDone) setAutoSimAll(false);
  }, [isDone]);

  const handleFinish = () => {
    onComplete({
      cupName: state.cupName,
      isContinental: state.isContinental,
      reachedFinal: cupReachedFinalRound(state),
      won: state.champion,
      goals: state.playerGoalsTotal,
      assists: state.playerAssistsTotal,
      matches: countCupMatchesPlayed(state),
    });
  };

  if (playing && playerFixture && opponentTeam) {
    return (
      <InteractiveMatchModal
        player={player}
        finalType={state.cupName}
        headerLabel={`${roundName} - ${state.cupName}`}
        explicitOpponent={opponentTeam}
        allowDraw={false}
        onComplete={handleMatchComplete}
      />
    );
  }

  if (isDone) {
    return (
      <div
        className={`rounded-xl p-4 border space-y-3 ${
          state.champion ? "bg-yellow-500/10 border-yellow-500/40" : "bg-slate-950 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-2">
          <Trophy className={`w-5 h-5 ${state.champion ? "text-yellow-400" : "text-slate-500"}`} />
          <p className="text-sm font-black text-white">{state.cupName}</p>
        </div>
        <p className="text-xs text-slate-400">
          {state.champion
            ? `Campeão! Título conquistado na ${state.roundNames[state.roundNames.length - 1]}.`
            : `Eliminado na fase: ${roundName}.`}
        </p>
        <button
          onClick={handleFinish}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-all"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{state.cupName}</p>
        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{roundName}</p>
      </div>

      {playerFixture && opponentTeam && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {opponentTeam.logo ? (
              <img src={opponentTeam.logo} className="w-4 h-4 object-contain shrink-0" alt={opponentTeam.name} />
            ) : (
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: opponentTeam.color || "#64748b" }} />
            )}
            <span className="text-xs font-bold text-white truncate">
              {!isHome && "@ "}
              {opponentTeam.name}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handlePlayMatch}
          disabled={autoSimAll}
          className="py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" fill="currentColor" /> Jogar
        </button>
        <button
          onClick={simulateCurrentTie}
          disabled={autoSimAll}
          className="py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 border border-slate-700"
        >
          <FastForward className="w-3.5 h-3.5" /> Simular
        </button>
        <button
          onClick={() => setAutoSimAll((v) => !v)}
          className={`col-span-2 py-2 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 border ${
            autoSimAll
              ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
              : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
          }`}
        >
          <SkipForward className="w-3.5 h-3.5" /> {autoSimAll ? "Parar" : "Simular até o fim"}
        </button>
      </div>
    </div>
  );
}
