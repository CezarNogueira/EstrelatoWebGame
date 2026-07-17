import { GlassWater, X, Coins } from "lucide-react";
import { Player } from "../types";

export function NightclubModal({
  player,
  onClose,
  onParty
}: {
  player: Player;
  onClose: () => void;
  onParty: () => void;
}) {
  const cost = 15000;
  const canAfford = player.money >= cost;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-purple-500/30 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <GlassWater className="w-10 h-10" />
        </div>

        <h3 className="text-3xl font-black text-purple-400 mb-2">
          Balada VIP
        </h3>
        
        <p className="text-slate-300 mb-6">
          Uma noite na balada mais exclusiva da cidade. Alivia o estresse e melhora suas relações, mas cobra seu preço no corpo.
        </p>

        <div className="bg-slate-800 rounded-xl p-4 mb-6 text-sm text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Humor:</span>
            <span className="text-emerald-400 font-bold">+20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Social:</span>
            <span className="text-emerald-400 font-bold">+20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Saúde:</span>
            <span className="text-red-400 font-bold">-15</span>
          </div>
        </div>

        <button 
          onClick={onParty}
          disabled={!canAfford || player.personal.health <= 15}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Coins className="w-5 h-5" />
          Comprar Camarote (R$ {cost.toLocaleString('pt-BR')})
        </button>

        {!canAfford && (
          <p className="text-red-400 text-xs mt-2">Você não tem dinheiro suficiente.</p>
        )}
        {player.personal.health <= 15 && (
          <p className="text-red-400 text-xs mt-2">Sua saúde está muito baixa para sair hoje.</p>
        )}
      </div>
    </div>
  );
}
