import { useState, useEffect, useRef } from "react";
import { Player } from "../types";
import { calculateOverall } from "../utils";
import { Trophy, Goal, Activity, FastForward, Play, AlertCircle } from "lucide-react";
import { INITIAL_TEAMS } from "../data";

type Action = "Chutar pro gol" | "Tocar a bola" | "Driblar" | "Correr pela Lateral";
type MatchStatus = "INTRO" | "SIMULATING" | "WAITING_ACTION" | "FINISHED";

interface MatchEvent {
  minute: number;
  text: string;
  type: "neutral" | "goal_us" | "goal_them" | "chance" | "miss";
}

export function InteractiveMatchModal({ 
  player, 
  finalType, 
  onComplete 
}: { 
  player: Player; 
  finalType: string; 
  onComplete: (won: boolean) => void;
}) {
  const [status, setStatus] = useState<MatchStatus>("INTRO");
  const [minute, setMinute] = useState(0);
  const [scoreUs, setScoreUs] = useState(0);
  const [scoreThem, setScoreThem] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [opponentName, setOpponentName] = useState("Adversário");
  
  // To track player chances
  const [chancesHad, setChancesHad] = useState(0);
  const [totalChances, setTotalChances] = useState(1 + Math.floor(Math.random() * 2));

  useEffect(() => {
    let ops = INITIAL_TEAMS.map(t => t.name);
    if (finalType.includes("Mundial")) {
      ops = ["Real Madrid", "Manchester City", "Bayern de Munique", "Liverpool", "Barcelona"];
    } else if (finalType.includes("Copa do Mundo") || finalType.includes("Copa Continental (Seleção)")) {
      ops = ["França", "Alemanha", "Argentina", "Espanha", "Inglaterra", "Itália", "Portugal", "Holanda", "Uruguai", "Brasil"];
      ops = ops.filter(c => c !== player.currentTeam.country); // simple avoidance, though country codes are BR, EN, etc.
    } else if (finalType.includes("Libertadores")) {
      const libertadoresTeams = ["Boca Juniors", "River Plate", "Peñarol", "Nacional", "Independiente"];
      const brTeams = INITIAL_TEAMS.filter(t => t.country === "BR" && t.level >= 2 && t.id !== player.currentTeam.id).map(t => t.name);
      ops = [...libertadoresTeams, ...brTeams];
    } else if (finalType.includes("Champions") || finalType.includes("Continental")) {
      ops = INITIAL_TEAMS.filter(t => t.country !== "BR" && t.level >= 3 && t.id !== player.currentTeam.id).map(t => t.name);
      if (ops.length === 0) ops = ["Bayern de Munique", "Real Madrid", "PSG"];
    } else {
      const domestic = INITIAL_TEAMS.filter(t => t.country === player.currentTeam.country && t.id !== player.currentTeam.id);
      if (domestic.length > 0) {
        ops = domestic.map(t => t.name);
      }
    }
    setOpponentName(ops[Math.floor(Math.random() * ops.length)] || "Adversário");

    setStatus("INTRO");
    setMinute(0);
    setScoreUs(0);
    setScoreThem(0);
    setEvents([]);
    setChancesHad(0);
    setTotalChances(1); // Max 1 chance for realism and tighter scores
  }, [finalType, player.currentTeam.country, player.currentTeam.id]);

  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events]);

  const addEvent = (text: string, type: MatchEvent["type"] = "neutral") => {
    setEvents(prev => [...prev, { minute, text, type }]);
  };

  useEffect(() => {
    let timer: number;
    if (status === "SIMULATING") {
      timer = window.setInterval(() => {
        setMinute(m => {
          const nextMin = m + 1;
          
          if (nextMin >= 90) {
            setStatus("FINISHED");
            addEvent("Fim de Jogo! O árbitro apita o final da partida.", "neutral");
            return 90;
          }

          // Random generic events
          if (Math.random() < 0.12) {
            const genericEvents = [
              `A equipe do ${opponentName} troca passes no meio de campo.`,
              "Falta dura no meio de campo. O juiz só adverte.",
              "Cobrança de escanteio perigosa, mas o goleiro afasta.",
              "A bola sai pela lateral.",
              "Posse de bola disputada, jogo muito truncado e pegado.",
              `O ${opponentName} tenta um lançamento, mas a zaga corta.`,
              "Impedimento marcado pelo bandeirinha.",
              "Jogo paralisado para atendimento médico."
            ];
            addEvent(genericEvents[Math.floor(Math.random() * genericEvents.length)]);
          }

          // Opponent scores (lowered probability for realistic score)
          if (Math.random() < 0.006) {
            setScoreThem(s => s + 1);
            addEvent(`GOL DO ${opponentName.toUpperCase()}! Eles abrem a defesa e marcam.`, "goal_them");
          }

          // Team scores without player (lowered probability)
          if (Math.random() < 0.004) {
            setScoreUs(s => s + 1);
            addEvent("GOL DO SEU TIME! Uma bela jogada coletiva termina na rede!", "goal_us");
          }

          // Player chance!
          if (chancesHad < totalChances && Math.random() < 0.03) {
            setStatus("WAITING_ACTION");
            addEvent(`${player.name} recebe a bola em ótima posição contra a zaga do ${opponentName}! O que ele vai fazer?`, "chance");
          }

          return nextMin;
        });
      }, 150); // Speed of the match (150ms per minute)
    }
    
    return () => clearInterval(timer);
  }, [status, chancesHad, totalChances, player.name, opponentName]);

  const handleAction = (action: Action) => {
    setChancesHad(c => c + 1);
    
    let chance = 50;
    const attrs = player.attributes;
    const ovr = calculateOverall(attrs, player.position);
    const difficultyMod = player.currentTeam.level * 5; 
    
    switch (action) {
      case "Chutar pro gol":
        chance = 30 + attrs.shooting * 0.6 + attrs.physical * 0.1 - difficultyMod;
        break;
      case "Tocar a bola":
        chance = 40 + attrs.passing * 0.6 + attrs.dribbling * 0.1 - difficultyMod;
        break;
      case "Driblar":
        chance = 35 + attrs.dribbling * 0.6 + attrs.pace * 0.1 - difficultyMod;
        break;
      case "Correr pela Lateral":
        chance = 40 + attrs.pace * 0.6 + attrs.physical * 0.1 - difficultyMod;
        break;
    }
    
    if (action === "Chutar pro gol" && (player.position === "ATA" || player.position === "PON")) chance += 10;
    if (action === "Tocar a bola" && (player.position === "MEI" || player.position === "MC")) chance += 10;
    if (action === "Driblar" && player.position === "PON") chance += 10;
    if (action === "Correr pela Lateral" && player.position === "LAT") chance += 10;

    chance = Math.max(10, Math.min(90, chance));
    const isSuccess = (Math.random() * 100) <= chance;
    
    if (isSuccess) {
      if (action === "Chutar pro gol") {
        setScoreUs(s => s + 1);
        addEvent("GOLAÇO DE " + player.name.toUpperCase() + "! Chute espetacular que morre no fundo das redes!", "goal_us");
      } else if (action === "Tocar a bola") {
        setScoreUs(s => s + 1);
        addEvent("ASSISTÊNCIA GENIAL DE " + player.name.toUpperCase() + "! Ele deixa o companheiro livre para marcar! GOL!", "goal_us");
      } else if (action === "Driblar") {
        setScoreUs(s => s + 1);
        addEvent("QUE DRIBLE! " + player.name + " passa por dois, invade a área e o time completa pro GOL!", "goal_us");
      } else if (action === "Correr pela Lateral") {
        setScoreUs(s => s + 1);
        addEvent("VELOCIDADE INCRÍVEL! " + player.name + " ganha na corrida, cruza na medida e é GOL!", "goal_us");
      }
    } else {
      if (action === "Chutar pro gol") addEvent(`Para fora! O chute foi muito torto e passou longe do gol do ${opponentName}.`, "miss");
      if (action === "Tocar a bola") addEvent(`Passe ruim... A defesa do ${opponentName} intercepta a jogada facilmente.`, "miss");
      if (action === "Driblar") addEvent(`Desarmado! Tentou fazer graça e perdeu a bola para o zagueiro do ${opponentName}.`, "miss");
      if (action === "Correr pela Lateral") addEvent("Ficou sem campo! A bola escapa pela linha de fundo em tiro de meta.", "miss");
    }

    setStatus("SIMULATING");
  };

  const getEventColor = (type: MatchEvent["type"]) => {
    switch(type) {
      case "goal_us": return "text-emerald-400 font-bold bg-emerald-950/30 p-2 rounded";
      case "goal_them": return "text-red-400 font-bold bg-red-950/30 p-2 rounded";
      case "chance": return "text-blue-400 font-bold border-l-4 border-blue-500 pl-2";
      case "miss": return "text-orange-400 italic";
      default: return "text-slate-400";
    }
  };

  const handleFinish = () => {
    if (scoreUs === scoreThem) {
      const won = Math.random() > 0.5;
      addEvent("Fim do tempo regulamentar! Vamos para a disputa de pênaltis!", "neutral");
      
      setTimeout(() => {
        if (won) {
          setScoreUs(s => s + 1);
          addEvent(`O goleiro defende a última cobrança do ${opponentName}! SEU TIME É CAMPEÃO NOS PÊNALTIS!`, "goal_us");
        } else {
          setScoreThem(s => s + 1);
          addEvent(`Cobrança na trave... O ${opponentName} vence nos pênaltis.`, "goal_them");
        }
      }, 1500);
      return;
    }
    
    let won = scoreUs > scoreThem;
    onComplete(won);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col h-[85vh] max-h-[800px] overflow-hidden">
        
        {/* Header / Scoreboard */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 text-center relative shrink-0">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${status === 'SIMULATING' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-slate-400 font-mono text-sm tracking-widest">LIVE</span>
          </div>
          <div className="text-emerald-500 mb-2 font-black uppercase tracking-widest text-sm flex justify-center items-center gap-2">
            <Trophy className="w-5 h-5" />
            Grande Final: {finalType}
          </div>
          <div className="flex justify-center items-center gap-8 mt-4">
            <div className="text-right flex-1 overflow-hidden">
              <h2 className="text-3xl font-black text-slate-100 truncate">{player.currentTeam.name}</h2>
              <span className="text-emerald-400 font-bold text-sm">Seu Time</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-slate-900 border-2 border-slate-700 px-6 py-3 rounded-2xl flex items-center gap-4 text-4xl font-black text-white min-w-[140px] justify-center">
                <span>{scoreUs}</span>
                <span className="text-slate-600">-</span>
                <span>{scoreThem}</span>
              </div>
              <div className="mt-2 font-mono text-xl text-blue-400 font-bold">
                {minute}'
              </div>
            </div>

            <div className="text-left flex-1 overflow-hidden">
              <h2 className="text-3xl font-black text-slate-100 truncate">{opponentName}</h2>
              <span className="text-red-400 font-bold text-sm">Adversário</span>
            </div>
          </div>
        </div>

        {/* Match Events Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-sm bg-[#0a0f1c]">
          {events.length === 0 && status === "INTRO" && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Trophy className="w-16 h-16 opacity-20" />
              <p>Aguardando o apito inicial para {player.currentTeam.name} x {opponentName}...</p>
            </div>
          )}
          {events.map((ev, i) => (
            <div key={i} className={`flex gap-4 ${getEventColor(ev.type)} transition-all animate-in slide-in-from-bottom-2`}>
              <span className="w-8 shrink-0 font-bold opacity-70">{ev.minute}'</span>
              <span>{ev.text}</span>
            </div>
          ))}
          <div ref={eventsEndRef} />
        </div>

        {/* Controls / Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 shrink-0">
          {status === "INTRO" && (
            <button 
              onClick={() => {
                setStatus("SIMULATING");
                addEvent("Apita o árbitro! Começa a grande final!", "neutral");
              }}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl transition-all text-xl flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" fill="currentColor" /> Iniciar Partida
            </button>
          )}

          {status === "WAITING_ACTION" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 text-blue-400 font-bold justify-center mb-2">
                <AlertCircle className="w-5 h-5 animate-bounce" />
                Sua chance de brilhar! Escolha uma jogada:
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleAction("Chutar pro gol")}
                  className="p-4 bg-red-900/50 hover:bg-red-800/80 border border-red-700 rounded-xl text-red-200 font-bold flex items-center gap-3 transition-all"
                >
                  <Goal className="w-6 h-6" /> Chutar
                </button>
                <button 
                  onClick={() => handleAction("Tocar a bola")}
                  className="p-4 bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 rounded-xl text-blue-200 font-bold flex items-center gap-3 transition-all"
                >
                  <Activity className="w-6 h-6" /> Tocar
                </button>
                <button 
                  onClick={() => handleAction("Driblar")}
                  className="p-4 bg-purple-900/50 hover:bg-purple-800/80 border border-purple-700 rounded-xl text-purple-200 font-bold flex items-center gap-3 transition-all"
                >
                  <FastForward className="w-6 h-6" /> Driblar
                </button>
                <button 
                  onClick={() => handleAction("Correr pela Lateral")}
                  className="p-4 bg-amber-900/50 hover:bg-amber-800/80 border border-amber-700 rounded-xl text-amber-200 font-bold flex items-center gap-3 transition-all"
                >
                  <Activity className="w-6 h-6" /> Correr Lateral
                </button>
              </div>
            </div>
          )}

          {status === "SIMULATING" && (
            <div className="flex justify-center items-center h-16 text-slate-500 font-bold tracking-widest uppercase">
              Simulando...
            </div>
          )}

          {status === "FINISHED" && (
            <button 
              onClick={handleFinish}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all text-xl"
            >
              {scoreUs === scoreThem ? "Ir para os Pênaltis" : "Continuar"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
