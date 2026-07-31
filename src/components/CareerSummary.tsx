import { Player, SeasonStat } from "../types";
import { Trophy, Goal, Calendar, Medal, Shield, ShieldCheck, Star, Award } from "lucide-react";

const POSITION_LABEL: Record<string, string> = {
  ATA: "atacante",
  PON: "ponta",
  MEI: "meia",
  MC: "meio-campista",
  VOL: "volante",
  ZAG: "zagueiro",
  LAT: "lateral",
};

function getRatingColor(rating: number) {
  if (rating >= 90) return "bg-yellow-500/15 border-yellow-500/50 text-yellow-300";
  if (rating >= 80) return "bg-emerald-500/15 border-emerald-500/50 text-emerald-300";
  if (rating >= 70) return "bg-blue-500/15 border-blue-500/50 text-blue-300";
  return "bg-slate-700/30 border-slate-600/50 text-slate-300";
}

function seasonWonTitle(stat: SeasonStat) {
  const wonFinal = !!stat.finals?.some((f) => f.won);
  const wonLeague = stat.leaguePosition === 1 && !!stat.leagueName;
  return wonFinal || wonLeague;
}

// Gera a mensagem final de despedida com base no que o jogador construiu na
// carreira (títulos, prêmios individuais, artilharia, assistências, lesões
// etc) e na sua posição em campo. Cobre 10 perfis de carreira diferentes.
function getFarewellMessage(
  player: Player,
  stats: {
    totalGoals: number;
    totalAssists: number;
    totalTackles: number;
    totalCleanSheets: number;
    totalTeamTitles: number;
    totalIndividualAwards: number;
    ballonDorCount: number;
    peakRating: number;
    seasonEndingInjuries: number;
    injuredSeasons: number;
  }
) {
  const { name, position } = player;
  const posLabel = POSITION_LABEL[position] || "jogador";
  const isAttacker = ["ATA", "PON", "MEI"].includes(position);
  const isDefensive = ["ZAG", "LAT", "VOL"].includes(position);
  const {
    totalGoals,
    totalAssists,
    totalTackles,
    totalTeamTitles,
    totalIndividualAwards,
    ballonDorCount,
    peakRating,
    seasonEndingInjuries,
    injuredSeasons,
  } = stats;

  if (ballonDorCount >= 3) {
    return `${name} encerra a carreira como uma lenda absoluta do futebol: são ${ballonDorCount} Bolas de Ouro que colocam seu nome ao lado dos maiores de todos os tempos`;
  }

  if (ballonDorCount >= 1) {
    return `${name} pendura as chuteiras como um dos nomes mais respeitados do futebol mundial`;
  }

  if (totalTeamTitles >= 15) {
    return `${name} se despede como um verdadeiro colecionador de taças: foram ${totalTeamTitles} títulos conquistados ao longo de sua carreira`;
  }

  if (peakRating >= 90 && isAttacker) {
    return `Como ${posLabel} de elite mundial, ${name} encantou torcidas por onde passou e se despede como um verdadeiro ídolo dos gramados`;
  }

  if (isDefensive && (totalTackles >= 800)) {
    return `${name} construiu a carreira na base do sacrifício e da liderança defensiva, um ${posLabel} que a torcida jamais vai esquecer.`;
  }

  if (position === "MEI" && totalAssists >= 150) {
    return `${name} encerra a carreira como um maestro do meio campo`;
  }

  if (totalGoals >= 800) {
    return `${name} encerra a carreira como um dos melhores finalizadores do mundo`;
  }

  if (seasonEndingInjuries >= 2 || injuredSeasons >= 6) {
    return `A carreira de ${name} foi marcada por lesões e desafios físicos`;
  }

  if (totalTeamTitles < 3 && totalIndividualAwards === 0) {
    return `${name} não foi um nome conhecido e não será lembrado`;
  }

  return `Obrigado por tudo ${name}`;
}

export function CareerSummary({ player, onRestart }: { player: Player; onRestart: () => void }) {
  const showDefensiveStats = !["ATA", "PON", "MEI", "MC"].includes(player.position);

  const totalMatches = player.history.reduce((sum, stat) => sum + stat.matches, 0);
  const totalGoals = player.history.reduce((sum, stat) => sum + stat.goals, 0);
  const totalAssists = player.history.reduce((sum, stat) => sum + stat.assists, 0);
  const totalTackles = player.history.reduce((sum, stat) => sum + (stat.tackles || 0), 0);
  const totalCleanSheets = player.history.reduce((sum, stat) => sum + (stat.cleanSheets || 0), 0);

  const teamTitles = player.history.reduce((acc, stat) => {
    stat.finals?.forEach(f => {
      if (f.won) {
        acc[f.type] = (acc[f.type] || 0) + 1;
      }
    });
    if (stat.leaguePosition === 1 && stat.leagueName) {
      acc[stat.leagueName] = (acc[stat.leagueName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const individualAwards = player.history.reduce((acc, stat) => {
    stat.individualAwards?.forEach(award => {
      acc[award] = (acc[award] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const totalTeamTitles = Object.values(teamTitles).reduce((a, b) => a + b, 0);
  const totalIndividualAwards = Object.values(individualAwards).reduce((a, b) => a + b, 0);
  const ballonDorCount = individualAwards["Bola de Ouro"] || 0;

  const seasonEndingInjuries = player.history.filter((s) => s.seasonEndingInjury).length;
  const injuredSeasons = player.history.filter((s) => s.injured).length;

  // Temporadas em ordem cronológica (a primeira temporada da carreira primeiro).
  const chronological = [...player.history].reverse();
  const peakRating = chronological.reduce((max, s) => Math.max(max, s.rating), 0);
  const peakIndex = chronological.reduce(
    (bestIdx, s, idx) => (s.rating >= chronological[bestIdx].rating ? idx : bestIdx),
    0
  );

  const farewellMessage = getFarewellMessage(player, {
    totalGoals,
    totalAssists,
    totalTackles,
    totalCleanSheets,
    totalTeamTitles,
    totalIndividualAwards,
    ballonDorCount,
    peakRating,
    seasonEndingInjuries,
    injuredSeasons,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-8">
        <div className="p-4 bg-emerald-500/10 rounded-full mb-2 mt-8">
          <Medal className="w-20 h-20 text-emerald-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-white">Fim de Carreira</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{farewellMessage}</p>
        </div>

        <div
          className={`grid grid-cols-2 gap-4 w-full max-w-4xl ${
            showDefensiveStats ? "sm:grid-cols-3 lg:grid-cols-6" : "sm:grid-cols-4"
          }`}
        >
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-2">
            <Calendar className="w-8 h-8 text-slate-400" />
            <span className="text-3xl font-black">{totalMatches}</span>
            <span className="text-slate-500 font-bold uppercase text-xs">Jogos</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-2">
            <Goal className="w-8 h-8 text-emerald-400" />
            <span className="text-3xl font-black">{totalGoals}</span>
            <span className="text-slate-500 font-bold uppercase text-xs">Gols</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-2">
            <Goal className="w-8 h-8 text-blue-400" />
            <span className="text-3xl font-black">{totalAssists}</span>
            <span className="text-slate-500 font-bold uppercase text-xs">Assistências</span>
          </div>
          {showDefensiveStats && (
            <>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-2">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-black">{totalTackles}</span>
                <span className="text-slate-500 font-bold uppercase text-xs">Desarmes</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <span className="text-3xl font-black">{totalCleanSheets}</span>
                <span className="text-slate-500 font-bold uppercase text-xs">Sem Sofrer</span>
              </div>
            </>
          )}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-400" />
            <span className="text-3xl font-black">{totalTeamTitles + totalIndividualAwards}</span>
            <span className="text-slate-500 font-bold uppercase text-xs">Prêmios</span>
          </div>
        </div>

        {peakIndex >= 0 && chronological.length > 0 && (
          <div className="w-full bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/40 rounded-2xl p-4 flex items-center justify-center gap-3 text-left">
            <Star className="w-6 h-6 text-yellow-400 shrink-0" />
            <p className="text-sm text-slate-300">
              <span className="font-bold text-yellow-400">Temporada de Auge:</span> Temporada{" "}
              {peakIndex + 1} ({chronological[peakIndex].age} anos), pelo {chronological[peakIndex].team.name} - OVR{" "}
              <span className="font-black text-yellow-300">{chronological[peakIndex].rating}</span>
            </p>
          </div>
        )}

        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left">
          <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm">
            Temporada a Temporada
          </h3>
          <div className="space-y-1.5 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
            {chronological.map((stat, idx) => {
              const isPeak = idx === peakIndex;
              const wonTitle = seasonWonTitle(stat);
              const hasIndividualAward = !!stat.individualAwards && stat.individualAwards.length > 0;
              const wonBallonDor = !!stat.individualAwards?.includes("Bola de Ouro");

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                    isPeak
                      ? "bg-yellow-500/10 border-yellow-500/60"
                      : "bg-slate-950/60 border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 shrink-0">
                      <span className="text-xs font-bold text-slate-400">Temp. {idx + 1}</span>
                      <p className="text-[10px] text-slate-600">{stat.age} anos</p>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      {stat.team.logo ? (
                        <img src={stat.team.logo} alt={stat.team.name} className="w-6 h-6 rounded-full object-contain bg-slate-800 shrink-0" />
                      ) : (
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: stat.team.color || "#64748b" }}
                        ></span>
                      )}
                      <span className="text-slate-300 font-medium text-sm truncate">{stat.team.name}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {wonTitle && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                      {wonBallonDor && <Star className="w-3.5 h-3.5 text-yellow-400" />}
                      {!wonBallonDor && hasIndividualAward && <Award className="w-3.5 h-3.5 text-yellow-500" />}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-500 font-semibold">
                      {stat.goals}
                      <span className="text-slate-600 font-normal"> G</span>
                    </span>
                    <span className={`text-xs font-black px-2 py-1 rounded-lg border ${getRatingColor(stat.rating)}`}>
                      {stat.rating} OVR
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Títulos Coletivos ({totalTeamTitles})
            </h3>
            {Object.keys(teamTitles).length === 0 ? (
              <p className="text-slate-500 italic">Nenhum título conquistado.</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(teamTitles).sort((a,b) => b[1] - a[1]).map(([title, count]) => (
                  <li key={title} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-300 font-medium">{title}</span>
                    <span className="font-bold text-amber-500 text-lg">{count}x</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5" />
              Prêmios Individuais ({totalIndividualAwards})
            </h3>
            {Object.keys(individualAwards).length === 0 ? (
              <p className="text-slate-500 italic">Nenhum prêmio individual.</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(individualAwards).sort((a,b) => b[1] - a[1]).map(([award, count]) => (
                  <li key={award} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-300 font-medium">{award}</span>
                    <span className="font-bold text-yellow-500 text-lg">{count}x</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full sm:w-auto mt-4 mb-10 px-12 py-4 bg-emerald-800 hover:bg-emerald-700 text-slate-100 font-bold text-xl rounded-2xl transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
        >
          Menu Inicial
        </button>
      </div>
    </div>
  );
}
