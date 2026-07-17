import { Smartphone, X, FileSignature, Dumbbell, UserPlus, MessageCircle, Briefcase, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Player } from "../types";
import { formatCurrency } from "../utils";

export function PhoneModal({
  player,
  onClose,
  onOpenContract,
  onOpenMessages,
  onBuyService
}: {
  player: Player;
  onClose: () => void;
  onOpenContract: () => void;
  onOpenMessages: () => void;
  onBuyService: (service: "Preparador" | "Massagista", price: number) => void;
}) {
  const [view, setView] = useState<"home" | "services">("home");

  const PREPARADOR_PRICE = 150000;
  const MASSAGISTA_PRICE = 50000;

  const hasUnread = player.chats ? Object.values(player.chats).some(c => c.hasUnread) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl max-w-sm w-full relative h-[600px] flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl"></div>

        <div className="flex items-center justify-between mt-4 mb-8">
          {view === "services" ? (
            <button onClick={() => setView("home")} className="text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-emerald-500" />
              Celular
            </h2>
          )}
          
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors ml-auto">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
          
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 mb-6">
            <p className="text-sm text-slate-400 mb-1">Saldo Bancário</p>
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(player.money)}</p>
          </div>

          {view === "home" && (
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={onOpenContract}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center transition-all hover:scale-105">
                  <FileSignature className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-slate-300">Contratos</span>
              </button>

              <button 
                onClick={() => setView("services")}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center transition-all hover:scale-105">
                  <Briefcase className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-slate-300">Serviços</span>
              </button>

              <button 
                onClick={onOpenMessages}
                className="flex flex-col items-center gap-2 relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all hover:scale-105">
                  <MessageCircle className="w-8 h-8" />
                  {hasUnread && (
                    <div className="absolute top-0 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900"></div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-300">Mensagens</span>
              </button>
            </div>
          )}

          {view === "services" && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-xl mb-4">Meus Serviços</h3>
              
              <div className={`p-4 border ${player.hasPersonalTrainer ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-700 bg-slate-800'} rounded-2xl flex flex-col gap-3`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${player.hasPersonalTrainer ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'} flex items-center justify-center shrink-0`}>
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-slate-200">Preparador Físico</h4>
                    {player.hasPersonalTrainer ? (
                      <p className="text-xs text-emerald-400 font-medium">Contratado</p>
                    ) : (
                      <p className="text-xs text-slate-400">{formatCurrency(PREPARADOR_PRICE)}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg">
                  Potencializa seus ganhos físicos. <strong className="text-emerald-400">+50% ganho de Físico</strong> nos treinos. Dura 1 temporada.
                </p>
                {!player.hasPersonalTrainer && (
                  <button 
                    onClick={() => onBuyService("Preparador", PREPARADOR_PRICE)}
                    disabled={player.money < PREPARADOR_PRICE}
                    className="w-full py-2 mt-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 disabled:text-slate-500 font-bold text-sm rounded-xl transition-all"
                  >
                    Contratar
                  </button>
                )}
              </div>

              <div className={`p-4 border ${player.hasMasseuse ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-700 bg-slate-800'} rounded-2xl flex flex-col gap-3`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${player.hasMasseuse ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'} flex items-center justify-center shrink-0`}>
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-slate-200">Massagista</h4>
                    {player.hasMasseuse ? (
                      <p className="text-xs text-emerald-400 font-medium">Contratado</p>
                    ) : (
                      <p className="text-xs text-slate-400">{formatCurrency(MASSAGISTA_PRICE)} / temp</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg">
                  Tratamento de recuperação profunda. <strong className="text-emerald-400">Recupera 50% da sua Saúde</strong> instantaneamente.
                </p>
                {!player.hasMasseuse && (
                  <button 
                    onClick={() => onBuyService("Massagista", MASSAGISTA_PRICE)}
                    disabled={player.money < MASSAGISTA_PRICE}
                    className="w-full py-2 mt-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 disabled:text-slate-500 font-bold text-sm rounded-xl transition-all"
                  >
                    Contratar
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
