import { Player } from "../types";
import { formatCurrency } from "../utils";
import { Home, Castle, Car, Ship, Shirt, Watch, Dumbbell, X, Plane, Palmtree, Ghost, Brush, UserPlus } from "lucide-react";

export const STORE_ITEMS = [
  { id: "Casa", name: "Casa", price: 500000, icon: Home, description: "Custo: 40k/ano" },
  { id: "Mansão", name: "Mansão", price: 5000000, icon: Castle, description: "Custo: 100k/ano" },
  { id: "Carro de Luxo", name: "Carro de Luxo", price: 200000, icon: Car, description: "Custo: 50k/ano" },
  { id: "Jetski", name: "Jetski", price: 30000, icon: Ship, description: "Custo: 5k/ano" },
  { id: "Iate", name: "Iate", price: 2000000, icon: Ship, description: "Custo: 600k/ano" },
  { id: "Helicóptero", name: "Helicóptero", price: 800000, icon: Plane, description: "Custo: 80k/ano" },
  { id: "Avião Particular", name: "Avião Particular", price: 15000000, icon: Plane, description: "Custo: 1M/ano" },
  { id: "Ilha Privativa", name: "Ilha Privativa", price: 50000000, icon: Palmtree, description: "Custo: 20M/ano" },
  { id: "Cavalo de Raça", name: "Cavalo de Raça", price: 500000, icon: Ghost, description: "Custo: 50k/ano" },
  { id: "Obras de Arte", name: "Obras de Arte", price: 1000000, icon: Brush },
  { id: "Ternos", name: "Ternos de Grife", price: 10000, icon: Shirt },
  { id: "Relógios", name: "Relógios de Luxo", price: 50000, icon: Watch },
  { id: "Preparador", name: "Preparador Físico", price: 150000, icon: Dumbbell, description: "+50% de ganho de Físico (dura 1 temporada)" },
  { id: "Massagista", name: "Massagista Particular", price: 50000, icon: UserPlus, description: "+10 de Saúde imediatamente" },
];

export function StoreModal({ 
  player, 
  onBuy, 
  onClose 
}: { 
  player: Player; 
  onBuy: (itemId: string, price: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-100"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h3 className="text-3xl font-black text-slate-100">Loja</h3>
          <p className="text-slate-400 mt-2">
            Seu saldo: <strong className="text-emerald-400 text-xl">{formatCurrency(player.money)}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STORE_ITEMS.map((item) => {
            const Icon = item.icon;
            let owned = false;
            if (item.id === "Preparador") {
              owned = player.hasPersonalTrainer;
            } else if (item.id === "Massagista") {
              owned = false; // Consumable
            } else {
              owned = player.assets.includes(item.id);
            }

            const canAfford = player.money >= item.price;

            return (
              <div 
                key={item.id} 
                className={`p-4 rounded-2xl border ${owned ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-800 bg-slate-950'} flex flex-col justify-between`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${owned ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-300'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-200">{item.name}</h4>
                    <p className="text-emerald-400 font-medium">{formatCurrency(item.price)}</p>
                    {item.description && (
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onBuy(item.id, item.price)}
                  disabled={owned || !canAfford}
                  className={`w-full py-2.5 rounded-xl font-bold transition-all text-sm
                    ${owned 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : canAfford 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  {owned ? 'Comprado' : canAfford ? 'Comprar' : 'Saldo Insuficiente'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
