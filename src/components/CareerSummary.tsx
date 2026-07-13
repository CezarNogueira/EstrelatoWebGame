import { Player } from "../types";
import { Trophy, Goal, Calendar, Medal } from "lucide-react";

export function CareerSummary({ player, onRestart }: { player: Player; onRestart: () => void }) {
  const totalMatches = player.history.reduce((sum, stat) => sum + stat.matches, 0);
  const totalGoals = player.history.reduce((sum, stat) => sum + stat.goals, 0);
  const totalAssists = player.history.reduce((sum, stat) => sum + stat.assists, 0);
  
  const teamTitles = player.history.reduce((acc, stat) => {
    stat.finals?.forEach(f => {
      if (f.won) {
        acc[f.type] = (acc[f.type] || 0) + 1;
      }
    });
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-8">
        <div className="p-4 bg-emerald-500/10 rounded-full mb-2 mt-8">
          <Medal className="w-20 h-20 text-emerald-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-white">Fim de Carreira</h1>
          <p className="text-slate-400 text-lg">
            Obrigado por tudo, <strong>{player.name}</strong>! O mundo do futebol sentirá sua falta.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
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
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-400" />
            <span className="text-3xl font-black">{totalTeamTitles + totalIndividualAwards}</span>
            <span className="text-slate-500 font-bold uppercase text-xs">Prêmios</span>
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
              <ul className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
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
              <ul className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
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
          className="w-full sm:w-auto mt-4 mb-10 px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xl rounded-2xl transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
        >
          Iniciar Nova Carreira
        </button>
      </div>
    </div>
  );
}
