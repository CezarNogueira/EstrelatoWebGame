import { MapPin, Dumbbell, ShoppingBag, GlassWater, X } from "lucide-react";

export function CityMapModal({
  onClose,
  onOpenStore,
  onOpenTraining,
  onOpenNightclub
}: {
  onClose: () => void;
  onOpenStore: () => void;
  onOpenTraining: () => void;
  onOpenNightclub: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-3xl w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <MapPin className="w-8 h-8 text-emerald-500" />
          Mapa da Cidade
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={onOpenTraining} 
            className="group p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-200">CT</h3>
              <p className="text-xs text-slate-400 mt-1">Treinamento intensivo</p>
            </div>
          </button>
          
          <button 
            onClick={onOpenStore} 
            className="group p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-200">Shopping</h3>
              <p className="text-xs text-slate-400 mt-1">Lojas e bens de luxo</p>
            </div>
          </button>

          <button 
            onClick={onOpenNightclub} 
            className="group p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
              <GlassWater className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-200">Balada</h3>
              <p className="text-xs text-slate-400 mt-1">Vida noturna e fama</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
