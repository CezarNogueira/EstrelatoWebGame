import { useEffect, useRef, useState } from "react";
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
import { Play, FastForward, SkipForward } from "lucide-react";

type SeasonResult = { matches: number; goals: number; assists: number; leaguePosition: number };

function ratingColor(rating: number) {
  if (rating >= 8.5) return "text-yellow-400";
  if (rating >= 7) return "text-emerald-400";
  if (rating >= 6) return "text-blue-400";
  return "text-slate-400";
}

// Pré-requisito: só deve ser renderizado quando player.isPro && player.currentTeam.id !== "none".
// Painel EMBUTIDO na própria Dashboard (não é modal) que mostra o último e o
// próximo jogo da liga e vai simulando/jogando rodada a rodada, atualizando
// a tabela (exibida à parte, na coluna vizinha) automaticamente.
export function LeagueSeasonPanel({
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
  const [playing, setPlaying] = useState(false);
  const [autoSimAll, setAutoSimAll] = useState(false);
  const [seasonGoals, setSeasonGoals] = useState(0);
  const [seasonAssists, setSeasonAssists] = useState(0);
  const autoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = state.currentRound;
  const isSeasonOver = round > state.totalRounds;
  const playerFixture = state.fixtures.find((m) => m.round === round && m.isPlayerMatch);
  const opponentTeam: Team | undefined =
    playerFixture && (playerFixture.home.id === player.currentTeam.id ? playerFixture.away : playerFixture.home);
  const isHome = playerFixture?.home.id === player.currentTeam.id;

  const playedPlayerMatches = state.fixtures
    .filter((m) => m.isPlayerMatch && m.played)
    .sort((a, b) => b.round - a.round);
  const lastMatch = playedPlayerMatches[0];

  const advanceRound = (updatedState: LeagueSeasonState, goalsThisMatch: number, assistsThisMatch: number) => {
    const newGoals = seasonGoals + goalsThisMatch;
    const newAssists = seasonAssists + assistsThisMatch;
    setSeasonGoals(newGoals);
    setSeasonAssists(newAssists);

    if (round >= state.totalRounds) {
      const leaguePosition = getPlayerLeaguePosition(updatedState, player.currentTeam.id);
      onStateChange({ ...updatedState, currentRound: state.totalRounds + 1 });
      onComplete({ matches: state.totalRounds, goals: newGoals, assists: newAssists, leaguePosition });
      return;
    }

    const nextRound = round + 1;
    const withBotsSimulated = simulateLeagueRound(updatedState, nextRound);
    onStateChange({ ...withBotsSimulated, currentRound: nextRound });
  };

  const simulateCurrentMatch = () => {
    if (!playerFixture) return;
    const result = simulateLeagueMatchResult(playerFixture.home, playerFixture.away);

    const currentOvr = calculateOverall(player.attributes, player.position);
    const expectedOvr = player.currentTeam.level * 15 + 35;
    const performanceRatio = Math.min(1.5, Math.max(0.5, currentOvr / expectedOvr));
    const { goals, assists } = generateSeasonMatchStats(player, 1, performanceRatio);

    const updated = resolvePlayerLeagueMatch(
      state,
      round,
      result.homeGoals,
      result.awayGoals,
      player.currentTeam.id,
      goals,
      assists
    );
    advanceRound(updated, goals, assists);
  };

  const handlePlayMatch = () => setPlaying(true);

  const handleMatchComplete = (
    _won: boolean,
    playerGoals: number,
    playerAssists: number,
    scoreFor?: number,
    scoreAgainst?: number
  ) => {
    if (!playerFixture) return;
    setPlaying(false);
    const goalsFor = scoreFor ?? 0;
    const goalsAgainst = scoreAgainst ?? 0;
    const homeGoals = isHome ? goalsFor : goalsAgainst;
    const awayGoals = isHome ? goalsAgainst : goalsFor;
    const updated = resolvePlayerLeagueMatch(
      state,
      round,
      homeGoals,
      awayGoals,
      player.currentTeam.id,
      playerGoals,
      playerAssists
    );
    advanceRound(updated, playerGoals, playerAssists);
  };

  // "Simular Tudo": avança rodada a rodada sozinho (sempre simulando, nunca
  // jogando), com um pequeno intervalo entre rodadas para o usuário
  // acompanhar os resultados e a tabela mudando em tempo real.
  useEffect(() => {
    if (!autoSimAll || playing || isSeasonOver) return;
    autoTimeoutRef.current = setTimeout(() => {
      simulateCurrentMatch();
    }, 350);
    return () => {
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSimAll, round, playing, isSeasonOver]);

  useEffect(() => {
    if (isSeasonOver) setAutoSimAll(false);
  }, [isSeasonOver]);

  if (playing && playerFixture && opponentTeam) {
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
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Último Jogo</p>
          {lastMatch ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {(() => {
                  const wasHome = lastMatch.home.id === player.currentTeam.id;
                  const opp = wasHome ? lastMatch.away : lastMatch.home;
                  return (
                    <>
                      {opp.logo ? (
                        <img src={opp.logo} className="w-4 h-4 object-contain shrink-0" alt={opp.name} />
                      ) : (
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: opp.color || "#64748b" }} />
                      )}
                      <span className="text-xs font-bold text-slate-300 truncate">
                        {!wasHome && "@ "}
                        {opp.name}
                      </span>
                    </>
                  );
                })()}
              </div>
              {(() => {
                const wasHome = lastMatch.home.id === player.currentTeam.id;
                const ourGoals = wasHome ? lastMatch.homeGoals! : lastMatch.awayGoals!;
                const theirGoals = wasHome ? lastMatch.awayGoals! : lastMatch.homeGoals!;
                const color = ourGoals > theirGoals ? "text-emerald-400" : ourGoals < theirGoals ? "text-red-400" : "text-slate-300";
                return <span className={`text-sm font-black shrink-0 ${color}`}>{ourGoals}-{theirGoals}</span>;
              })()}
            </div>
          ) : (
            <p className="text-xs text-slate-600">Nenhum ainda</p>
          )}
        </div>

        <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Próximo Jogo</p>
          {!isSeasonOver && opponentTeam ? (
            <div className="flex items-center gap-1.5 min-w-0">
              {opponentTeam.logo ? (
                <img src={opponentTeam.logo} className="w-4 h-4 object-contain shrink-0" alt={opponentTeam.name} />
              ) : (
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: opponentTeam.color || "#64748b" }} />
              )}
              <span className="text-xs font-black text-white truncate">
                {!isHome && "@ "}
                {opponentTeam.name.toUpperCase()}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-600">Temporada concluída</p>
          )}
          <p className="text-[10px] text-slate-600 font-bold mt-1">LIG • Rodada {Math.min(round, state.totalRounds)}/{state.totalRounds}</p>
        </div>
      </div>

      {!isSeasonOver && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePlayMatch}
            disabled={autoSimAll}
            className="py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" fill="currentColor" /> Jogar
          </button>
          <button
            onClick={simulateCurrentMatch}
            disabled={autoSimAll}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <FastForward className="w-3.5 h-3.5" /> Simular
          </button>
          <button
            onClick={() => setAutoSimAll((v) => !v)}
            className={`col-span-2 py-2.5 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border ${
              autoSimAll
                ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
            }`}
          >
            <SkipForward className="w-3.5 h-3.5" /> {autoSimAll ? "Parar Simulação Automática" : "Simular Temporada Inteira"}
          </button>
        </div>
      )}

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Temporada</p>
        <div className="space-y-1 max-h-16 overflow-y-auto custom-scrollbar pr-1">
          {playedPlayerMatches.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-4">Nenhuma partida disputada ainda.</p>
          ) : (
            playedPlayerMatches.map((m: LeagueMatch) => {
              const wasHome = m.home.id === player.currentTeam.id;
              const opp = wasHome ? m.away : m.home;
              const ourGoals = wasHome ? m.homeGoals! : m.awayGoals!;
              const theirGoals = wasHome ? m.awayGoals! : m.homeGoals!;
              const scoreColor = ourGoals > theirGoals ? "text-emerald-400" : ourGoals < theirGoals ? "text-red-400" : "text-slate-300";
              return (
                <div key={m.id} className="flex items-center gap-2 text-xs py-1.5 px-1">
                  <span className="text-slate-600 font-bold w-6 shrink-0">LIG</span>
                  {opp.logo ? (
                    <img src={opp.logo} className="w-4 h-4 object-contain shrink-0" alt={opp.name} />
                  ) : (
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: opp.color || "#64748b" }} />
                  )}
                  <span className="text-slate-300 font-medium truncate flex-1">
                    {!wasHome && "@ "}
                    {opp.name}
                  </span>
                  {m.playerRating !== undefined && (
                    <span className={`font-bold shrink-0 ${ratingColor(m.playerRating)}`}>{m.playerRating.toFixed(1)}</span>
                  )}
                  <span className={`font-black shrink-0 ${scoreColor}`}>{ourGoals}-{theirGoals}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
