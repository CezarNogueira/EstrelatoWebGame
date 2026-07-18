import { useState, useEffect, useRef } from "react";
import { Player, Position } from "../types";
import { calculateOverall } from "../utils";
import { Trophy, Goal, Activity, FastForward, Play, AlertCircle, Shield, UserCheck, Rocket, MoveRight, Target, Crosshair } from "lucide-react";
import { TEAMS, EUROPEAN_NATIONALITIES, AMERICAN_NATIONALITIES } from "../data";

// -----------------------------------------------------------------------------
// Cenários de jogada
// -----------------------------------------------------------------------------
// Para ATA, PON e MEI: o jogador vive momentos mais ofensivos (recebe a bola
// na frente do gol, na lateral, na entrada da área, ou toma a bola no meio).
// Para MC, VOL, ZAG e LAT: os momentos são mais ligados à marcação/transição
// (tomar a bola no meio de campo ou desarmar uma infiltração adversária).
type Scenario =
  | "FRENTE_GOL"   // Receber a bola na frente do gol -> Chutar ou Passe
  | "LATERAL"      // Receber a bola na lateral -> Cruzar ou Passe
  | "MEIO_CAMPO"   // Tomou a bola no meio de campo -> Correr pra área ou Passe
  | "ENTRADA_AREA" // Bola sobrou na entrada da área -> Chutar, Driblar ou Passe
  | "INFILTRACAO"  // Atacante tentando infiltrar -> Desarmar ou Marcar outro atacante
  | "PENALTI"      // Cobrador oficial do time bate um pênalti
  | "FALTA";       // Cobrador oficial do time bate uma falta perigosa

type MatchStatus = "INTRO" | "SIMULATING" | "WAITING_ACTION" | "ROLLING_DICE" | "FINISHED";

const ATTACKING_POSITIONS: Position[] = ["ATA", "PON", "MEI"];
// MC, VOL, ZAG, LAT caem no grupo defensivo/transição.

const ATTACKING_SCENARIOS: Scenario[] = ["FRENTE_GOL", "LATERAL", "MEIO_CAMPO", "ENTRADA_AREA"];
const DEFENSIVE_SCENARIOS: Scenario[] = ["MEIO_CAMPO", "INFILTRACAO"];
const SET_PIECE_SCENARIOS: Scenario[] = ["PENALTI", "FALTA"];

// OVR mínimo (por nível do time) para o jogador ser o cobrador oficial de
// faltas e pênaltis da equipe. Times mais fracos (nível 1) têm um padrão de
// qualidade menor, então basta um OVR mais baixo para ser o cobrador; nos
// times de elite (nível 5) só um jogador de altíssimo nível assume a cobrança.
const SET_PIECE_OVR_THRESHOLD: Record<number, number> = {
  1: 69,
  2: 74,
  3: 79,
  4: 84,
  5: 90,
};

// Ações defensivas (INFILTRACAO) não geram gol do próprio jogador quando dão
// certo — elas evitam o gol do adversário. Quando falham, é o adversário que
// marca. Todos os outros cenários são "ofensivos": sucesso = gol da sua
// equipe, falha = perde a jogada.
const DEFENSIVE_SCENARIO_SET = new Set<Scenario>(["INFILTRACAO"]);

interface ActionDef {
  id: string;
  label: string;
  icon: typeof Goal;
  classes: string;
  // Para cenários ofensivos, indica se um sucesso nessa ação conta como gol
  // do próprio jogador ou como assistência (jogada finalizada por um
  // companheiro). Cenários defensivos (INFILTRACAO) não usam este campo,
  // já que um sucesso ali apenas evita o gol adversário.
  resultType?: "goal" | "assist";
}

interface ScenarioConfig {
  chanceText: (playerName: string, opponentName: string) => string;
  actions: ActionDef[];
  computeChance: (actionId: string, player: Player, difficultyMod: number) => number;
  successText: (actionId: string, playerName: string, opponentName: string) => string;
  failText: (actionId: string, playerName: string, opponentName: string) => string;
}

const SCENARIOS: Record<Scenario, ScenarioConfig> = {
  FRENTE_GOL: {
    chanceText: (name) => `${name} recebe a bola na frente do gol! O que ele vai fazer?`,
    actions: [
      { id: "chutar", label: "Chutar", icon: Goal, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
      { id: "passe", label: "Passe", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs, position } = player;
      let chance = 50;
      if (actionId === "chutar") {
        chance = 35 + attrs.shooting * 0.6 + attrs.physical * 0.1 - difficultyMod;
        if (position === "ATA" || position === "PON") chance += 10;
      } else {
        chance = 30 + attrs.passing * 0.6 + attrs.dribbling * 0.1 - difficultyMod;
        if (position === "MEI") chance += 10;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "chutar"
        ? `GOLAÇO DE ${name.toUpperCase()}! Chute certeiro que morre no fundo das redes!`
        : `PASSE DE MESTRE DE ${name.toUpperCase()}! Encontra o companheiro livre e é GOL!`,
    failText: (actionId, name, opponentName) =>
      actionId === "chutar"
        ? `Para fora! ${name} chuta torto e a bola passa longe da meta do ${opponentName}.`
        : `Passe errado de ${name}! A zaga do ${opponentName} intercepta com tranquilidade.`,
  },

  LATERAL: {
    chanceText: (name) => `${name} recebe a bola na lateral do campo! O que ele vai fazer?`,
    actions: [
      { id: "cruzar", label: "Cruzar", icon: Activity, classes: "bg-amber-900/50 hover:bg-amber-800/80 border border-amber-700 text-amber-200", resultType: "assist" },
      { id: "passe", label: "Passe", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs, position } = player;
      let chance = 50;
      if (actionId === "cruzar") {
        chance = 35 + attrs.passing * 0.4 + attrs.pace * 0.3 - difficultyMod;
        if (position === "PON") chance += 10;
      } else {
        chance = 40 + attrs.passing * 0.6 + attrs.dribbling * 0.1 - difficultyMod;
        if (position === "MEI") chance += 10;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "cruzar"
        ? `CRUZAMENTO PERFEITO DE ${name.toUpperCase()}! O companheiro cabeceia e é GOL!`
        : `Bom passe de ${name}! A jogada termina em GOL!`,
    failText: (actionId, name, opponentName) =>
      actionId === "cruzar"
        ? `Cruzamento errado de ${name}, a bola sai sem perigo pela linha de fundo.`
        : `Passe cortado! A defesa do ${opponentName} afasta o perigo.`,
  },

  MEIO_CAMPO: {
    chanceText: (name) => `${name} toma a bola no meio de campo! O que ele vai fazer?`,
    actions: [
      { id: "correr", label: "Correr pra Área", icon: Rocket, classes: "bg-purple-900/50 hover:bg-purple-800/80 border border-purple-700 text-purple-200", resultType: "goal" },
      { id: "passe", label: "Passe", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs, position } = player;
      let chance = 50;
      if (actionId === "correr") {
        chance = 35 + attrs.pace * 0.5 + attrs.dribbling * 0.2 - difficultyMod;
        if (position === "ATA" || position === "PON") chance += 10;
        if (position === "VOL" || position === "LAT") chance += 5;
      } else {
        chance = 40 + attrs.passing * 0.6 + attrs.dribbling * 0.1 - difficultyMod;
        if (position === "MC" || position === "MEI") chance += 10;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "correr"
        ? `${name.toUpperCase()} ARRANCA EM VELOCIDADE, entra na área e é GOL!`
        : `LANÇAMENTO PERFEITO DE ${name.toUpperCase()}! O companheiro só empurra pra rede. GOL!`,
    failText: (actionId, name, opponentName) =>
      actionId === "correr"
        ? `${name} tenta avançar mas é travado antes de chegar na área.`
        : `Passe mal calculado de ${name}, a bola sobra fácil para o ${opponentName}.`,
  },

  ENTRADA_AREA: {
    chanceText: (name) => `A bola sobra para ${name} na entrada da área! O que ele vai fazer?`,
    actions: [
      { id: "chutar", label: "Chutar", icon: Goal, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
      { id: "driblar", label: "Driblar", icon: FastForward, classes: "bg-purple-900/50 hover:bg-purple-800/80 border border-purple-700 text-purple-200", resultType: "goal" },
      { id: "passe", label: "Passe", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs, position } = player;
      let chance = 50;
      if (actionId === "chutar") {
        chance = 30 + attrs.shooting * 0.6 + attrs.physical * 0.1 - difficultyMod;
        if (position === "ATA") chance += 10;
      } else if (actionId === "driblar") {
        chance = 30 + attrs.dribbling * 0.6 + attrs.pace * 0.1 - difficultyMod;
        if (position === "PON") chance += 10;
      } else {
        chance = 35 + attrs.passing * 0.6 + attrs.dribbling * 0.1 - difficultyMod;
        if (position === "MEI") chance += 10;
      }
      return chance;
    },
    successText: (actionId, name) => {
      if (actionId === "chutar") return `QUE PANCADA DE ${name.toUpperCase()}! Bate de primeira e é GOL!`;
      if (actionId === "driblar") return `${name.toUpperCase()} DRIBLA MAIS UM e finaliza! GOL!`;
      return `${name.toUpperCase()} VÊ O COMPANHEIRO LIVRE e serve na medida. GOL!`;
    },
    failText: (actionId, name, opponentName) => {
      if (actionId === "chutar") return `Chute travado de ${name}, a bola desvia para escanteio.`;
      if (actionId === "driblar") return `${name} tenta o drible mas é desarmado na entrada da área.`;
      return `Passe muito forte de ${name}, ninguém alcança e a bola sai pela linha de fundo.`;
    },
  },

  INFILTRACAO: {
    chanceText: (_name, opponentName) => `O atacante do ${opponentName} tenta infiltrar a linha defensiva! O que fazer?`,
    actions: [
      { id: "desarmar", label: "Desarmar", icon: Shield, classes: "bg-emerald-900/50 hover:bg-emerald-800/80 border border-emerald-700 text-emerald-200" },
      { id: "marcar", label: "Marcar Outro Atacante", icon: UserCheck, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs, position } = player;
      let chance = 50;
      if (actionId === "desarmar") {
        chance = 35 + attrs.defending * 0.6 + attrs.physical * 0.1 - difficultyMod;
        if (position === "ZAG" || position === "VOL") chance += 10;
      } else {
        chance = 35 + attrs.defending * 0.4 + attrs.pace * 0.3 - difficultyMod;
        if (position === "LAT" || position === "VOL") chance += 10;
      }
      return chance;
    },
    // Aqui "sucesso" = evitar o gol adversário (não é gol do próprio jogador).
    successText: (actionId, name, opponentName) =>
      actionId === "desarmar"
        ? `GRANDE DESARME DE ${name.toUpperCase()}! Corta a jogada de perigo do ${opponentName}.`
        : `${name.toUpperCase()} NÃO SAI DA MARCAÇÃO um segundo sequer. Jogada anulada!`,
    // "Falha" aqui = o adversário marca o gol.
    failText: (actionId, name, opponentName) =>
      actionId === "desarmar"
        ? `Não chegou a tempo! ${name} falha no desarme e é GOL DO ${opponentName.toUpperCase()}!`
        : `${name} perde a referência da marcação e é GOL DO ${opponentName.toUpperCase()}!`,
  },

  PENALTI: {
    chanceText: (name) => `PÊNALTI para o seu time! Como cobrador oficial, ${name} se prepara para bater. Como vai cobrar?`,
    actions: [
      { id: "canto", label: "Canto do Gol", icon: Target, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
      { id: "cavadinha", label: "Cavadinha", icon: FastForward, classes: "bg-purple-900/50 hover:bg-purple-800/80 border border-purple-700 text-purple-200", resultType: "goal" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs } = player;
      let chance = 50;
      if (actionId === "canto") {
        // Cobrança mais segura, alto índice de acerto para bons finalizadores.
        chance = 60 + attrs.shooting * 0.3 - difficultyMod * 0.5;
      } else {
        // Cavadinha: mais arriscada, mas quase imparável quando dá certo.
        chance = 40 + attrs.shooting * 0.25 + attrs.dribbling * 0.15 - difficultyMod;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "canto"
        ? `PÊNALTI CONVERTIDO! ${name.toUpperCase()} bate no canto e não dá chance ao goleiro. GOL!`
        : `QUE CAVADINHA DE ${name.toUpperCase()}! Rouba o tempo do goleiro com categoria. GOL!`,
    failText: (actionId, name) =>
      actionId === "canto"
        ? `O goleiro adivinha o canto! Pênalti defendido por ${name}, seguimos no jogo.`
        : `Cavadinha mal calculada de ${name}, o goleiro não sai do lugar e defende!`,
  },

  FALTA: {
    chanceText: (name) => `Falta perigosa na entrada da área! ${name}, o cobrador oficial do time, vai bater. O que fazer?`,
    actions: [
      { id: "cobrar", label: "Cobrar no Ângulo", icon: Crosshair, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
      { id: "cruzar", label: "Cruzar na Área", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs } = player;
      let chance = 50;
      if (actionId === "cobrar") {
        chance = 30 + attrs.shooting * 0.6 - difficultyMod;
      } else {
        chance = 35 + attrs.passing * 0.6 - difficultyMod;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "cobrar"
        ? `QUE COBRANÇA DE FALTA DE ${name.toUpperCase()}! Acerta o ângulo! GOLAÇO!`
        : `Cruzamento perfeito na cobrança de falta de ${name}! O companheiro cabeceia. GOL!`,
    failText: (actionId, name, opponentName) =>
      actionId === "cobrar"
        ? `Na barreira! A cobrança de falta de ${name} desvia e sai pela linha de fundo.`
        : `Falta cobrada errada por ${name}, a defesa do ${opponentName} afasta sem problemas.`,
  },
};

function getScenarioPool(position: Position, includeSetPieces: boolean): Scenario[] {
  const base = ATTACKING_POSITIONS.includes(position) ? ATTACKING_SCENARIOS : DEFENSIVE_SCENARIOS;
  return includeSetPieces ? [...base, ...SET_PIECE_SCENARIOS] : base;
}

// -----------------------------------------------------------------------------

// Lives at module scope (not component state) so it persists across finals and
// seasons for as long as the app is open, but resets on a full page reload.
// This is what prevents the player from facing the exact same rival final
// after final — both within the same season (multiple finals) and across
// consecutive seasons.
const recentOpponentsByCategory = new Map<string, string[]>();

export function resetOpponentMemory() {
  recentOpponentsByCategory.clear();
}

interface MatchEvent {
  minute: number;
  text: string;
  type: "neutral" | "goal_us" | "goal_them" | "chance" | "miss";
}



const QUALITY_WORDS = ["Perfeito", "Muito Bom", "Bom", "Mediano", "Ruim", "Horrível"];

function getQualityWord(roll: number, chance: number): string {
  if (roll <= chance) {
    if (roll <= chance / 3) return "Perfeito";
    if (roll <= (chance * 2) / 3) return "Muito Bom";
    return "Bom";
  } else {
    const gap = 100 - chance;
    if (roll <= chance + gap / 3) return "Mediano";
    if (roll <= chance + (gap * 2) / 3) return "Ruim";
    return "Horrível";
  }
}

function getQualityColor(word: string): string {
  switch (word) {
    case "Perfeito": return "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]";
    case "Muito Bom": return "text-emerald-400";
    case "Bom": return "text-green-300";
    case "Mediano": return "text-yellow-400";
    case "Ruim": return "text-orange-500";
    case "Horrível": return "text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]";
    default: return "text-white";
  }
}

function AnimatedActionQuality({ rollValue, chance }: { rollValue: number, chance: number }) {
  const [currentWord, setCurrentWord] = useState(QUALITY_WORDS[0]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let startTime: number;
    const duration = 1500;
    let lastChange = 0;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        if (timestamp - lastChange > 100) {
          setCurrentWord(QUALITY_WORDS[Math.floor(Math.random() * QUALITY_WORDS.length)]);
          lastChange = timestamp;
        }
        requestAnimationFrame(animate);
      } else {
        setCurrentWord(getQualityWord(rollValue, chance));
        setDone(true);
      }
    };
    
    requestAnimationFrame(animate);
  }, [rollValue, chance]);

  const colorClass = done ? getQualityColor(currentWord) : "text-slate-300 opacity-50";
  const scaleClass = done ? "scale-110 transition-transform duration-300" : "scale-100";

  return <span className={`inline-block font-black text-2xl md:text-3xl uppercase tracking-widest ${colorClass} ${scaleClass}`}>{currentWord}</span>;
}


export function InteractiveMatchModal({
 
  player, 
  finalType, 
  onComplete 
}: { 
  player: Player; 
  finalType: string; 
  onComplete: (won: boolean, playerGoals: number, playerAssists: number) => void;
}) {
  const [status, setStatus] = useState<MatchStatus>("INTRO");
  const [minute, setMinute] = useState(0);
  const [scoreUs, setScoreUs] = useState(0);
  const [scoreThem, setScoreThem] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [opponentName, setOpponentName] = useState("Adversário");
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  
  // To track player chances
  const [chancesHad, setChancesHad] = useState(0);
  const [totalChances, setTotalChances] = useState(1);
  
  const [resolvingPenalties, setResolvingPenalties] = useState(false);
  const [diceRollInfo, setDiceRollInfo] = useState<{ actionId: string; chance: number; isSuccess: boolean; rollValue: number } | null>(null);


  // Gols e assistências que o PRÓPRIO jogador fez nesta final (somados ao
  // total da temporada quando a partida termina). Gols/assistências de
  // outros companheiros ("GOL DA SUA EQUIPE!") não entram aqui.
  const [matchGoals, setMatchGoals] = useState(0);
  const [matchAssists, setMatchAssists] = useState(0);

  const isNational = finalType.includes("Copa do Mundo") || finalType.includes("Eurocopa") || finalType.includes("Copa América") || finalType.includes("Copa Continental (Seleção)");
  const playerTeamName = isNational ? player.nationality : player.currentTeam.name;

  useEffect(() => {
    let ops = TEAMS.map(t => t.name);
    // `category` groups finals that draw from the same pool of possible
    // opponents, so we know which "recently faced" list applies to this draw.
    let category = "geral";

    if (finalType.includes("Mundial")) {
      category = "mundial";
      ops = ["Real Madrid", "Manchester City", "Bayern de Munique", "Liverpool", "Barcelona", "Chelsea", "Inter de Milão", "Boca Juniors"];
    } else if (finalType.includes("Eurocopa")) {
      // Eurocopa - só seleções europeias disputam.
      category = `selecao-${finalType}`;
      ops = EUROPEAN_NATIONALITIES.filter(c => c !== player.nationality);
    } else if (finalType.includes("Copa América")) {
      // Copa América - só seleções americanas disputam.
      category = `selecao-${finalType}`;
      ops = AMERICAN_NATIONALITIES.filter(c => c !== player.nationality);
    } else if (isNational) {
      // Copa do Mundo (ou fallback genérico) - qualquer seleção pode aparecer.
      category = `selecao-${finalType}`;
      ops = ["França", "Alemanha", "Argentina", "Espanha", "Inglaterra", "Itália", "Portugal", "Holanda", "Uruguai", "Brasil"];
      ops = ops.filter(c => c !== player.nationality); // simple avoidance
    } else if (finalType.includes("Libertadores")) {
      category = "libertadores";
      const libertadoresTeams = ["Boca Juniors", "River Plate", "Peñarol", "Nacional", "Independiente", "Colo-Colo"];
      const brTeams = TEAMS.filter(t => t.country === "BR" && t.level >= 2 && t.id !== player.currentTeam.id).map(t => t.name);
      ops = [...libertadoresTeams, ...brTeams];
    } else if (finalType.includes("Champions") || (finalType.includes("Continental") && !isNational)) {
      // A Champions League é uma competição europeia - só clubes da Europa
      // (EN/ES/IT/DE/FR/PT/NL) podem entrar nesse sorteio. Antes, o filtro
      // usava "país !== BR", o que deixava clubes sul-americanos (ex: Boca
      // Juniors), sauditas ou norte-americanos entrarem como adversários.
      category = "continental";
      const UEFA_COUNTRIES = ["EN", "ES", "IT", "DE", "FR", "PT", "NL"];
      ops = TEAMS.filter(t => UEFA_COUNTRIES.includes(t.country) && t.level >= 3 && t.id !== player.currentTeam.id).map(t => t.name);
      if (ops.length === 0) ops = ["Bayern de Munique", "Real Madrid", "PSG", "Manchester City", "Juventus"];
    } else {
      category = `domestico-${player.currentTeam.country}`;
      const domestic = TEAMS.filter(t => t.country === player.currentTeam.country && t.id !== player.currentTeam.id);
      if (domestic.length > 0) {
        ops = domestic.map(t => t.name);
      }
    }

    // Nunca deixa o adversário ser o próprio time (ou a própria seleção) do
    // jogador. Algumas listas são fixas (Mundial de Clubes, Libertadores) e
    // não filtravam isso por id/nome, o que permitia sorteios como
    // "Barcelona x Barcelona" quando o jogador defendia esse mesmo clube.
    ops = ops.filter(name => name !== playerTeamName);
    if (ops.length === 0) {
      // Pool ficou vazio (só existia o próprio time/seleção nele) - usa um
      // adversário genérico em vez de deixar o jogador enfrentar a si mesmo.
      ops = ["Rival"];
    }

    // Exclude opponents recently faced in this same category (this is what
    // stops back-to-back finals — same season or consecutive seasons —
    // against the identical rival). If excluding them would leave no
    // options (tiny pools), fall back to the full list so the draw never breaks.
    const recent = recentOpponentsByCategory.get(category) || [];
    const freshOptions = ops.filter(name => !recent.includes(name));
    const pool = freshOptions.length > 0 ? freshOptions : ops;

    const chosen = pool[Math.floor(Math.random() * pool.length)] || "Adversário";
    setOpponentName(chosen);

    // Remember this pick. We only keep up to half the pool size so that in
    // small pools (e.g. a 5-team domestic league) we don't end up excluding
    // every possible opponent.
    const memorySize = Math.max(1, Math.floor(ops.length / 2));
    recentOpponentsByCategory.set(category, [chosen, ...recent].slice(0, memorySize));

    setStatus("INTRO");
    setMinute(0);
    setScoreUs(0);
    setScoreThem(0);
    setEvents([]);
    setChancesHad(0);
    setCurrentScenario(null);
    setMatchGoals(0);
    setMatchAssists(0);
    // Cada final agora sorteia entre 1 e 6 chances de o jogador participar
    // ativamente da jogada, em vez de sempre uma única oportunidade.
    const isIdol = player.idolClubs?.includes(player.currentTeam.name);
    setTotalChances(isIdol && !isNational ? 6 : Math.floor(Math.random() * 6) + 1);
  }, [finalType, player.currentTeam.country, player.currentTeam.name, player.idolClubs, player.nationality, isNational]);

  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events]);

  const addEvent = (text: string, type: MatchEvent["type"] = "neutral", atMinute?: number) => {
    setEvents(prev => [...prev, { minute: atMinute ?? minute, text, type }]);
  };

  useEffect(() => {
    let timer: number;
    if (status === "SIMULATING") {
      timer = window.setInterval(() => {
        setMinute(m => {
          const nextMin = m + 1;
          
          if (nextMin >= 90) {
            setStatus("FINISHED");
            addEvent("Fim de Jogo! O árbitro apita o final da partida.", "neutral", nextMin);
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
            addEvent(genericEvents[Math.floor(Math.random() * genericEvents.length)], "neutral", nextMin);
          }

          // Opponent scores (lowered probability for realistic score)
          if (Math.random() < 0.004) {
            setScoreThem(s => s + 1);
            addEvent(`GOL DO ${opponentName.toUpperCase()}! Eles abrem a defesa e marcam.`, "goal_them", nextMin);
          }

          // Team scores without player (lowered probability)
          if (Math.random() < 0.003) {
            setScoreUs(s => s + 1);
            addEvent(`GOL DA SUA EQUIPE! Uma bela jogada coletiva termina na rede!`, "goal_us", nextMin);
          }

          // Player chance! (probabilidade um pouco maior que antes para que
          // seja realmente possível emplacar as até 6 chances sorteadas
          // dentro dos 90 minutos, e não só na teoria). O cenário sorteado
          // depende da posição do jogador: ATA/PON/MEI vivem momentos mais
          // ofensivos, enquanto MC/VOL/ZAG/LAT vivem momentos de recuperação
          // de bola e marcação.
          if (chancesHad < totalChances && Math.random() < 0.035) {
            const playerOvr = calculateOverall(player.attributes, player.position);
            const threshold = SET_PIECE_OVR_THRESHOLD[player.currentTeam.level] ?? Infinity;
            const isSetPieceTaker = playerOvr >= threshold;
            const pool = getScenarioPool(player.position, isSetPieceTaker);
            const scenario = pool[Math.floor(Math.random() * pool.length)];
            setCurrentScenario(scenario);
            setStatus("WAITING_ACTION");
            addEvent(SCENARIOS[scenario].chanceText(player.name, opponentName), "chance", nextMin);
          }

          return nextMin;
        });
      }, 150); // Speed of the match (150ms per minute)
    }
    
    return () => clearInterval(timer);
  }, [status, chancesHad, totalChances, player.name, player.position, player.currentTeam.level, opponentName]);

  const handleAction = (actionId: string) => {
    if (!currentScenario) return;

    const config = SCENARIOS[currentScenario];
    const difficultyMod = player.currentTeam.level * 5;

    let chance = config.computeChance(actionId, player, difficultyMod);
    chance = Math.max(10, Math.min(90, Math.round(chance)));
    
    // Rola de 1 a 100
    const rollValue = Math.floor(Math.random() * 100) + 1;
    const isSuccess = rollValue <= chance;

    setDiceRollInfo({ actionId, chance, isSuccess, rollValue });
    setStatus("ROLLING_DICE");
    
    // Apply result after animation (e.g. 1.8s)
    setTimeout(() => {
      setChancesHad(c => c + 1);
      const isDefensiveScenario = DEFENSIVE_SCENARIO_SET.has(currentScenario);

      if (isSuccess) {
        if (isDefensiveScenario) {
          addEvent(config.successText(actionId, player.name, opponentName), "chance");
        } else {
          setScoreUs(s => s + 1);
          const action = config.actions.find(a => a.id === actionId);
          if (action?.resultType === "goal") {
            setMatchGoals(g => g + 1);
          } else if (action?.resultType === "assist") {
            setMatchAssists(a => a + 1);
          }
          addEvent(config.successText(actionId, player.name, opponentName), "goal_us");
        }
      } else {
        if (isDefensiveScenario) {
          setScoreThem(s => s + 1);
          addEvent(config.failText(actionId, player.name, opponentName), "goal_them");
        } else {
          addEvent(config.failText(actionId, player.name, opponentName), "miss");
        }
      }

      setDiceRollInfo(null);
      setCurrentScenario(null);
      setStatus("SIMULATING");
    }, 4500);
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
    // Guard against rapid double-clicks: once the penalty shootout has
    // started, ignore further clicks on this same button until it resolves.
    if (resolvingPenalties) return;

    if (scoreUs === scoreThem) {
      setResolvingPenalties(true);
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
        setResolvingPenalties(false);
      }, 1500);
      return;
    }
    
    let won = scoreUs > scoreThem;
    onComplete(won, matchGoals, matchAssists);
  };

  const currentActions = currentScenario ? SCENARIOS[currentScenario].actions : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col h-[85vh] max-h-[800px] overflow-hidden">
        
        {/* Header / Scoreboard */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 text-center relative shrink-0">
          <div className="text-emerald-500 mb-2 font-black uppercase tracking-widest text-sm flex justify-center items-center gap-2">
            Final: {finalType}
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="text-right flex-1 overflow-hidden flex items-center justify-end gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-100">{playerTeamName}</h2>
                <span className="text-emerald-400 font-bold text-sm">Seu Time</span>
              </div>
              {!isNational && player.currentTeam.logo && (
                <img src={player.currentTeam.logo} alt={playerTeamName} className="w-12 h-auto object-contain rounded-full p-1 shadow-md flex-shrink-0" />
              )}
            </div>
            
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="bg-slate-900 border-2 border-slate-700 px-4 py-2 rounded-2xl flex items-center gap-4 text-4xl font-black text-white min-w-[140px] justify-center">
                <span>{scoreUs}</span>
                <span className="text-slate-600">-</span>
                <span>{scoreThem}</span>
              </div>
              <div className="mt-2 font-mono text-xl text-blue-400 font-bold">
                {minute}'
              </div>
            </div>

            <div className="text-left flex-1 overflow-hidden flex items-center justify-start gap-3">
              {!isNational && TEAMS.find(t => t.name === opponentName)?.logo && (
                <img src={TEAMS.find(t => t.name === opponentName)?.logo} alt={opponentName} className="w-12 h-auto object-contain rounded-full p-1 shadow-md flex-shrink-0" />
              )}
              <div>
                <h2 className="text-lg font-black text-slate-100">{opponentName}</h2>
                <span className="text-red-400 font-bold text-sm">Adversário</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Events Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-sm bg-[#0a0f1c]">
          {events.length === 0 && status === "INTRO" && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Trophy className="w-16 h-16 opacity-20" />
              <p>Aguardando o apito inicial para {playerTeamName} x {opponentName}...</p>
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

          {status === "WAITING_ACTION" && currentScenario && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 text-blue-400 font-bold justify-center mb-2">
                <AlertCircle className="w-5 h-5 animate-bounce" />
                Sua chance de brilhar! Escolha uma jogada:
              </div>
              <div className={`grid gap-4 ${currentActions.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
                {currentActions.map((action) => {
                  const Icon = action.icon;
                  const difficultyMod = player.currentTeam.level * 5;
                  let chance = SCENARIOS[currentScenario].computeChance(action.id, player, difficultyMod);
                  chance = Math.max(10, Math.min(90, Math.round(chance)));
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      className={`p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${action.classes}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-6 h-6" /> {action.label}
                      </div>
                      <div className="text-sm opacity-90 px-2 py-1 bg-black/30 rounded-lg">
                        {chance}% de Sucesso
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          
          {status === "ROLLING_DICE" && diceRollInfo && (
            <div className="flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-300">
              <div className="text-lg font-bold text-slate-400 tracking-widest uppercase">Executando a jogada...</div>
              
              <div className="h-32 flex items-center justify-center w-full">
                <AnimatedActionQuality rollValue={diceRollInfo.rollValue} chance={diceRollInfo.chance} />
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700/50 px-6 py-4 rounded-2xl text-center w-full max-w-xs transition-opacity duration-1000 delay-1500 opacity-80">
                <div className="text-xs text-slate-400 mb-1">Dificuldade da Jogada</div>
                <div className="text-lg font-bold text-slate-200">{diceRollInfo.chance}% de chance</div>
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
              disabled={resolvingPenalties}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all text-xl"
            >
              {resolvingPenalties ? "Cobrando pênaltis..." : scoreUs === scoreThem ? "Ir para os Pênaltis" : "Continuar"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
