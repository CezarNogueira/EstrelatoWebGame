import { Player, SeasonStat } from "../types";
import { calculateOverall, getPlayerTitle, formatCurrency } from "../utils";
import { ArrowRight, Calendar, Goal, User, Zap, FileSignature, ShoppingBag, Shield, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { StoreModal, STORE_ITEMS } from "./StoreModal";

function AttributeBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="w-20 font-medium text-slate-400">{label}</span>
      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono font-bold text-slate-200">{value}</span>
    </div>
  );
}

export function Dashboard({ 
  player, 
  onSimulate,
  onUpdatePlayer
}: { 
  player: Player; 
  onSimulate: () => void;
  onUpdatePlayer: (p: Player) => void;
}) {
  const [showEvent, setShowEvent] = useState(false);
  const [showContractInfo, setShowContractInfo] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const ovr = calculateOverall(player.attributes, player.position);
  const title = getPlayerTitle(player.age, ovr);
  const totalTackles = player.history.reduce((sum, stat) => sum + (stat.tackles || 0), 0);
  const totalCleanSheets = player.history.reduce((sum, stat) => sum + (stat.cleanSheets || 0), 0);
  const isDefensivePlayer = player.position === "ZAG" || player.position === "LAT" || player.position === "VOL";

  const handleSimulate = () => {
    onSimulate();
  };

  const handleBuyItem = (itemId: string, price: number) => {
    if (player.money < price) return;

    const item = STORE_ITEMS.find(i => i.id === itemId);

    // Trava de segurança: Preparador e Massagista só podem ser contratados
    // uma vez por temporada (o botão já fica desabilitado na loja, mas
    // reforçamos aqui para o caso de outro clique escapar).
    if (itemId === "Preparador" && player.hasPersonalTrainer) return;
    if (itemId === "Massagista" && player.hasMasseuse) return;
    if (itemId === "Festa Exclusiva" && player.usedExclusiveParty) return;
    if (itemId === "Viagem Internacional" && player.usedInternationalTrip) return;

    const updatedPlayer = { 
      ...player, 
      money: player.money - price,
      personal: { ...player.personal }
    };

    const socialGain = item?.socialGain ?? 1;
    updatedPlayer.personal.social = Math.min(100, updatedPlayer.personal.social + socialGain);
    updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 1);

    if (itemId === "Preparador") {
      updatedPlayer.hasPersonalTrainer = true;
    } else if (itemId === "Massagista") {
      updatedPlayer.hasMasseuse = true;
      // Cura 50% da Saúde que falta para o jogador chegar aos 100%.
      const missingHealth = 100 - updatedPlayer.personal.health;
      updatedPlayer.personal.health = Math.min(100, updatedPlayer.personal.health + missingHealth * 0.5);
    } else if (itemId === "Festa Exclusiva") {
      updatedPlayer.usedExclusiveParty = true;
    } else if (itemId === "Viagem Internacional") {
      updatedPlayer.usedInternationalTrip = true;
    } else if (!item?.consumable) {
      updatedPlayer.assets = [...player.assets, itemId];
    }
    onUpdatePlayer(updatedPlayer);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 sm:p-8 font-sans">
      {showContractInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6">
            <FileSignature className="w-12 h-12 text-blue-400 mx-auto" />
            <h3 className="text-2xl font-black text-slate-100">Seu Contrato</h3>
            
            {!player.isPro ? (
              <p className="text-slate-400">Você ainda está nas categorias de base e não possui um contrato profissional ativo.</p>
            ) : (
              <div className="space-y-4 text-left">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Salário Anual</span>
                  <span className="text-xl font-black text-emerald-400">{formatCurrency(player.salary || 0)}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Tempo Restante</span>
                  <span className="text-xl font-black text-blue-400">
                    {player.contractYears} {player.contractYears === 1 ? "Temporada" : "Temporadas"}
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Valor de Mercado</span>
                  <span className="text-xl font-black text-slate-300">{formatCurrency(player.marketValue || 0)}</span>
                </div>
                {player.bootSponsor && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/30">
                    <span className="text-blue-400 text-xs font-bold uppercase block mb-1">Patrocínio (Chuteira)</span>
                    <span className="text-xl font-black text-slate-100">{player.bootSponsor}</span>
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={() => setShowContractInfo(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {showStore && (
        <StoreModal
          player={player}
          onBuy={handleBuyItem}
          onClose={() => setShowStore(false)}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Profile */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-inner overflow-hidden">
                <User className="w-12 h-12 text-slate-600" />
              </div>
              <div 
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-slate-900 shadow-md"
                style={{ backgroundColor: player.currentTeam.color }}
                title={player.currentTeam.name}
              />
            </div>
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight">{player.name}</h1>
                <span className="px-3 py-1 bg-slate-800 text-emerald-400 text-xs font-bold uppercase rounded-full border border-emerald-500/30">
                  {title}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {player.age} anos</span>
                <span>•</span>
                <span>{player.currentTeam.name}</span>
                <span>•</span>
                <span className={player.isPro ? "text-emerald-400" : "text-blue-400"}>{player.isPro ? "Profissional" : "Base"}</span>
                {player.caps > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-yellow-500 font-bold">{player.caps} Convocações</span>
                  </>
                )}
              </div>

              {/* Personal Attributes */}
              {player.personal && (
                <div className="flex gap-4 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Humor</span>
                    <span className="text-sm font-bold text-blue-400">{player.personal.mood}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Saúde</span>
                    <span className={`text-sm font-bold ${
                      player.personal.health <= 25
                        ? "text-red-400"
                        : player.personal.health <= 50
                          ? "text-orange-400"
                          : "text-emerald-400"
                    }`}>
                      {player.personal.health}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Social</span>
                    <span className="text-sm font-bold text-purple-400">{player.personal.social}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-400 tracking-wider uppercase">Overall</span>
            <span className="text-6xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              {ovr}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Attributes Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  Atributos
                </h2>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg border border-emerald-500/30 text-sm">
                  {player.position} {ovr}
                </div>
              </div>
              <div className="space-y-4">
                <AttributeBar label="Ritmo" value={player.attributes.pace} />
                <AttributeBar label="Chute" value={player.attributes.shooting} />
                <AttributeBar label="Passe" value={player.attributes.passing} />
                <AttributeBar label="Drible" value={player.attributes.dribbling} />
                <AttributeBar label="Defesa" value={player.attributes.defending} />
                <AttributeBar label="Físico" value={player.attributes.physical} />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSimulate}
                disabled={player.retired}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-lg rounded-2xl transition-all active:scale-95 shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)] disabled:shadow-none"
              >
                {player.retired ? "Carreira Encerrada" : "Simular Temporada"}
              </button>

              <button
                onClick={() => setShowContractInfo(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <FileSignature className="w-4 h-4" />
                Contrato
              </button>

              <button
                onClick={() => setShowStore(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <ShoppingBag className="w-4 h-4" />
                Loja
              </button>
            </div>
          </div>

          {/* Career Logs Column */}
          <div className="md:col-span-2">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg h-[600px] flex flex-col">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Goal className="w-5 h-5 text-emerald-500" />
                Histórico da Carreira
              </h2>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                <AnimatePresence>
                  {player.history.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">
                      Nenhuma temporada jogada ainda.
                    </div>
                  ) : (
                    player.history.map((stat, idx) => (
                      <motion.div
                        key={player.age - idx} // Use age as stable key for history
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4"
                      >
                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-900 rounded-xl shrink-0 border border-slate-800">
                          <span className="text-xs text-slate-500 font-bold uppercase">Idade</span>
                          <span className="text-xl font-black text-slate-200">{stat.age}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white mb-1">
                            <span>{stat.team.name}</span>
                            <span className="px-2 py-0.5 bg-slate-800 rounded-md text-slate-400 text-xs font-mono">OVR {stat.rating}</span>
                            {stat.nationalTeamCall && (
                              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-md text-xs">Seleção</span>
                            )}
                          </div>
                          <div className="text-slate-400 text-sm flex flex-wrap gap-4">
                            <span>{stat.matches} Jogos</span>
                            <span>{stat.goals} Gols</span>
                            <span>{stat.assists} Assists</span>
                            <span className="text-blue-400">{stat.tackles ?? 0} Desarmes</span>
                            <span className="text-emerald-400">{stat.cleanSheets ?? 0} Sem Sofrer</span>
                          </div>
                          {stat.finals && stat.finals.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {stat.finals.map((final, fIdx) => (
                                <div key={fIdx} className={`px-2 py-1 text-xs font-bold rounded-md ${final.won ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                  {final.won ? '🏆 Campeão' : '🥈 Vice'} - {final.type.replace('Final ', '').replace('da ', '').replace('do ', '')}
                                </div>
                              ))}
                            </div>
                          )}
                          {stat.individualAwards && stat.individualAwards.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {stat.individualAwards.map((award, aIdx) => (
                                <div key={aIdx} className="px-2 py-1 text-xs font-bold rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                  ⭐ {award}
                                </div>
                              ))}
                            </div>
                          )}
                          {stat.injured && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className={`px-2 py-1 text-xs font-bold rounded-md border ${
                                stat.careerEndingInjury
                                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                                  : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              }`}>
                                🤕 {stat.careerEndingInjury
                                  ? "Lesão encerrou a carreira"
                                  : `Lesionado por ${stat.injuryDays} dias`}
                              </div>
                            </div>
                          )}
                          {stat.pressMessage && (
                            <div className="mt-3 p-3 bg-slate-900 border-l-4 border-emerald-500 rounded-r-lg">
                              <p className="text-sm text-slate-300 italic font-medium">
                                📰 {stat.pressMessage}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-emerald-500 font-bold text-sm">
                            +{Object.values(stat.attributeChanges).reduce((a, b) => (a || 0) + (b || 0), 0)} pts
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
