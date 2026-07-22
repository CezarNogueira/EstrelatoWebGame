import { Player } from "../types";
import { formatCurrency } from "../utils";
import { 
  Home, Castle, Brush, Shirt, Watch, Gem, Footprints,
  Smartphone, Headphones, Glasses, Sparkles, ShoppingBag, Laptop, Tv, Bike, Camera, Wine, X
} from "lucide-react";

export const STORE_ITEMS = [
  // Ativos permanentes (comprados uma única vez) - ordenados do mais barato para o mais caro
  { id: "Smartphone", name: "Smartphone Topo de Linha", price: 8000, icon: Smartphone, socialGain: 2 },
  { id: "Ternos", name: "Ternos de Grife", price: 10000, icon: Shirt, socialGain: 4 },
  { id: "Fone Premium", name: "Fone de Ouvido Premium", price: 15000, icon: Headphones, socialGain: 3 },
  { id: "Óculos de Grife", name: "Óculos de Grife", price: 20000, icon: Glasses, socialGain: 3 },
  { id: "Perfume Importado", name: "Perfume Importado", price: 25000, icon: Sparkles, socialGain: 3 },
  { id: "Relógios", name: "Relógios de Luxo", price: 50000, icon: Watch, socialGain: 6 },
  { id: "Bolsa de Grife", name: "Bolsa de Grife", price: 60000, icon: ShoppingBag, socialGain: 6 },
  { id: "Notebook Gamer", name: "Notebook Gamer", price: 70000, icon: Laptop, socialGain: 5 },
  { id: "Coleção de Tênis", name: "Coleção de Tênis Raros", price: 80000, icon: Footprints, socialGain: 5 },
  { id: "TV Última Geração", name: "TV de Última Geração", price: 90000, icon: Tv, socialGain: 5 },
  { id: "Bicicleta Elétrica", name: "Bicicleta Elétrica", price: 120000, icon: Bike, socialGain: 6 },
  { id: "Câmera Profissional", name: "Câmera Profissional", price: 150000, icon: Camera, socialGain: 6 },
  { id: "Joias Exclusivas", name: "Joias Exclusivas", price: 300000, icon: Gem, socialGain: 9 },
  { id: "Adega Climatizada", name: "Adega Climatizada", price: 400000, icon: Wine, socialGain: 8 },
  { id: "Casa", name: "Casa", price: 500000, icon: Home, description: "Custo: 40k/ano", socialGain: 5 },
  { id: "Obras de Arte", name: "Obras de Arte", price: 1000000, icon: Brush, socialGain: 11 },
  { id: "Mansão", name: "Mansão", price: 5000000, icon: Castle, description: "Custo: 100k/ano", socialGain: 20 },
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
            let owned = player.assets.includes(item.id);

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
