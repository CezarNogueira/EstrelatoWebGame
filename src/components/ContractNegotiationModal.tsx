import { useState } from "react";
import { Player, Team } from "../types";
import { FileSignature, AlertCircle } from "lucide-react";
import { formatCurrency } from "../utils";

export function ContractNegotiationModal({
  player,
  team,
  type,
  onComplete,
}: {
  player: Player;
  team: Team;
  type: "PRO" | "TRANSFER" | "RENEWAL";
  onComplete: (salary: number, years: number) => void;
}) {
  const fairSalary = player.marketValue * 0.12;
  const minSalary = Math.max(100, fairSalary * 0.5);
  const maxSalary = fairSalary * 1.5;

  const [salary, setSalary] = useState(fairSalary);
  const [years, setYears] = useState(3);
  const [rejected, setRejected] = useState(false);

  const handlePropose = () => {
    let chance = 100;
    if (salary > fairSalary) {
      const ratio = salary / fairSalary;
      chance = Math.max(0, 100 - (ratio - 1) * 200); // 1.5 ratio -> 0% chance
    }

    if (Math.random() * 100 <= chance) {
      onComplete(salary, years);
    } else {
      setRejected(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6">
        <div className="text-center">
          <FileSignature className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-slate-100">
            {type === "PRO" ? "Primeiro Contrato" : type === "TRANSFER" ? `Contrato com ${team.name}` : "Renovação de Contrato"}
          </h3>
          <p className="text-slate-400 mt-2">
            Valor de Mercado: <strong className="text-emerald-400">{formatCurrency(player.marketValue)}</strong>
          </p>
        </div>

        {rejected && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-2 text-sm text-left">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>A diretoria recusou sua proposta. Eles acharam o valor muito alto. Tente uma pedida mais próxima do valor justo.</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-bold mb-3">
              Duração do Contrato: <span className="text-blue-400">{years} {years === 1 ? "Temporada" : "Temporadas"}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={years} 
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-bold mb-3 flex justify-between">
              <span>Salário Anual</span>
              <span className="text-emerald-400">{formatCurrency(salary)}</span>
            </label>
            <input 
              type="range" 
              min={minSalary} 
              max={maxSalary} 
              step={fairSalary * 0.01}
              value={salary} 
              onChange={(e) => {
                setSalary(Number(e.target.value));
                setRejected(false);
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
              <span>Baixo</span>
              <span>Justo ({formatCurrency(fairSalary)})</span>
              <span>Alto</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handlePropose}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]"
        >
          Propor Contrato
        </button>
      </div>
    </div>
  );
}
