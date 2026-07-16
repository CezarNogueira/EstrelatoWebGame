import { Player } from "../types";
import { formatCurrency } from "../utils";
import {
  Home, Castle, Car, Ship, Shirt, Watch, Dumbbell, X, Plane, Palmtree, Ghost, Brush, UserPlus,
  Building2, Gem, Footprints, Wine, Mic2, TreePine, Store as StoreIcon, PartyPopper, Globe,
} from "lucide-react";

export const STORE_ITEMS = [
  // Ativos permanentes (comprados uma única vez)
  { id: "Casa", name: "Casa", price: 500000, icon: Home, description: "Custo: 40k/ano", socialGain: 5 },
  { id: "Mansão", name: "Mansão", price: 5000000, icon: Castle, description: "Custo: 100k/ano", socialGain: 20 },
  { id: "Carro de Luxo", name: "Carro de Luxo", price: 200000, icon: Car, description: "Custo: 50k/ano", socialGain: 8 },
  { id: "Jetski", name: "Jetski", price: 30000, icon: Ship, description: "Custo: 5k/ano", socialGain: 3 },
  { id: "Iate", name: "Iate", price: 2000000, icon: Ship, description: "Custo: 600k/ano", socialGain: 18 },
  { id: "Helicóptero", name: "Helicóptero", price: 800000, icon: Plane, description: "Custo: 80k/ano", socialGain: 13 },
  { id: "Avião Particular", name: "Avião Particular", price: 15000000, icon: Plane, description: "Custo: 1M/ano", socialGain: 25 },
  { id: "Ilha Privativa", name: "Ilha Privativa", price: 50000000, icon: Palmtree, description: "Custo: 2M/ano", socialGain: 25 },
  { id: "Cavalo de Raça", name: "Cavalo de Raça", price: 500000, icon: Ghost, description: "Custo: 50k/ano", socialGain: 10 },
  { id: "Obras de Arte", name: "Obras de Arte", price: 1000000, icon: Brush, socialGain: 11 },
  { id: "Ternos", name: "Ternos de Grife", price: 10000, icon: Shirt, socialGain: 4 },
  { id: "Relógios", name: "Relógios de Luxo", price: 50000, icon: Watch, socialGain: 6 },
  { id: "Cobertura de Luxo", name: "Cobertura de Luxo", price: 3000000, icon: Building2, description: "Custo: 90k/ano", socialGain: 16 },
  { id: "Coleção de Carros Antigos", name: "Coleção de Carros Antigos", price: 4000000, icon: Car, description: "Custo: 120k/ano", socialGain: 19 },
  { id: "Joias Exclusivas", name: "Joias Exclusivas", price: 300000, icon: Gem, socialGain: 9 },
  { id: "Coleção de Tênis", name: "Coleção de Tênis Raros", price: 80000, icon: Footprints, socialGain: 5 },
  { id: "Adega de Vinhos", name: "Adega de Vinhos Raros", price: 250000, icon: Wine, description: "Custo: 20k/ano", socialGain: 7 },
  { id: "Estúdio de Gravação", name: "Estúdio de Gravação", price: 600000, icon: Mic2, description: "Custo: 30k/ano", socialGain: 12 },
  { id: "Fazenda", name: "Fazenda de Luxo", price: 1500000, icon: TreePine, description: "Custo: 70k/ano", socialGain: 12 },
  { id: "Marca Própria", name: "Marca de Roupas Própria", price: 2000000, icon: StoreIcon, description: "Custo: 100k/ano", socialGain: 20 },

  // Consumíveis: efeito imediato, podem ser comprados quantas vezes o jogador quiser
  { id: "Festa Exclusiva", name: "Festa Exclusiva", price: 40000, icon: PartyPopper, description: "Consumível: eleva seu status social na hora (1x por temporada)", socialGain: 14, consumable: true },
  { id: "Viagem Internacional", name: "Viagem Internacional", price: 25000, icon: Globe, description: "Consumível: eleva seu status social na hora (1x por temporada)", socialGain: 7, consumable: true },

  // Consumíveis limitados a 1 vez por temporada
  { id: "Preparador", name: "Preparador Físico", price: 150000, icon: Dumbbell, description: "+50% de ganho de Físico (dura 1 temporada)", socialGain: 2 },
  { id: "Massagista", name: "Massagista Particular", price: 50000, icon: UserPlus, description: "Cura 50% da Saúde na hora (1x por temporada)", socialGain: 1 },
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
              owned = !!player.hasMasseuse;
            } else if (item.id === "Festa Exclusiva") {
              owned = !!player.usedExclusiveParty;
            } else if (item.id === "Viagem Internacional") {
              owned = !!player.usedInternationalTrip;
            } else if (item.consumable) {
              owned = false; // Consumível: pode ser comprado repetidas vezes
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
                    {item.socialGain && (
                      <p className="text-xs text-pink-400 font-bold mt-1">+{item.socialGain}% Social</p>
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
