import { RomanceEvent } from "../types";
import { FamilyEvent, Player, SeasonStat } from "../types";
import { calculateOverall, getPlayerTitle, formatCurrency, getLeagueName } from "../utils";
import { ArrowRight, Calendar, Goal, User, Users, Zap, FileSignature, ShoppingBag, Shield, ShieldCheck, MapPin, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { StoreModal, STORE_ITEMS } from "./StoreModal";
import { RelationshipsModal } from "./RelationshipsModal";
import { FamilyEventModal } from "./FamilyEventModal";
import { NewFriendModal } from "./NewFriendModal";
import { FAMILY_EVENTS } from "../data/familyEvents";
import { generateFriend } from "../data";
import { Friend } from "../types";
import { CityMapModal } from "./CityMapModal";
import { NightclubModal } from "./NightclubModal";
import { TrainingCenterModal } from "./TrainingCenterModal";
import { PhoneModal } from "./PhoneModal";
import { DiscussionEventModal } from "./DiscussionEventModal";

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
  onUpdatePlayer,
  onTriggerRomanceEvent
}: { 
  player: Player; 
  onSimulate: () => void;
  onUpdatePlayer: (p: Player) => void;
  onTriggerRomanceEvent?: (event: RomanceEvent) => void;
}) {
  const [showEvent, setShowEvent] = useState(false);
  const [showContractInfo, setShowContractInfo] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showCityMap, setShowCityMap] = useState(false);
  const [showNightclub, setShowNightclub] = useState(false);
  const [showTrainingCenter, setShowTrainingCenter] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showRelationships, setShowRelationships] = useState(false);
  const [pendingFriendEvent, setPendingFriendEvent] = useState<Friend | null>(null);
  const [pendingFamilyEvent, setPendingFamilyEvent] = useState<{event: FamilyEvent, personId: string, personName: string, type: "family" | "friend" | "girlfriend"} | null>(null);

  let pendingDiscussionEvent: { id: string; name: string; type: "family" | "friend" | "girlfriend" } | null = null;
  const zeroFamily = player.relationships.family.find(f => f.affinity <= 0);
  if (zeroFamily) pendingDiscussionEvent = { id: zeroFamily.id, name: zeroFamily.name, type: "family" };
  else {
    const zeroFriend = player.relationships.friends.find(f => f.affinity <= 0);
    if (zeroFriend) pendingDiscussionEvent = { id: zeroFriend.id, name: zeroFriend.name, type: "friend" };
    else if (player.relationships.girlfriend && player.relationships.girlfriend.affinity <= 0) {
      pendingDiscussionEvent = { id: player.relationships.girlfriend.id, name: player.relationships.girlfriend.name, type: "girlfriend" };
    }
  }

  const handleDiscussionChoice = (choiceId: string) => {
    if (!pendingDiscussionEvent) return;
    const updatedPlayer = { ...player, relationships: { ...player.relationships }, personal: { ...player.personal } };
    
    let isRemoved = false;
    let newAffinity = 0;
    
    if (choiceId === "pedir_desculpas") {
      newAffinity = 30; // restores relationship to weak level
      updatedPlayer.personal.mood = Math.max(0, updatedPlayer.personal.mood - 10);
    } else if (choiceId === "ignorar") {
      isRemoved = true;
      updatedPlayer.personal.mood = Math.max(0, updatedPlayer.personal.mood - 5);
    } else if (choiceId === "brigar") {
      isRemoved = true;
      updatedPlayer.personal.mood = Math.max(0, updatedPlayer.personal.mood - 20);
      updatedPlayer.personal.social = Math.max(0, updatedPlayer.personal.social - 10);
    }

    if (pendingDiscussionEvent.type === "family") {
      if (isRemoved) {
        updatedPlayer.relationships.family = updatedPlayer.relationships.family.filter(f => f.id !== pendingDiscussionEvent!.id);
      } else {
        const idx = updatedPlayer.relationships.family.findIndex(f => f.id === pendingDiscussionEvent!.id);
        if (idx !== -1) updatedPlayer.relationships.family[idx] = { ...updatedPlayer.relationships.family[idx], affinity: newAffinity };
      }
    } else if (pendingDiscussionEvent.type === "friend") {
      if (isRemoved) {
        updatedPlayer.relationships.friends = updatedPlayer.relationships.friends.filter(f => f.id !== pendingDiscussionEvent!.id);
      } else {
        const idx = updatedPlayer.relationships.friends.findIndex(f => f.id === pendingDiscussionEvent!.id);
        if (idx !== -1) updatedPlayer.relationships.friends[idx] = { ...updatedPlayer.relationships.friends[idx], affinity: newAffinity };
      }
    } else if (pendingDiscussionEvent.type === "girlfriend") {
      if (isRemoved) {
        updatedPlayer.relationships.girlfriend = null;
      } else if (updatedPlayer.relationships.girlfriend) {
        updatedPlayer.relationships.girlfriend = { ...updatedPlayer.relationships.girlfriend, affinity: newAffinity };
      }
    }
    
    onUpdatePlayer(updatedPlayer);
  };

  const ovr = calculateOverall(player.attributes, player.position);
  const title = getPlayerTitle(player.age, ovr);
  
  const minOvrForStarter: Record<number, number> = {
    1: 64,
    2: 71,
    3: 78,
    4: 83,
    5: 88
  };
  const requiredOvr = minOvrForStarter[player.currentTeam.level] || 64;
  const isBenched = player.isPro && ovr < requiredOvr;
  const situation = isBenched ? "Banco" : "Titular";

  const hasUnreadMessages = player.chats ? Object.values(player.chats).some(c => c.hasUnread) : false;

  const handleSimulate = () => {
    onSimulate();
  };

  const handleParty = () => {
    if (player.money >= 15000 && player.personal.health > 15) {
      let updatedPlayer = {
        ...player,
        money: player.money - 15000,
        personal: {
          ...player.personal,
          mood: Math.min(100, player.personal.mood + 20),
          social: Math.min(100, player.personal.social + 20),
          health: Math.max(0, player.personal.health - 15)
        }
      };

      if (updatedPlayer.relationships.girlfriend) {
        updatedPlayer.relationships = {
          ...updatedPlayer.relationships,
          girlfriend: {
            ...updatedPlayer.relationships.girlfriend,
            affinity: 0
          }
        };
        alert(`Sua namorada descobriu que você foi para a balada e discutiu feio com você! A afinidade dela caiu para 0%.`);
      }

      onUpdatePlayer(updatedPlayer);
      setShowNightclub(false);

      if (Math.random() < 0.99) {
          const names = ["Camila", "Sofia", "Isabella", "Giovanna", "Beatriz"];
          const name = names[Math.floor(Math.random() * names.length)];
          const event: RomanceEvent = {
             id: `balada_${Date.now()}`,
             personName: name,
             relationTag: "Conhecida da Balada",
             title: "Noitada Forte!",
             description: `Na área VIP da balada, ${name} se aproximou de você com muito interesse e deixou claro que quer ficar com você.`,
             attraction: 80,
             age: 20,
             choices: [
                { id: "beijar", label: "Beijar", tone: "positive" },
                { id: "fazer-amor", label: "Fazer amor", tone: "positive" },
                { id: "ignorar", label: "Ignorar", tone: "neutral" }
             ]
          };
          onTriggerRomanceEvent?.(event);
      } else {
        if (Math.random() > 0.5) {
          setPendingFriendEvent(generateFriend(player.nationality, player.age));
        }
      }
    }
  };

  const handleFriendChoice = (accept: boolean) => {
    if (!pendingFriendEvent) return;
    
    if (accept) {
      onUpdatePlayer({
        ...player,
        relationships: {
          ...player.relationships,
          friends: [...player.relationships.friends, pendingFriendEvent]
        },
        personal: {
          ...player.personal,
          social: Math.min(100, player.personal.social + 10),
          mood: Math.min(100, player.personal.mood + 5)
        }
      });
    }

    setPendingFriendEvent(null);
  };

  const handleLocalTrain = (attr: keyof typeof player.attributes) => {
    if (player.personal.health > 10 && player.personal.mood >= 1 && player.attributes[attr] < 99) {
      onUpdatePlayer({
        ...player,
        attributes: {
          ...player.attributes,
          [attr]: Math.min(99, player.attributes[attr] + 1)
        },
        personal: {
          ...player.personal,
          health: player.personal.health - 10,
          mood: player.personal.mood - 1
        }
      });
    }
  };

  const handleBuyItem = (itemId: string, price: number) => {
    if (player.money < price) return;

    const item = STORE_ITEMS.find(i => i.id === itemId);

    const socialGain = item?.socialGain ?? 1;

    const updatedPlayer = { 
      ...player, 
      money: player.money - price,
      assets: [...player.assets, itemId],
      personal: {
        ...player.personal,
        social: Math.min(100, player.personal.social + socialGain),
        mood: Math.min(100, player.personal.mood + 1)
      }
    };

    onUpdatePlayer(updatedPlayer);
  };

  const handleSpendTime = (id: string, type: "family" | "friend" | "girlfriend") => {
    const updatedPlayer = { ...player, relationships: { ...player.relationships }, personal: { ...player.personal } };
    
    let personName = "";
    let role = "";
    if (type === "family") {
      const idx = updatedPlayer.relationships.family.findIndex(f => f.id === id);
      if (idx !== -1) {
        updatedPlayer.relationships.family[idx] = { ...updatedPlayer.relationships.family[idx], affinity: Math.min(100, updatedPlayer.relationships.family[idx].affinity + 15) };
        personName = updatedPlayer.relationships.family[idx].name;
        role = updatedPlayer.relationships.family[idx].role;
      }
    } else if (type === "friend") {
      const idx = updatedPlayer.relationships.friends.findIndex(f => f.id === id);
      if (idx !== -1) {
        updatedPlayer.relationships.friends[idx] = { ...updatedPlayer.relationships.friends[idx], affinity: Math.min(100, updatedPlayer.relationships.friends[idx].affinity + 15) };
        personName = updatedPlayer.relationships.friends[idx].name;
        role = "Amigo";
      }
    } else if (type === "girlfriend" && updatedPlayer.relationships.girlfriend) {
      updatedPlayer.relationships.girlfriend = { ...updatedPlayer.relationships.girlfriend, affinity: Math.min(100, updatedPlayer.relationships.girlfriend.affinity + 15) };
      personName = updatedPlayer.relationships.girlfriend.name;
      role = "Namorada"; // No family events configured for girlfriend yet, but handled gracefully
    }

    // Cost a little bit of health
    updatedPlayer.personal.health = Math.max(0, updatedPlayer.personal.health - 2);
    updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 5);

    onUpdatePlayer(updatedPlayer);

    // Chance to trigger an event
    if (Math.random() < 0.3) {
      const possibleEvents = FAMILY_EVENTS.filter(e => e.role === role || (role.includes("Irmã") && e.role === "Irmã") || (role.includes("Irmão") && e.role === "Irmão"));
      if (possibleEvents.length > 0) {
        const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        setShowRelationships(false);
        setPendingFamilyEvent({ event, personId: id, personName, type });
      }
    }
  };

  const handleFamilyEventChoice = (choiceId: string, event: FamilyEvent) => {
    if (!pendingFamilyEvent) return;
    
    const choice = event.choices.find(c => c.id === choiceId);
    if (!choice) return;

    const updatedPlayer = { ...player, relationships: { ...player.relationships }, personal: { ...player.personal } };
    
    // Apply consequence based on tone
    let affinityChange = 0;
    switch(choice.tone) {
      case "positive":
        affinityChange = 15;
        updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 10);
        break;
      case "safe":
        affinityChange = 5;
        updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 5);
        break;
      case "neutral":
        affinityChange = 0;
        break;
      case "risky":
        affinityChange = -15;
        updatedPlayer.personal.mood = Math.max(0, updatedPlayer.personal.mood - 10);
        break;
    }

    if (pendingFamilyEvent.type === "family") {
      const idx = updatedPlayer.relationships.family.findIndex(f => f.id === pendingFamilyEvent.personId);
      if (idx !== -1) {
        updatedPlayer.relationships.family[idx] = { ...updatedPlayer.relationships.family[idx], affinity: Math.max(0, Math.min(100, updatedPlayer.relationships.family[idx].affinity + affinityChange)) };
      }
    } else {
      const idx = updatedPlayer.relationships.friends.findIndex(f => f.id === pendingFamilyEvent.personId);
      if (idx !== -1) {
        updatedPlayer.relationships.friends[idx] = { ...updatedPlayer.relationships.friends[idx], affinity: Math.max(0, Math.min(100, updatedPlayer.relationships.friends[idx].affinity + affinityChange)) };
      }
    }

    onUpdatePlayer(updatedPlayer);
    setPendingFamilyEvent(null);
    setShowRelationships(true); // show it back
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 sm:p-8 font-sans">
      {pendingDiscussionEvent && (
        <DiscussionEventModal
          personName={pendingDiscussionEvent.name}
          relationType={pendingDiscussionEvent.type}
          onChoice={handleDiscussionChoice}
        />
      )}
      {pendingFriendEvent && (
        <NewFriendModal 
          friend={pendingFriendEvent}
          onAccept={() => handleFriendChoice(true)}
          onDecline={() => handleFriendChoice(false)}
        />
      )}

      {pendingFamilyEvent && (
        <FamilyEventModal
          event={pendingFamilyEvent.event}
          personName={pendingFamilyEvent.personName}
          onChoice={handleFamilyEventChoice}
        />
      )}

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

      {showCityMap && (
        <CityMapModal
          onClose={() => setShowCityMap(false)}
          onOpenStore={() => { setShowCityMap(false); setShowStore(true); }}
          onOpenTraining={() => { setShowCityMap(false); setShowTrainingCenter(true); }}
          onOpenNightclub={() => { setShowCityMap(false); setShowNightclub(true); }}
        />
      )}

      {showTrainingCenter && (
        <TrainingCenterModal
          player={player}
          onClose={() => setShowTrainingCenter(false)}
          onTrain={handleLocalTrain}
        />
      )}

      {showNightclub && (
        <NightclubModal
          player={player}
          onClose={() => setShowNightclub(false)}
          onParty={handleParty}
        />
      )}

      {showPhone && (
        <PhoneModal
          player={player}
          onClose={() => setShowPhone(false)}
          onOpenContract={() => { setShowPhone(false); setShowContractInfo(true); }}
          onOpenMessages={() => { setShowPhone(false); setShowRelationships(true); }}
          onBuyService={(service, price) => {
            if (player.money >= price) {
              const updatedPlayer = { ...player, money: player.money - price };
              if (service === "Preparador") {
                updatedPlayer.hasPersonalTrainer = true;
              } else if (service === "Massagista") {
                updatedPlayer.hasMasseuse = true;
                const missingHealth = 100 - updatedPlayer.personal.health;
                updatedPlayer.personal.health = Math.round(Math.min(100, updatedPlayer.personal.health + missingHealth * 0.5));
              }
              onUpdatePlayer(updatedPlayer);
            }
          }}
        />
      )}

      {showStore && (
        <StoreModal
          player={player}
          onBuy={handleBuyItem}
          onClose={() => setShowStore(false)}
        />
      )}

      {showRelationships && (
        <RelationshipsModal
          player={player}
          onClose={() => setShowRelationships(false)}
          onUpdatePlayer={onUpdatePlayer}
          onTriggerRomanceEvent={(event) => {
            setShowRelationships(false);
            onTriggerRomanceEvent?.(event);
          }}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Profile */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-inner overflow-hidden">
                {player.avatarUrl ? (
                  <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-600" />
                )}
              </div>
              <div 
                className="absolute -bottom-2 -right-2 w-8 h-auto shadow-md overflow-hidden flex items-center justify-center"
                title={player.currentTeam.name}
              >
                {player.currentTeam.logo ? (
                  <img 
                    src={player.currentTeam.logo} 
                    alt="Logo do time"
                    className="w-16 h-auto rounded-none object-contain" 
                  />
                ) : (
                  <div 
                    className="w-16 h-auto rounded-full border-4 border-slate-950"
                    style={{ backgroundColor: player.currentTeam.color }}
                  />
                )}
              </div>
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
                <span className={player.isPro ? "text-emerald-400" : "text-blue-400"}>{player.isPro ? getLeagueName(player.currentTeam) : "Base"}</span>
                <span>•</span>
                <span className="text-yellow-500 font-bold">{situation}</span>
              </div>

              {/* Personal Attributes */}
              {player.personal && (
                <div className="flex gap-4 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Humor</span>
                    <span className="text-sm font-bold text-blue-400">{Math.round(player.personal.mood)}%</span>
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
                      {Math.round(player.personal.health)}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Social</span>
                    <span className="text-sm font-bold text-purple-400">{Math.round(player.personal.social)}%</span>
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
                onClick={() => setShowPhone(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700 relative"
              >
                <div className="relative">
                  <Smartphone className="w-4 h-4" />
                  {hasUnreadMessages && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-800"></div>
                  )}
                </div>
                Celular
              </button>

              {player.mode !== "QUICK" && (
                <button
                  onClick={() => setShowCityMap(true)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <MapPin className="w-4 h-4" />
                  Mapa da Cidade
                </button>
              )}

              {!player.retired && (
                <button
                  onClick={() => {
                    if (window.confirm("Tem certeza que deseja se aposentar agora? Esta ação é irreversível.")) {
                      onUpdatePlayer({ ...player, retired: true });
                    }
                  }}
                  className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-red-900/50"
                >
                  <Calendar className="w-4 h-4" />
                  Aposentar-se
                </button>
              )}
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
                          <div className="flex flex-wrap gap-2 mt-2">
                            {stat.leagueName && (
                              <div className={`px-2 py-1 text-xs font-bold rounded-md border ${stat.leaguePosition === 1 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                {stat.leaguePosition === 1 ? '🏆 Campeão' : `${stat.leaguePosition}º Lugar`} - {stat.leagueName}
                              </div>
                            )}
                            {stat.finals && stat.finals.length > 0 && stat.finals.map((final, fIdx) => (
                              <div key={fIdx} className={`px-2 py-1 text-xs font-bold rounded-md ${final.won ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {final.won ? '🏆 Campeão' : '🥈 Vice'} - {final.type.replace('Final ', '').replace('da ', '').replace('do ', '')}
                              </div>
                            ))}
                          </div>
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
                                stat.seasonEndingInjury
                                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                                  : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              }`}>
                                🤕 {stat.seasonEndingInjury
                                  ? "Lesão tirou da temporada"
                                  : `Lesionado por ${stat.injuryDays} dias`}
                              </div>
                            </div>
                          )}
                          {stat.isBenched && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className="px-2 py-1 text-xs font-bold rounded-md border bg-slate-500/10 text-slate-400 border-slate-500/20">
                                🪑 Banco de Reservas
                              </div>
                            </div>
                          )}
                          {stat.pressMessage && (
                            <div className="mt-3 p-3 bg-slate-900 border-l-4 border-emerald-500 rounded-r-lg">
                              <p className="text-sm text-slate-300 italic font-medium whitespace-pre-line">
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
