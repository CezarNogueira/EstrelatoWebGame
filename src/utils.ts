import { Attributes, Child, CupMatch, CupSeasonState, GroupStanding, LeagueMatch, LeagueSeasonState, LeagueStanding, Player, Position, SeasonStat, Team } from "./types";
import { TEAMS, getNationalContinentalCup, NATIONAL_TEAMS, EUROPEAN_NATIONALITIES, AMERICAN_NATIONALITIES, ASIAN_NATIONALITIES, getNationalTeam } from "./data";
import { NPC_PLAYERS } from "./squadPlayers";

export const getLeagueName = (team: Team): string => {
  if (team.division === 2) {
    if (team.country === "BR") return "Série B";
    if (team.country === "EN") return "Championship";
    if (team.country === "IT") return "Serie B";
    if (team.country === "ES") return "La Liga 2";
    if (team.country === "DE") return "2. Bundesliga";
    if (team.country === "FR") return "Ligue 2";
    if (team.country === "PT") return "Liga Portugal 2";
    if (team.country === "NL") return "Eerste Divisie";
    if (team.country === "US") return "USL Championship";
    if (team.country === "SA") return "First Division League";
    if (team.country === "AR") return "Primera Nacional";
    if (team.country === "UY") return "Segunda División";
    return "2ª Divisão";
  } else {
    if (team.country === "BR") return "Brasileirão";
    if (team.country === "EN") return "Premier League";
    if (team.country === "IT") return "Serie A";
    if (team.country === "ES") return "La Liga";
    if (team.country === "DE") return "Bundesliga";
    if (team.country === "FR") return "Ligue 1";
    if (team.country === "PT") return "Primeira Liga";
    if (team.country === "NL") return "Eredivisie";
    if (team.country === "US") return "MLS";
    if (team.country === "SA") return "Saudi Pro League";
    if (team.country === "AR") return "Liga Profesional Argentina";
    if (team.country === "UY") return "Primera División Uruguaya";
    return "1ª Divisão";
  }
};

export type LeagueTheme = {
  name: string;
  pageGradient: string;
  cardGradient: string;
  border: string;
  accent: string;
  accentSoft: string;
};

const DEFAULT_THEME: LeagueTheme = {
  name: "Padrão",
  pageGradient: "radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 60%)",
  cardGradient: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)",
  border: "#1e293b",
  accent: "#10b981",
  accentSoft: "rgba(16, 185, 129, 0.3)",
};

const LEAGUE_THEMES: Record<string, LeagueTheme> = {
  BR: {
    name: "Brasileirão",
    pageGradient: "radial-gradient(circle at 50% 0%, #064e3b 0%, #020617 65%)",
    cardGradient: "linear-gradient(160deg, #052e2b 0%, #0a1a2f 100%)",
    border: "#0f3d33",
    accent: "#22c55e",
    accentSoft: "rgba(34, 197, 94, 0.3)",
  },
  EN: {
    name: "Premier League",
    pageGradient: "radial-gradient(circle at 50% 0%, #3b0764 0%, #020617 65%)",
    cardGradient: "linear-gradient(160deg, #2e1065 0%, #150a30 100%)",
    border: "#3b1a6b",
    accent: "#a855f7",
    accentSoft: "rgba(168, 85, 247, 0.3)",
  },
  IT: {
    name: "Serie A",
    pageGradient: "radial-gradient(circle at 50% 0%, #064e3b 0%, #0c0a09 65%)",
    cardGradient: "linear-gradient(160deg, #052e26 0%, #1c1917 100%)",
    border: "#164e3f",
    accent: "#34d399",
    accentSoft: "rgba(52, 211, 153, 0.3)",
  },
  ES: {
    name: "La Liga",
    pageGradient: "radial-gradient(circle at 50% 0%, #7c2d12 0%, #1c0a02 65%)",
    cardGradient: "linear-gradient(160deg, #6c1d0f 0%, #20100a 100%)",
    border: "#7a2e10",
    accent: "#f97316",
    accentSoft: "rgba(249, 115, 22, 0.3)",
  },
  DE: {
    name: "Bundesliga",
    pageGradient: "radial-gradient(circle at 50% 0%, #500724 0%, #0a0a0a 65%)",
    cardGradient: "linear-gradient(160deg, #3f0620 0%, #171717 100%)",
    border: "#5b0a2e",
    accent: "#ec4899",
    accentSoft: "rgba(236, 72, 153, 0.3)",
  },
  FR: {
    name: "Ligue 1",
    pageGradient: "radial-gradient(circle at 50% 0%, #7c2d12 0%, #0a0a0a 65%)",
    cardGradient: "linear-gradient(160deg, #431407 0%, #171717 100%)",
    border: "#5c2410",
    accent: "#fb923c",
    accentSoft: "rgba(251, 146, 60, 0.3)",
  },
  PT: {
    name: "Primeira Liga",
    pageGradient: "radial-gradient(circle at 50% 0%, #14532d 0%, #020617 65%)",
    cardGradient: "linear-gradient(160deg, #0d3d21 0%, #0f172a 100%)",
    border: "#155232",
    accent: "#4ade80",
    accentSoft: "rgba(74, 222, 128, 0.3)",
  },
  NL: {
    name: "Eredivisie",
    pageGradient: "radial-gradient(circle at 50% 0%, #7c2d12 0%, #020617 65%)",
    cardGradient: "linear-gradient(160deg, #5b230d 0%, #0f172a 100%)",
    border: "#6b2c10",
    accent: "#fb923c",
    accentSoft: "rgba(251, 146, 60, 0.3)",
  },
  US: {
    name: "MLS",
    pageGradient: "radial-gradient(circle at 50% 0%, #1e3a8a 0%, #020617 65%)",
    cardGradient: "linear-gradient(160deg, #1e3a5f 0%, #0f172a 100%)",
    border: "#1e40af",
    accent: "#60a5fa",
    accentSoft: "rgba(96, 165, 250, 0.3)",
  },
  SA: {
    name: "Saudi Pro League",
    pageGradient: "radial-gradient(circle at 50% 0%, #14532d 0%, #1c1917 65%)",
    cardGradient: "linear-gradient(160deg, #163a20 0%, #292524 100%)",
    border: "#365314",
    accent: "#eab308",
    accentSoft: "rgba(234, 179, 8, 0.3)",
  },
  AR: {
    name: "Liga Profesional Argentina",
    pageGradient: "radial-gradient(circle at 50% 0%, #075985 0%, #020617 65%)",
    cardGradient: "linear-gradient(160deg, #0c4a6e 0%, #0f172a 100%)",
    border: "#0e5b85",
    accent: "#38bdf8",
    accentSoft: "rgba(56, 189, 248, 0.3)",
  },
  UY: {
    name: "Primera División Uruguaya",
    pageGradient: "radial-gradient(circle at 50% 0%, #155e75 0%, #020617 65%)",
    cardGradient: "linear-gradient(160deg, #134e5e 0%, #0f172a 100%)",
    border: "#1c5f6f",
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.3)",
  },
};

export const getLeagueTheme = (team: Team | undefined, isPro: boolean): LeagueTheme => {
  if (!isPro || !team?.country) return DEFAULT_THEME;
  return LEAGUE_THEMES[team.country] || DEFAULT_THEME;
};

export const getRelativeLevel = (team: Team): number => {
  if (!team.country) return team.level;
  const sameCountryTeams = TEAMS.filter(t => t.country === team.country && t.division !== 2);
  const maxLevel = sameCountryTeams.reduce((max, t) => Math.max(max, t.level), 1);
  const levelDiff = maxLevel - team.level;
  return Math.max(1, 5 - levelDiff);
};

export const addMessageToChat = (player: Player, personId: string, text: string): Player => {
  const updatedPlayer = { ...player, chats: { ...(player.chats || {}) } };
  const currentChat = updatedPlayer.chats[personId] || { messages: [], hasUnread: false };
  updatedPlayer.chats[personId] = {
    ...currentChat,
    messages: [...currentChat.messages, { sender: "them", text }],
    hasUnread: true,
  };
  return updatedPlayer;
};

export const calculateOverall = (attr: Attributes, pos: Position): number => {
  let weights = { pace: 1, shooting: 1, passing: 1, dribbling: 1, defending: 1, physical: 1 };
  
  switch (pos) {
    case "ATA":
      weights = { pace: 2, shooting: 3, passing: 1, dribbling: 1, defending: 0.01, physical: 1.5 };
      break;
    case "PON":
      weights = { pace: 3, shooting: 1, passing: 2, dribbling: 3, defending: 0.1, physical: 0.2 };
      break;
    case "MEI":
      weights = { pace: 1, shooting: 1, passing: 3, dribbling: 2, defending: 0.5, physical: 0.5 };
      break;
    case "MC":
      weights = { pace: 1, shooting: 1, passing: 2, dribbling: 2, defending: 2, physical: 1 };
      break;
    case "VOL":
      weights = { pace: 0.5, shooting: 0.5, passing: 2, dribbling: 1, defending: 3, physical: 3 };
      break;
    case "ZAG":
      weights = { pace: 1, shooting: 0.1, passing: 1, dribbling: 0.5, defending: 3, physical: 3 };
      break;
    case "LAT":
      weights = { pace: 3, shooting: 0.4, passing: 2, dribbling: 1.5, defending: 2.5, physical: 1.5 };
      break;
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const weightedSum =
    attr.pace * weights.pace +
    attr.shooting * weights.shooting +
    attr.passing * weights.passing +
    attr.dribbling * weights.dribbling +
    attr.defending * weights.defending +
    attr.physical * weights.physical;

  return Math.round(weightedSum / totalWeight);
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// How much each position contributes to each kind of stat. This is what
// stops every position from behaving like a potential striker: attacking
// positions score/assist far more, while ZAG/LAT/VOL generate most of their
// value from tackles and clean sheets instead.
type PositionStatWeights = {
  goals: number;
  assists: number;
  tackles: number;
  cleanSheets: number;
};

export const POSITION_STAT_WEIGHTS: Record<Position, PositionStatWeights> = {
  ATA: { goals: 1.20, assists: 0.55, tackles: 0.01, cleanSheets: 0.25 },
  PON: { goals: 1.15, assists: 0.95, tackles: 0.20, cleanSheets: 0.25 },
  MEI: { goals: 0.75, assists: 1.40, tackles: 0.25, cleanSheets: 0.25 },
  MC:  { goals: 0.30, assists: 0.75, tackles: 0.70, cleanSheets: 0.50 },
  VOL: { goals: 0.12, assists: 0.45, tackles: 1.00, cleanSheets: 0.75 },
  LAT: { goals: 0.10, assists: 0.60, tackles: 0.85, cleanSheets: 0.75 },
  ZAG: { goals: 0.04, assists: 0.30, tackles: 1.20, cleanSheets: 1.00 },
};

// Positions whose value is primarily defensive - used to gate defensive-only
// awards and national call-ups so they don't depend on goals/assists.
export const DEFENSIVE_POSITIONS: Position[] = ["ZAG", "LAT", "VOL"];

// Single source of truth for match-stat generation, shared by getReachedFinals
// (which needs a rough estimate to gate national-team finals) and
// simulateSeason (which generates the real season numbers). Keeping this in
// one place means every position is scored consistently everywhere.
export const generateSeasonMatchStats = (
  player: Player,
  matches: number,
  performanceRatio: number
): { goals: number; assists: number; tackles: number; cleanSheets: number } => {
  const w = POSITION_STAT_WEIGHTS[player.position];

  const goalScale = 0.6;
  const assistScale = 0.4;

  const goalProbBase = ((player.attributes.shooting * 0.7 + player.attributes.pace * 0.3) / 100) * performanceRatio * w.goals * goalScale;
  const assistProbBase = (player.attributes.passing / 100) * performanceRatio * w.assists * assistScale;

  let goals = 0;
  let assists = 0;

  for (let i = 0; i < matches; i++) {
    let matchGoals = 0;
    let matchAssists = 0;
    const currGoalProb = goalProbBase * (0.5 + Math.random() * 0.7); // slight match variance
    const currAssistProb = assistProbBase * (0.5 + Math.random() * 0.7);
    
    for (let j = 0; j < 4; j++) {
       if (Math.random() < currGoalProb / (Math.pow(2.5, j) + 0.2)) {
         matchGoals++;
       }
       if (Math.random() < currAssistProb / (Math.pow(2.5, j) + 0.2)) {
         matchAssists++;
       }
    }
    goals += matchGoals;
    assists += matchAssists;
  }

  const tacklesPerMatch = (0.6 + (player.attributes.defending / 99) * 3.4) * w.tackles;
  const tackles = Math.max(0, Math.round(matches * tacklesPerMatch * (0.85 + Math.random() * 0.3)));

  const teamDefenseFactor = Math.min(1, Math.max(0.05,
    (player.attributes.defending / 99) * 0.5 + (player.currentTeam.level / 5) * 0.5
  ));
  const cleanSheetRate = Math.min(0.75, 0.12 + teamDefenseFactor * 0.5) * w.cleanSheets;
  const cleanSheets = Math.min(matches, Math.max(0, Math.round(matches * cleanSheetRate)));

  return { goals, assists, tackles, cleanSheets };
};

export const getNationalCallScore = (
  goals: number,
  assists: number,
  tackles: number,
  cleanSheets: number
): number => {
  return (goals + assists) + tackles * 0.10 + cleanSheets * 0.6;
};

export const getPlayerTitle = (age: number, ovr: number): string => {
  if (ovr >= 99) return "Super Estrela";
  if (ovr >= 94) return "Estrela";
  if (ovr >= 90) return "Auge";
  if (ovr > 85) return "Extraordinário";
  if (age <= 19) return "Jovem Promessa";
  if (age < 24 && ovr > 78) return "Promessa";
  if (age > 27 && ovr < 80) return "Mediano";
  return "Padrão";
};

export const getSeasonHealthDecline = (age: number): number => {
  if (age <= 18) return 1;
  if (age <= 23) return 2;
  if (age <= 29) return 9;
  if (age <= 39) return 12;
  return 25;
};

export const generateGrowthPoints = (age: number): { points: number, decline: Partial<Attributes> } => {
  let points = 0;
  const decline: Partial<Attributes> = {};
  
  if (age < 18) {
    points = randomInt(8, 18);
  } else if (age < 24) {
    points = randomInt(2, 4);
  } else if (age < 29) {
    points = randomInt(1, 4);
  } else if (age < 34) {
    points = 0;
    const attrs: (keyof Attributes)[] = ["pace", "shooting", "passing", "dribbling", "defending", "physical"];
    attrs.forEach((attr) => decline[attr] = randomInt(-4, 0));
  } else {
    points = 0;
    const attrs: (keyof Attributes)[] = ["pace", "shooting", "passing", "dribbling", "defending", "physical"];
    attrs.forEach((attr) => decline[attr] = randomInt(-8, 0));
  }
  
  return { points, decline };
};

export const applyGrowth = (current: Attributes, growth: Partial<Attributes>): Attributes => {
  return {
    pace: Math.min(99, Math.max(1, current.pace + (growth.pace || 0))),
    shooting: Math.min(99, Math.max(1, current.shooting + (growth.shooting || 0))),
    passing: Math.min(99, Math.max(1, current.passing + (growth.passing || 0))),
    dribbling: Math.min(99, Math.max(1, current.dribbling + (growth.dribbling || 0))),
    defending: Math.min(99, Math.max(1, current.defending + (growth.defending || 0))),
    physical: Math.min(99, Math.max(1, current.physical + (growth.physical || 0))),
  };
};

export const formatCurrency = (value: number) => {
  if (value >= 1000000) return `€ ${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `€ ${(value / 1000).toFixed(0)}k`;
  return `€ ${value.toFixed(0)}`;
};

export const calculateMarketValue = (ovr: number, age: number): number => {
  let value = 0;
  if (ovr < 60) value = 100000 + (ovr - 50) * 50000;
  else if (ovr < 70) value = 1000000 + (ovr - 60) * 500000;
  else if (ovr < 80) value = 6000000 + (ovr - 70) * 2000000;
  else if (ovr < 90) value = 26000000 + (ovr - 80) * 5000000;
  else value = 76000000 + (ovr - 90) * 15000000;

  value = Math.max(10000, value);

  let multiplier = 1;
  if (age < 20) multiplier = 1.8;
  else if (age < 24) multiplier = 1.2;
  else if (age < 28) multiplier = 1.1;
  else if (age < 32) multiplier = 0.8;
  else if (age < 35) multiplier = 0.2;
  else multiplier = 0.1;

  return Math.floor(value * multiplier);
};

export const autoDistributePoints = (
  points: number,
  currentAttributes: Attributes,
  position: Position
): Partial<Attributes> => {
  const distribution: Partial<Attributes> = {};
  let remaining = points;

  // Define weights based on position
  const weights: Record<Position, (keyof Attributes)[]> = {
    "ATA": ["shooting", "pace", "dribbling", "physical", "passing", "defending"],
    "PON": ["pace", "dribbling", "shooting", "passing", "physical", "defending"],
    "MEI": ["passing", "dribbling", "shooting", "pace", "physical", "defending"],
    "MC":  ["passing", "physical", "dribbling", "defending", "pace", "shooting"],
    "VOL": ["defending", "physical", "passing", "dribbling", "pace", "shooting"],
    "ZAG": ["defending", "physical", "pace", "passing", "dribbling", "shooting"],
    "LAT": ["pace", "defending", "passing", "dribbling", "physical", "shooting"],
  };

  const priority = weights[position];

  while (remaining > 0) {
    let pointAllocated = false;
    for (const attr of priority) {
      if (remaining <= 0) break;
      const currentVal = currentAttributes[attr] + (distribution[attr] || 0);
      if (currentVal < 99) {
        if (Math.random() > 0.3) {
          distribution[attr] = (distribution[attr] || 0) + 1;
          remaining--;
          pointAllocated = true;
        }
      }
    }

    if (!pointAllocated && priority.every(attr => currentAttributes[attr] + (distribution[attr] || 0) >= 99)) {
      break;
    }
  }

  return distribution;
};

export const generatePressMessage = (
  player: Player,
  stat: SeasonStat,
  transferOffer: Team | null,
  proContractOffer: boolean
): string => {
  const messages: string[] = [];

  // Mental Health
  if (stat.depressed) {
    messages.push(`"${player.name} foi diagnosticado com depressão e se afastou completamente do futebol nesta temporada."`);
    messages.push(`"Lutando contra a depressão, ${player.name} não entrou em campo neste ano."`);
  } else if (stat.isolated) {
    messages.push(`"Fontes dizem que ${player.name} tem faltado aos treinos e se distanciado do elenco por problemas pessoais."`);
    messages.push(`"${player.name} tem evitado a mídia e companheiros, refletindo em menos jogos disputados."`);
  } else if (stat.isBenched) {
    messages.push(`"Sem espaço no time, ${player.name} amargou o banco de reservas durante a maior parte da temporada."`);
    messages.push(`"${player.name} jogou pouco e não conseguiu se firmar entre os titulares."`);
  }

  // Awards
  if (stat.individualAwards && stat.individualAwards.includes("Bola de Ouro")) {
    messages.push(`"${player.name} ganha a Bola de Ouro e entra para a história como o melhor do mundo!"`);
    messages.push(`"Temporada mágica coroa ${player.name} com a Bola de Ouro."`);
  }

  // Titles & Relegation/Promotion
  const wonFinals = stat.finals?.filter(f => f.won) || [];
  const wonLeague = stat.leaguePosition === 1;

  if (player.isPro && stat.leaguePosition) {
    if (player.currentTeam.division === 2 && stat.leaguePosition <= 4) {
      if (wonLeague) {
        messages.push(`"Campeão! ${player.name} lidera o time rumo à elite com o título da ${stat.leagueName}."`);
      } else {
        messages.push(`"Objetivo alcançado! A equipe de ${player.name} sobe para a primeira divisão."`);
      }
    } else if (player.currentTeam.division !== 2 && stat.leaguePosition >= 16 && stat.leaguePosition <= 20) {
      messages.push(`"Decepção e rebaixamento. O time de ${player.name} teve uma péssima campanha e vai disputar a segunda divisão."`);
    } else if (wonLeague || wonFinals.length > 0) {
      if (wonLeague) {
        messages.push(`"${player.name} comandou a equipe na brilhante conquista do ${stat.leagueName}!"`);
      } else {
        messages.push(`"${player.name} foi fundamental na conquista da ${wonFinals[0].type}!"`);
      }
      
      if ((wonFinals.length >= 1 && wonLeague) || wonFinals.length > 1) {
        messages.push(`"Temporada vitoriosa! ${player.name} empilha taças com atuações de gala."`);
      }
    }
  } else if (wonLeague || wonFinals.length > 0) {
    if (wonLeague) {
      messages.push(`"${player.name} comandou a equipe na brilhante conquista do ${stat.leagueName}!"`);
    } else {
      messages.push(`"${player.name} foi fundamental na conquista da ${wonFinals[0].type}!"`);
    }
    
    if ((wonFinals.length >= 1 && wonLeague) || wonFinals.length > 1) {
      messages.push(`"Temporada vitoriosa! ${player.name} empilha taças com atuações de gala."`);
    }
  }

  // Defensive awards & standout defensive seasons
  if (stat.individualAwards && (stat.individualAwards.includes("Muralha da Temporada") || stat.individualAwards.includes("Muralha da Base"))) {
    messages.push(`"Intransponível! ${player.name} vira sinônimo de segurança na defesa e conquista a Muralha da Temporada."`);
    messages.push(`"Ninguém passa! ${player.name} anula os atacantes rivais e leva a Muralha da Temporada."`);
  } else if (stat.tackles > 150 && stat.cleanSheets > 10) {
    messages.push(`"Parede na defesa! ${player.name} foi decisivo evitando gols do adversário nesta temporada."`);
  }

  // Pro contract
  if (proContractOffer) {
    messages.push(`"A jovem promessa ${player.name} ganha sua primeira chance no time profissional."`);
    messages.push(`"${player.name} impressiona na base e sobe para os profissionais."`);
  }

  // Transfer
  if (transferOffer) {
    messages.push(`"Fim de ciclo? Gigantes de olho no talento de ${player.name}, o ${transferOffer.name} prepara proposta."`);
  }

  // Training/Attributes
  const attrTotal = Object.values(stat.attributeChanges || {}).reduce((a, b) => a + (b || 0), 0);
  if (attrTotal > 5 && !proContractOffer && !transferOffer && !wonLeague && wonFinals.length === 0 && stat.goals < 15) {
     messages.push(`"${player.name} focou nos treinos e os resultados físicos e técnicos já aparecem."`);
  }

  // Default or fallback
  if (messages.length === 0) {
    if (player.age < 20) {
      messages.push(`"${player.name} segue ganhando experiência. A torcida pede mais minutos em campo!"`);
    } else if (player.age > 33) {
      messages.push(`"A experiência de ${player.name} ajuda o time, mas o rendimento físico gera debates na imprensa."`);
    }
  }

  let chosenMessage = messages[Math.floor(Math.random() * messages.length)];
  return chosenMessage;
};

export const getReachedFinals = (player: Player, currentOvr: number, includeClubCups: boolean = true): string[] => {
  const finals: string[] = [];
  const relLevel = player.currentTeam.division === 2 ? 1 : getRelativeLevel(player.currentTeam);
  const teamPower = relLevel * 20 + currentOvr * 0.5;

  let cupName = "Copa Nacional";
  let leagueName = "Liga Nacional";
  let continentalName = "Copa Continental";
  let clubWCName = "Mundial de Clubes";

  if (player.isPro) {
    const country = player.currentTeam.country;
    const isDiv2 = player.currentTeam.division === 2;
    if (country === "BR") {
      cupName = "Copa do Brasil";
      leagueName = isDiv2 ? "Série B" : "Brasileirão";
      continentalName = "Copa Libertadores";
    } else if (country === "EN") {
      cupName = "FA Cup";
      leagueName = isDiv2 ? "Championship" : "Premier League";
      continentalName = "Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = isDiv2 ? "Serie B" : "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = isDiv2 ? "La Liga 2" : "La Liga";
      continentalName = "Champions League";
    } else if (country === "DE") {
      cupName = "DFB-Pokal";
      leagueName = isDiv2 ? "2. Bundesliga" : "Bundesliga";
      continentalName = "Champions League";
    } else if (country === "FR") {
      cupName = "Coupe de France";
      leagueName = isDiv2 ? "Ligue 2" : "Ligue 1";
      continentalName = "Champions League";
    } else if (country === "PT") {
      cupName = "Taça de Portugal";
      leagueName = isDiv2 ? "Liga Portugal 2" : "Primeira Liga";
      continentalName = "Champions League";
    } else if (country === "NL") {
      cupName = "KNVB Cup";
      leagueName = isDiv2 ? "Eerste Divisie" : "Eredivisie";
      continentalName = "Champions League";
    } else if (country === "US") {
      cupName = "US Open Cup";
      leagueName = isDiv2 ? "USL Championship" : "MLS";
      continentalName = "Copa Libertadores";
    } else if (country === "SA") {
      cupName = "King\'s Cup";
      leagueName = isDiv2 ? "First Division League" : "Saudi Pro League";
      continentalName = "AFC Champions League";
    } else if (country === "AR") {
      cupName = "Copa Argentina";
      leagueName = isDiv2 ? "Primera Nacional" : "Liga Profesional Argentina";
      continentalName = "Copa Libertadores";
    } else if (country === "UY") {
      cupName = "Copa Uruguay";
      leagueName = isDiv2 ? "Segunda División" : "Primera División Uruguaya";
      continentalName = "Copa Libertadores";
    }

    if (includeClubCups && !isDiv2) {
      if (relLevel === 5 && Math.random() * 100 < teamPower * 0.15) {
        finals.push(cupName);
      }
      if (relLevel === 5 && Math.random() * 100 < (teamPower - 70) * 0.25) {
        finals.push(continentalName);
        if (Math.random() > 0.5 && Math.random() > 0.3) {
          finals.push(clubWCName);
        }
      }
    }
  } else {
    // Torneio de Base
    if (Math.random() * 100 < teamPower * 0.25) {
      finals.push("Torneio de Base");
    }
  }

  const expectedOvr = player.currentTeam.level * 15 + 35;
  const performanceRatio = Math.min(1.5, Math.max(0.5, currentOvr / expectedOvr));

  const estimatedMatches = 30;
  const { goals, assists, tackles, cleanSheets } = generateSeasonMatchStats(player, estimatedMatches, performanceRatio);
  const callScore = getNationalCallScore(goals, assists, tackles, cleanSheets);

  if (includeClubCups && currentOvr > 78 && callScore >= 15 && Math.random() > 0.4) {
    if (player.age % 4 === 0 && Math.random() > 0.7) {
      finals.push("Copa do Mundo");
    } else if (player.age % 4 === 2 && Math.random() > 0.6) {
      finals.push(getNationalContinentalCup(player.nationality));
    }
  }

  return finals;
};

export const simulateSeason = (
  player: Player,
  prePlayedFinals?: { type: string; won: boolean; goals?: number; assists?: number }[],
  // Quando a liga do jogador foi simulada rodada a rodada (Fase 2 do modo
  // História), passamos aqui os números REAIS apurados jogo a jogo, em vez
  // de deixar o restante da função "inventar" partidas/gols/posição via
  // sorteio estatístico.
  leagueSeasonOverride?: {
    matches: number;
    goals: number;
    assists: number;
    leaguePosition: number;
    manOfTheMatch?: number;
    coachTrust?: number;
  }
): { baseUpdatedPlayer: Player; seasonStat: SeasonStat; transfer?: Team; earnedPoints: number; proContractOffer?: boolean } => {
  if (player.currentTeam.id === "none") {
    const stat: SeasonStat = {
      age: player.age,
      team: { id: "none", name: "Sem Clube", level: 0, country: "BR" },
      matches: 0,
      goals: 0,
      assists: 0,
      tackles: 0,
      cleanSheets: 0,
      rating: calculateOverall(player.attributes, player.position),
      attributeChanges: {},
      finals: [],
      pressMessage: `"${player.name} ficou a temporada toda sem clube."`
    };
    
    const healthDecline = getSeasonHealthDecline(player.age);
    const newHealth = Math.max(0, Math.min(100, player.personal.health - healthDecline));
    
    const baseUpdatedPlayer: Player = {
      ...player,
      age: player.age + 1,
      retired: player.age >= 56,
      contractYears: 0,
      personal: {
        ...player.personal,
        health: newHealth,
        mood: Math.max(0, player.personal.mood - 15),
      }
    };
    
    return {
      baseUpdatedPlayer,
      seasonStat: stat,
      earnedPoints: 0,
    };
  }

  const currentOvr = calculateOverall(player.attributes, player.position);

  const healthDecline = getSeasonHealthDecline(player.age);
  let newHealth = Math.max(0, Math.min(100, player.personal.health - healthDecline));

  const BASELINE_INJURY_CHANCE = 1; // risco mínimo mesmo com 100% de Saúde
  const injuryChance = Math.min(85, BASELINE_INJURY_CHANCE + (100 - newHealth) * 0.65);

  let injured = false;
  let injuryDays = 0;
  let seasonEndingInjury = false;

  if (newHealth <= 0) {
    // Saúde chegou a 0% - lesão gravíssima que tira o jogador da temporada inteira.
    injured = true;
    seasonEndingInjury = true;
    injuryDays = 60;
  } else if (Math.random() * 100 < injuryChance) {
    injured = true;
    // Quanto pior a Saúde, mais longa a recuperação (4 a 60 dias).
    const severity = (100 - newHealth) / 100; // 0 (saudável) a 1 (esgotado)
    const maxDaysForSeverity = Math.round(12 + severity * 48); // até 60
    injuryDays = randomInt(4, Math.max(4, maxDaysForSeverity));

    newHealth = Math.max(0, newHealth - randomInt(5, 15));
    if (newHealth <= 0) {
      seasonEndingInjury = true;
      injuryDays = 60;
    }
  }

  // OVR esperado com base no nível do time e na posição do jogador, para calcular a taxa de desempenho
  const expectedOvr = player.currentTeam.level * 15 + 35; 
  let performanceRatio = Math.min(1.5, Math.max(0.5, currentOvr / expectedOvr));

  let finals: { type: string; won: boolean; goals?: number; assists?: number }[] = prePlayedFinals || [];
  
  if (!prePlayedFinals) {
    const reached = getReachedFinals(player, currentOvr);
    finals = reached.map(f => ({ type: f, won: Math.random() > 0.5, goals: 0, assists: 0 }));
  }

  if (seasonEndingInjury) {
    finals = [];
  }

  let cupName = "Copa Nacional";
  let leagueName = "Liga Nacional";
  let continentalName = "Copa Continental";
  let clubWCName = "Mundial de Clubes";
  let natContCup = getNationalContinentalCup(player.nationality);

  if (player.isPro) {
    const country = player.currentTeam.country;
    const isDiv2 = player.currentTeam.division === 2;
    if (country === "BR") {
      cupName = "Copa do Brasil";
      leagueName = isDiv2 ? "Série B" : "Brasileirão";
      continentalName = "Copa Libertadores";
    } else if (country === "EN") {
      cupName = "FA Cup";
      leagueName = isDiv2 ? "Championship" : "Premier League";
      continentalName = "Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = isDiv2 ? "Serie B" : "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = isDiv2 ? "La Liga 2" : "La Liga";
      continentalName = "Champions League";
    } else if (country === "DE") {
      cupName = "DFB-Pokal";
      leagueName = isDiv2 ? "2. Bundesliga" : "Bundesliga";
      continentalName = "Champions League";
    } else if (country === "FR") {
      cupName = "Coupe de France";
      leagueName = isDiv2 ? "Ligue 2" : "Ligue 1";
      continentalName = "Champions League";
    } else if (country === "PT") {
      cupName = "Taça de Portugal";
      leagueName = isDiv2 ? "Liga Portugal 2" : "Primeira Liga";
      continentalName = "Champions League";
    } else if (country === "NL") {
      cupName = "KNVB Cup";
      leagueName = isDiv2 ? "Eerste Divisie" : "Eredivisie";
      continentalName = "Champions League";
    } else if (country === "US") {
      cupName = "US Open Cup";
      leagueName = isDiv2 ? "USL Championship" : "MLS";
      continentalName = "Copa Libertadores";
    } else if (country === "SA") {
      cupName = "King\'s Cup";
      leagueName = isDiv2 ? "First Division League" : "Saudi Pro League";
      continentalName = "AFC Champions League";
    } else if (country === "AR") {
      cupName = "Copa Argentina";
      leagueName = isDiv2 ? "Primera Nacional" : "Liga Profesional Argentina";
      continentalName = "Copa Libertadores";
    } else if (country === "UY") {
      cupName = "Copa Uruguay";
      leagueName = isDiv2 ? "Segunda División" : "Primera División Uruguaya";
      continentalName = "Copa Libertadores";
    }
  }

  let totalTeamMatches = 0;
  let nationalTeamCall = false;

  if (player.isPro) {
    const isDiv2 = player.currentTeam.division === 2;
    const relLevel = isDiv2 ? 1 : getRelativeLevel(player.currentTeam);
    
    totalTeamMatches += 38; // League
    
    if (finals.some(f => f.type === cupName)) {
      totalTeamMatches += 7;
    } else {
      totalTeamMatches += randomInt(3, 6);
    }
    
    if (finals.some(f => f.type === continentalName)) {
      totalTeamMatches += 13;
    } else if (!isDiv2 && relLevel >= 4) {
      totalTeamMatches += randomInt(3, 12);
    }
    
    if (finals.some(f => f.type === clubWCName)) {
      totalTeamMatches += 7;
    } else if (!isDiv2 && relLevel === 5 && Math.random() > 0.8) {
      totalTeamMatches += randomInt(3, 6);
    }
    
    const tempMatches = 38;
    const tempGoals = Math.round(tempMatches * 0.4 * performanceRatio);
    const tempAssists = Math.round(tempMatches * 0.2 * performanceRatio);
    const callScore = getNationalCallScore(tempGoals, tempAssists, 0, 0);
    
    if (!seasonEndingInjury && (finals.some(f => f.type === "Copa do Mundo" || f.type === natContCup) || (currentOvr > 78 && callScore >= 15 && Math.random() > 0.4))) {
      nationalTeamCall = true;
    }
    
    if (nationalTeamCall) {
      if (player.age % 4 === 0) {
        if (finals.some(f => f.type === "Copa do Mundo")) {
          totalTeamMatches += 8;
        } else {
          totalTeamMatches += randomInt(3, 7);
        }
      } else if (player.age % 4 === 2) {
        if (finals.some(f => f.type === natContCup)) {
          totalTeamMatches += 7;
        } else {
          totalTeamMatches += randomInt(3, 6);
        }
      } else {
        totalTeamMatches += randomInt(2, 6);
      }
    }
  } else {
    totalTeamMatches = randomInt(20, 30);
    if (finals.some(f => f.type === "Torneio de Base")) {
      totalTeamMatches += 5;
    }
  }

  let matches = leagueSeasonOverride
    ? leagueSeasonOverride.matches
    : Math.round(totalTeamMatches * Math.min(1, Math.max(0.6, performanceRatio)));

  let isBenched = false;
  if (player.isPro) {
    const minOvrForStarter: Record<number, number> = {
      1: 64,
      2: 71,
      3: 78,
      4: 83,
      5: 88
    };
    const teamLvl = player.currentTeam.level;
    const requiredOvr = minOvrForStarter[teamLvl] || 64;

    if (getEffectiveSquadRole(player.coachTrust) === "STARTER") {
      isBenched = false; // Always plays
    } else if (currentOvr < requiredOvr) {
      isBenched = true;
      if (!leagueSeasonOverride) matches = Math.round(matches * 0.25);
      performanceRatio = performanceRatio * 0.8;
    }
  }

  let isolated = false;
  let depressed = false;

  if (player.mode !== "QUICK") {
    if (player.personal.mood === 0) {
      depressed = true;
      if (!leagueSeasonOverride) matches = 0;
      performanceRatio = 0;
    } else if (player.personal.mood < 50) {
      isolated = true;
      const moodFactor = player.personal.mood / 50;
      if (!leagueSeasonOverride) matches = Math.round(matches * moodFactor);
      performanceRatio = performanceRatio * (0.6 + moodFactor * 0.4);
    }
  }

  if (injured) {
    const matchesLost = seasonEndingInjury
      ? matches
      : Math.round(totalTeamMatches * Math.min(1, injuryDays / 300));
    if (!leagueSeasonOverride) matches = Math.max(0, matches - matchesLost);
    performanceRatio = performanceRatio * (0.5 + Math.random() * 0.2);
  }

  let { goals, assists, tackles, cleanSheets } = generateSeasonMatchStats(player, matches, performanceRatio);
  if (leagueSeasonOverride) {
    // Números reais apurados jogo a jogo na liga, em vez de estimativa estatística.
    goals = leagueSeasonOverride.goals;
    assists = leagueSeasonOverride.assists;
  }
  const cleanSheetRateThisSeason = matches > 0 ? cleanSheets / matches : 0;

  let finalBonusGoals = 0;
  let finalBonusAssists = 0;
  finals.forEach(f => {
    finalBonusGoals += f.goals || 0;
    finalBonusAssists += f.assists || 0;
  });

  goals += finalBonusGoals;
  assists += finalBonusAssists;

  const getFinalGoals = (type: string) => {
    return finals.find(x => x.type === type)?.goals || 0;
  };

  let leaguePosition: number | undefined;

  if (leagueSeasonOverride) {
    leaguePosition = leagueSeasonOverride.leaguePosition;
  } else if (player.isPro) {
    let rand = Math.random();
    // Factor in player performance. High performanceRatio (e.g. 1.2) decreases rand (better chance of winning)
    // Low performanceRatio (e.g. 0.8) increases rand (worse chance)
    rand -= (performanceRatio - 1) * 0.2;
    rand = Math.max(0, Math.min(1, rand));

    if (player.currentTeam.division === 2) {
      leaguePosition = rand < 0.15 ? 1 : rand < 0.35 ? randomInt(2, 4) : rand < 0.7 ? randomInt(5, 12) : randomInt(13, 20);
    } else {
      const relLevel = getRelativeLevel(player.currentTeam);
      if (relLevel === 5) {
        leaguePosition = rand < 0.4 ? 1 : rand < 0.7 ? 2 : rand < 0.9 ? 3 : randomInt(4, 6);
      } else if (relLevel === 4) {
        leaguePosition = rand < 0.3 ? 2 : rand < 0.7 ? randomInt(3, 6) : randomInt(7, 10);
      } else if (relLevel === 3) {
        leaguePosition = rand < 0.2 ? randomInt(4, 7) : rand < 0.6 ? randomInt(8, 12) : randomInt(13, 16);
      } else if (relLevel === 2) {
        leaguePosition = rand < 0.1 ? randomInt(8, 12) : rand < 0.4 ? randomInt(13, 16) : randomInt(17, 20);
      } else {
        leaguePosition = rand < 0.1 ? randomInt(13, 16) : randomInt(17, 20);
      }
    }
  }

  // Individual Awards
  const individualAwards: string[] = [];
  let ballonDorCandidates: any[] = [];
  
  const getArtilheiroString = (competition: string) => {
    const masculine = ["Brasileirão", "Mundial de Clubes", "Torneio de Base"];
    if (masculine.includes(competition)) {
      return `Artilheiro do ${competition}`;
    }
    return `Artilheiro da ${competition}`;
  };

  if (player.isPro) {
    let g = goals - finalBonusGoals;
    const isDiv2 = player.currentTeam.division === 2;
    
    // Copa do mundo de Seleção
    let wcGoals = getFinalGoals("Copa do Mundo");
    if (finals.some(f => f.type === "Copa do Mundo") || (player.age % 4 === 0 && nationalTeamCall)) {
      let simG = Math.floor(g * (Math.random() * 0.2 + 0.1));
      wcGoals += simG;
      g -= simG;
    }
    
    // Copa continental de Seleção
    let natContCup = getNationalContinentalCup(player.nationality);
    let nationalContinentalGoals = getFinalGoals(natContCup);
    if (finals.some(f => f.type === natContCup) || (player.age % 4 === 2 && nationalTeamCall)) {
      let simG = Math.floor(g * (Math.random() * 0.2 + 0.1));
      nationalContinentalGoals += simG;
      g -= simG;
    }
    
    // Mundial de clubes
    let clubWCGoals = getFinalGoals(clubWCName);
    if (finals.some(f => f.type === clubWCName)) {
      let simG = Math.floor(g * (Math.random() * 0.15 + 0.05));
      clubWCGoals += simG;
      g -= simG;
    }
    
    // Copa Continental
    let continentalGoals = getFinalGoals(continentalName);
    if (finals.some(f => f.type === continentalName) || (!isDiv2 && getRelativeLevel(player.currentTeam) >= 4)) {
      let simG = Math.floor(g * (Math.random() * 0.25 + 0.1));
      continentalGoals += simG;
      g -= simG;
    }
    
    // Copa Nacional
    let cupGoals = getFinalGoals(cupName);
    let simCupG = Math.floor(g * (Math.random() * 0.2 + 0.1));
    cupGoals += simCupG;
    g -= simCupG;
    
    let leagueGoals = g;

    if (isDiv2 && leagueGoals >= 20) {
      individualAwards.push(getArtilheiroString(leagueName));
    } else if (!isDiv2 && leagueGoals >= 25) {
      individualAwards.push(getArtilheiroString(leagueName));
    }
    
    if (cupGoals >= 10) individualAwards.push(getArtilheiroString(cupName));
    if (continentalGoals >= 10) individualAwards.push(getArtilheiroString(continentalName));
    if (clubWCGoals >= 8) individualAwards.push(getArtilheiroString(clubWCName));
    if (nationalContinentalGoals >= 10) individualAwards.push(getArtilheiroString(natContCup));
    if (wcGoals >= 10) individualAwards.push("Artilheiro da Copa do Mundo");

    // Chuteira de Ouro (European Golden Shoe) é prêmio exclusivo das principais
    // ligas europeias - não deve valer para Brasileirão, MLS, Saudi Pro League etc.
    const GOLDEN_SHOE_COUNTRIES = ["EN", "ES", "IT", "DE", "FR", "PT", "NL"];
    if (!isDiv2 && GOLDEN_SHOE_COUNTRIES.includes(player.currentTeam.country) && goals >= 35 && Math.random() > 0.3) {
      individualAwards.push("Chuteira de Ouro");
    }

    // Muralha da Temporada - defensive counterpart to the top-scorer awards,
    // for ZAG/LAT/VOL who dominate through tackles and clean sheets instead.
    if (
      DEFENSIVE_POSITIONS.includes(player.position) &&
      cleanSheetRateThisSeason >= 0.4 &&
      tackles >= 70 &&
      Math.random() > 0.35
    ) {
      individualAwards.push("Muralha da Temporada");
    }

    // Títulos e destaques para prêmios individuais
    const wonWC = finals.some(f => f.type === "Copa do Mundo" && f.won);
    const wcTopScorer = individualAwards.includes("Artilheiro da Copa do Mundo");
    const wonCL = finals.some(f => f.type === continentalName && f.won);
    const clTopScorer = individualAwards.includes(getArtilheiroString(continentalName));
    const wonLeague = leaguePosition === 1;

    // Rei das Américas
    const isAmericasClub = ["BR", "AR", "UY"].includes(player.currentTeam.country);
    const isAmericasNationality = AMERICAN_NATIONALITIES.includes(player.nationality);
    const isReiDasAmericasEligible = !isDiv2 && (isAmericasClub || isAmericasNationality);

    if (isReiDasAmericasEligible) {
      const wonLibertadores = wonCL && (isAmericasClub || continentalName === "Copa Continental");
      const wonCopaAmerica = finals.some(f => (f.type.includes("Copa América") || f.type === "Copa Continental (Seleção)") && f.won);
      const wonNationalLeague = leaguePosition === 1;
      const wonNationalCup = finals.some(f => f.type === cupName && f.won);
      const totalGA = goals + assists;

      let wonReiDasAmericas = false;

      if (wonLibertadores) {
        if (clTopScorer || totalGA >= 15 || currentOvr >= 75) {
          wonReiDasAmericas = Math.random() > 0.15; // 85% chance
        } else if (DEFENSIVE_POSITIONS.includes(player.position) && (cleanSheetRateThisSeason >= 0.35 || tackles >= 60)) {
          wonReiDasAmericas = Math.random() > 0.2; // 80% chance
        } else {
          wonReiDasAmericas = Math.random() > 0.4; // 60% chance
        }
      } else if (wonCopaAmerica && totalGA >= 8) {
        wonReiDasAmericas = Math.random() > 0.3; // 70% chance
      } else if ((wonNationalLeague || wonNationalCup) && totalGA >= 22 && currentOvr >= 76) {
        wonReiDasAmericas = Math.random() > 0.5; // 50% chance
      } else if (isAmericasClub && totalGA >= 28 && currentOvr >= 78) {
        wonReiDasAmericas = Math.random() > 0.6; // 40% chance
      }

      if (wonReiDasAmericas) {
        individualAwards.push("Rei das Américas");
      }
    }

    // Melhor da Europa
    const isEuropeanClub = ["EN", "ES", "IT", "DE", "FR", "PT", "NL"].includes(player.currentTeam.country);
    const isEuropeanNationality = EUROPEAN_NATIONALITIES.includes(player.nationality);
    const isMelhorDaEuropaEligible = !isDiv2 && (isEuropeanClub || isEuropeanNationality);

    if (isMelhorDaEuropaEligible) {
      const wonChampionsLeague = wonCL && (isEuropeanClub || continentalName === "Champions League");
      const wonEurocopa = finals.some(f => (f.type.includes("Eurocopa") || f.type === "Copa Continental (Seleção)") && f.won);
      const wonNationalLeague = leaguePosition === 1;
      const wonNationalCup = finals.some(f => f.type === cupName && f.won);
      const totalGA = goals + assists;

      let wonMelhorDaEuropa = false;

      if (wonChampionsLeague) {
        if (clTopScorer || totalGA >= 20 || currentOvr >= 82) {
          wonMelhorDaEuropa = Math.random() > 0.15; // 85% chance
        } else if (DEFENSIVE_POSITIONS.includes(player.position) && (cleanSheetRateThisSeason >= 0.4 || tackles >= 70)) {
          wonMelhorDaEuropa = Math.random() > 0.2; // 80% chance
        } else {
          wonMelhorDaEuropa = Math.random() > 0.4; // 60% chance
        }
      } else if (wonEurocopa && totalGA >= 8) {
        wonMelhorDaEuropa = Math.random() > 0.25; // 75% chance
      } else if ((wonNationalLeague || wonNationalCup) && totalGA >= 30 && currentOvr >= 83) {
        wonMelhorDaEuropa = Math.random() > 0.5; // 50% chance
      } else if (isEuropeanClub && totalGA >= 38 && currentOvr >= 85) {
        wonMelhorDaEuropa = Math.random() > 0.6; // 40% chance
      }

      if (wonMelhorDaEuropa) {
        individualAwards.push("Melhor da Europa");
      }
    }

    // Bola de Ouro
    let wonBallonDor = false;
    
    if (wonWC && wcTopScorer) {
      wonBallonDor = true;
    } else if (wonCL && clTopScorer && currentOvr >= 85) {
      wonBallonDor = Math.random() > 0.1; // 90% chance
    } else if (currentOvr >= 90 && goals + assists >= 40 && (wonWC || wonCL)) {
      wonBallonDor = Math.random() > 0.2;
    } else if (currentOvr >= 92 && goals + assists >= 50) {
      wonBallonDor = Math.random() > 0.1;
    } else if (currentOvr >= 88 && goals + assists >= 35 && wonLeague) {
      wonBallonDor = Math.random() > 0.6;
    }

    // Exceptional zagueiros can also win the Bola de Ouro on defensive
    // merit alone - mirrors real cases like a dominant, title-winning
    // center-back season, rather than requiring goal contributions.
    if (!wonBallonDor && player.position === "ZAG" && currentOvr >= 87) {
      const exceptionalDefender = cleanSheetRateThisSeason >= 0.55 && tackles >= 120;
      const majorTitleWon = wonWC || wonCL;
      if (exceptionalDefender && majorTitleWon) {
        wonBallonDor = Math.random() > 0.5;
      }
    }


    // Gerar ranking da Bola de Ouro se o jogador for candidato (top 5 ou se ganhou)
    // OVR alto, gols, assistências, prêmios, etc.
    let isCandidate = wonBallonDor;
    if (!wonBallonDor && currentOvr >= 85) {
        if (goals + assists >= 25 || cleanSheetRateThisSeason >= 0.4) {
            isCandidate = Math.random() > 0.4; // 60% chance de ser candidato
        }
    }

    if (isCandidate) {
        const competitors = [
            { name: "Neto Santos", club: "Real Madrid", country: "Brasil", ovr: 94, score: 91 },
            { name: "Brendo Silva", club: "Real Madrid", country: "Brasil", ovr: 94, score: 91 },
            { name: "Bernardo Couto", club: "M. City", country: "Portugal", ovr: 92, score: 92 },
            { name: "Harry Glow", club: "Real Madrid", country: "Inglaterra", ovr: 91, score: 90 },
            { name: "Robin Backroom", club: "Bayern München", country: "Inglaterra", ovr: 91, score: 88 },
            { name: "Phil Lend", club: "M. City", country: "Inglaterra", ovr: 89, score: 86 },
            { name: "Natan Luwis", club: "M. City", country: "Espanha", ovr: 90, score: 87 },
            { name: "Renan Sultado", club: "Arsenal", country: "Itália", ovr: 94, score: 84 },
            { name: "Luiz Pilotti", club: "Real Madrid", country: "Itália", ovr: 94, score: 91 },
            { name: "Laro Aldo", club: "Barcelona", country: "Espanha", ovr: 93, score: 82 },
            { name: "Flop Bouer", club: "B. Leverkusen", country: "Alemanha", ovr: 92, score: 85 },
            { name: "Guilherme Damas", club: "Corinthias", country: "Brasil", ovr: 90, score: 91 },
            { name: "Thiago Luiz", club: "Palmeiras", country: "Brasil", ovr: 90, score: 91 },
            { name: "Miguel de Souza", club: "Cruzeiro", country: "Brasil", ovr: 90, score: 91 },
        ];
        
        // Shuffle and pick 4
        let shuffled = competitors.sort(() => 0.5 - Math.random());
        let top4 = shuffled.slice(0, 4).map(c => ({...c, chance: Math.floor(Math.random() * 20) + 10}));
        
        // Calcular score do player
        let playerScore = (currentOvr) + (goals * 0.5) + (assists * 0.3) + (wonWC ? 20 : 0) + (wonCL ? 15 : 0) + (wonLeague ? 10 : 0);
        if (player.position === "ZAG" && cleanSheetRateThisSeason >= 0.4) playerScore += (tackles * 0.1);
        
        const myCandidate = {
            name: player.name,
            club: player.currentTeam.name,
            country: player.nationality,
            isMe: true,
            score: playerScore,
            chance: wonBallonDor ? (Math.floor(Math.random() * 30) + 40) : (Math.floor(Math.random() * 20) + 5)
        };
        
        let allCandidates = [...top4, myCandidate];
        
        // Ajustar chances para somar 100% ou perto disso e fazer sentido
        allCandidates.sort((a, b) => b.chance - a.chance);
        
        // Se wonBallonDor, garantir que o player é o #1
        if (wonBallonDor) {
            allCandidates = allCandidates.filter(c => c.name !== player.name);
            allCandidates.unshift(myCandidate);
        } else {
            // Se não ganhou, garantir que o player não está em #1 (ou pelo menos chance menor que o primeiro)
            allCandidates.sort((a, b) => b.chance - a.chance);
            if (allCandidates[0].name === player.name) {
                let temp = allCandidates[0];
                allCandidates[0] = allCandidates[1];
                allCandidates[1] = temp;
                
                // swap chances
                let tempC = allCandidates[0].chance;
                allCandidates[0].chance = allCandidates[1].chance + 10;
                allCandidates[1].chance = tempC;
            }
        }
        
        // recalcular total de chances para ser relativo se quiser, ou só deixar fixo.
        const totalChance = allCandidates.reduce((sum, c) => sum + c.chance, 0);
        allCandidates.forEach(c => {
            c.chance = Math.round((c.chance / totalChance) * 100);
        });

        if (wonBallonDor) {
          individualAwards.push("Bola de Ouro");
        }
        
        ballonDorCandidates = allCandidates;
    }

  } else {
    if (goals >= 15 && Math.random() > 0.4) {
      individualAwards.push(getArtilheiroString("Torneio de Base"));
    }
    if (
      DEFENSIVE_POSITIONS.includes(player.position) &&
      cleanSheetRateThisSeason >= 0.35 &&
      tackles >= 40 &&
      Math.random() > 0.4
    ) {
      individualAwards.push("Muralha da Base");
    }
  }

  // Growth & Decline
  let { points: basePoints, decline } = generateGrowthPoints(player.age);
  
  if (getPlayerTitle(player.age, currentOvr) === "Jovem Promessa") {
    basePoints *= 2;
  }
  
  let finalPoints = 0;
  
  const artilheiroCount = individualAwards.filter(a => a.includes("Artilheiro")).length;
  finalPoints += artilheiroCount * 2;
  
  const muralhaCount = individualAwards.filter(a => a.includes("Muralha")).length;
  finalPoints += muralhaCount * 2;
  
  const chuteiraCount = individualAwards.filter(a => a.includes("Chuteira de Ouro")).length;
  finalPoints += chuteiraCount * 2;

  const reiDasAmericasCount = individualAwards.filter(a => a === "Rei das Américas").length;
  finalPoints += reiDasAmericasCount * 3;

  const melhorDaEuropaCount = individualAwards.filter(a => a === "Melhor da Europa").length;
  finalPoints += melhorDaEuropaCount * 3;

  let wonWC = false;
  let wonCL = false;

  finals.forEach(f => {
    if (f.won) {
      finalPoints += 4; // Campeão
      if (f.type === "Copa do Mundo") wonWC = true;
      if (f.type === "Champions League") wonCL = true;
    }
  });

  if (player.isPro && leaguePosition === 1) {
    finalPoints += 2; // Campeão da liga
  }

  let points = basePoints + finalPoints;

  if (wonWC) {
    points = Math.round(points * 1.3);
  }
  if (wonCL) {
    points = Math.round(points * 1.2);
  }

  const newAttributes = applyGrowth(player.attributes, decline);

  let moodChange = 0;

  for (const f of finals) {
    if (f.won) {
      moodChange += 10;
    } else {
      moodChange -= 5;
    }
  }

  const newFamily = player.relationships.family.map(f => ({
    ...f,
    affinity: Math.max(0, f.affinity - randomInt(1, 3))
  }));

  const newFriends = player.relationships.friends.map(f => ({
    ...f,
    affinity: Math.max(0, f.affinity - randomInt(1, 3))
  }));

  let newGirlfriend = player.relationships.girlfriend ? { ...player.relationships.girlfriend } : null;
  let newChildren = player.relationships.children ? [...player.relationships.children] : [];
  let babyBornMessage: string | null = null;

  if (newGirlfriend) {
    newGirlfriend.affinity = Math.max(0, newGirlfriend.affinity - randomInt(1, 3));
    if (newGirlfriend.pregnant) {
      const babyNames = ["Lucas", "Gabriel", "Matheus", "Arthur", "Bernardo", "Sophia", "Isabella", "Alice", "Helena", "Manuela"];
      const childName = babyNames[Math.floor(Math.random() * babyNames.length)];
      const newChild: Child = {
        id: `child_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: childName,
        motherName: newGirlfriend.name,
        bornAtPlayerAge: player.age,
      };
      newChildren.push(newChild);
      newGirlfriend.pregnant = false;
      babyBornMessage = `Chegou! ${childName} nasceu, parabéns aos papais! 👶🎉❤️`;
    }
  }

  const newRelationships = {
    family: newFamily,
    friends: newFriends,
    girlfriend: newGirlfriend,
    children: newChildren,
  };

  // Transfer Logic based on CURRENT OVR
  let transfer: Team | undefined;
  let proContractOffer = false;

  if (!player.isPro) {
    if (player.age + 1 >= 16 && currentOvr >= 59) {
      proContractOffer = true;
    }
  } else {
    if (currentOvr > player.currentTeam.level * 12 + 45) {
      const betterTeams = TEAMS.filter((t) => t.level === player.currentTeam.level + 1 || t.level === player.currentTeam.level + 2);
      if (betterTeams.length > 0 && Math.random() > 0.3) {
         transfer = betterTeams[randomInt(0, betterTeams.length - 1)];
      }
    } else if (currentOvr > 85 && player.currentTeam.level < 5) {
        const topTeams = TEAMS.filter((t) => t.level === 5);
        if (Math.random() > 0.2) {
            transfer = topTeams[randomInt(0, topTeams.length - 1)];
        }
    }
  }

  const calculatedMotm = leagueSeasonOverride?.manOfTheMatch ?? Math.round(goals * 0.35 + assists * 0.2 + (performanceRatio >= 1.2 ? 2 : 0));

  // Sem override de liga rodada a rodada (Modo Rápido), não há nota de partida
  // individual — aproxima a variação de confiança pelo desempenho da temporada
  // como um todo. Com override, o valor já vem calculado partida a partida
  // pelo LeagueSeasonPanel e só precisa ser applied aqui.
  const newCoachTrust = leagueSeasonOverride?.coachTrust !== undefined
    ? leagueSeasonOverride.coachTrust
    : Math.max(0, Math.min(100, (player.coachTrust ?? 50) + Math.round((performanceRatio - 1) * 20)));

  const seasonStatObj: SeasonStat = {
    age: player.age,
    team: player.currentTeam,
    matches,
    goals,
    assists,
    tackles,
    cleanSheets,
    manOfTheMatch: Math.max(0, calculatedMotm),
    rating: currentOvr,
    attributeChanges: decline,
    nationalTeamCall,
    finals,
    individualAwards,
    ballonDorCandidates,
    injured,
    injuryDays: injured ? injuryDays : undefined,
    seasonEndingInjury: seasonEndingInjury || undefined,
    isBenched: isBenched || undefined,
    isolated,
    depressed,
    leaguePosition,
    leagueName: player.isPro ? leagueName : undefined,
  };

  let updatedTeam = { ...player.currentTeam };
  if (player.isPro && leaguePosition) {
    if (updatedTeam.division === 2) {
      if (leaguePosition >= 1 && leaguePosition <= 4) {
        updatedTeam.division = 1;
        updatedTeam.level = Math.min(5, updatedTeam.level + 1);
      }
    } else {
      if (leaguePosition >= 16 && leaguePosition <= 20) {
        updatedTeam.division = 2;
        updatedTeam.level = Math.max(1, updatedTeam.level - 1);
      }
    }
  }

  const baseUpdatedPlayer: Player = {
    ...player,
    currentTeam: updatedTeam,
    coachTrust: newCoachTrust,
    squadRole: getEffectiveSquadRole(newCoachTrust),
    age: player.age + 1,
    attributes: newAttributes,
    relationships: newRelationships,
    history: player.history, // history is not updated yet, will be appended after point distribution
    retired: player.age >= 56,
    contractYears: player.isPro ? Math.max(0, (player.contractYears || 0) - 1) : 0,
    personal: {
      ...player.personal,
      health: newHealth,
      mood: Math.min(100, Math.max(0, player.personal.mood + moodChange)),
    },
  };

  let finalUpdatedPlayer: Player = baseUpdatedPlayer;

  // Limpa o chat de cada pessoa antes de sortear a mensagem da nova
  // temporada (mesmo padrão que já era feito só com o treinador) - assim o
  // chat sempre mostra só a conversa atual, em vez de acumular mensagens de
  // temporadas passadas junto com as novas.
  if (finalUpdatedPlayer.chats) {
    finalUpdatedPlayer.chats = { ...finalUpdatedPlayer.chats };
    delete finalUpdatedPlayer.chats["treinador"];
    for (const member of newFamily) delete finalUpdatedPlayer.chats[member.id];
    for (const friend of newFriends) delete finalUpdatedPlayer.chats[friend.id];
    if (newGirlfriend) delete finalUpdatedPlayer.chats[newGirlfriend.id];
  }

  if (babyBornMessage && newGirlfriend) {
    finalUpdatedPlayer = addMessageToChat(finalUpdatedPlayer, newGirlfriend.id, babyBornMessage);
  }

  for (const member of newFamily) {
    if (Math.random() < 0.30) {
      const msgs = member.role === "Mãe"
        ? ["Oi meu filho! Como você está? Não se esqueça de se alimentar bem! ❤️", "Saudade de você, meu querido. Se cuida bastante aí! ❤️", "Vi suas notícias na TV, estou tão orgulhosa de você! ❤️"]
        : member.role === "Pai"
        ? ["E aí campeão! Continua trabalhando duro nos treinos.", "Acompanhei a temporada, bom trabalho! Mantenha o foco.", "Futebol exige dedicação diária. Orgulho de ver seu esforço!"]
        : ["Fala mano! Me manda uma camisa do time!", "E aí garoto, quando vem pra cá pra gente jogar?", "Acompanhando seus jogos aqui, brabo demais!"];
      const text = msgs[Math.floor(Math.random() * msgs.length)];
      finalUpdatedPlayer = addMessageToChat(finalUpdatedPlayer, member.id, text);
    }
  }

  for (const friend of newFriends) {
    if (Math.random() < 0.30) {
      const msgs = [
        "Fala craque! Que temporada hein, tá jogando muito!",
        "E aí mano, quando tiver de folga bora marcar de se ver!",
        "Tava assistindo seu jogo no bar ontem, que partidaço!",
        "Sucesso sempre meu irmão, tamo junto!"
      ];
      const text = msgs[Math.floor(Math.random() * msgs.length)];
      finalUpdatedPlayer = addMessageToChat(finalUpdatedPlayer, friend.id, text);
    }
  }

  if (newGirlfriend && Math.random() < 0.30) {
    const msgs = newGirlfriend.married
      ? [
          "Saudades de você em casa, meu amor! Volta logo! ❤️",
          "Mais uma temporada juntos, tenho tanto orgulho da nossa família! 💍❤️",
          "Boa sorte nos próximos desafios, estou sempre ao seu lado! ❤️",
          "Te amo demais, meu amor! Se cuida nesses treinos! 🥰"
        ]
      : [
          "Estou com muitas saudades de você, meu amor! ❤️",
          "Muito orgulho de te ver brilhando tanto em campo! Te amo! 🥰",
          "Não vejo a hora da gente ter um tempinho juntos! ❤️",
          "Estou sempre torcendo por você! 🥰"
        ];
    const text = msgs[Math.floor(Math.random() * msgs.length)];
    finalUpdatedPlayer = addMessageToChat(finalUpdatedPlayer, newGirlfriend.id, text);
  }

  return { baseUpdatedPlayer: finalUpdatedPlayer, seasonStat: seasonStatObj, transfer, earnedPoints: points, proContractOffer };
};

// -----------------------------------------------------------------------------
// Propostas de fim de contrato
// -----------------------------------------------------------------------------
// Quando o contrato do jogador chega ao fim, ele não recebe apenas a
// possibilidade de renovar com o próprio clube: dependendo dos prêmios
// individuais conquistados na carreira e do OVR atual, outros clubes também
// podem entrar na disputa, oferecendo entre 1 e 5 propostas no total (o time
// atual sempre está entre elas, representando a chance de renovação).
export const getContractEndOffers = (player: Player, currentOvr: number): Team[] => {
  // Prêmios individuais conquistados em toda a carreira - quanto mais
  // prêmios, maior o assédio de outros clubes no mercado.
  const totalIndividualAwards = player.history.reduce(
    (sum, s) => sum + (s.individualAwards?.length || 0),
    0
  );

  let numOffers = 1;
  if (totalIndividualAwards >= 1 || currentOvr >= 75) numOffers = 2;
  if (totalIndividualAwards >= 3 || currentOvr >= 80) numOffers = 3;
  if (totalIndividualAwards >= 6 || currentOvr >= 87) numOffers = 4;
  if (totalIndividualAwards >= 10 || currentOvr >= 92) numOffers = 5;
  numOffers = Math.max(1, Math.min(5, numOffers));

  // O próprio clube sempre aparece na lista - é a opção de renovação.
  // Exceto se o jogador estiver Sem Clube!
  const offers: Team[] = player.currentTeam.id === "none" ? [] : [player.currentTeam];

  // Adiciona clubes dos quais o jogador é ídolo (se não for o atual)
  if (player.idolClubs && player.idolClubs.length > 0) {
    for (const idolClubName of player.idolClubs) {
      if (idolClubName !== player.currentTeam.name) {
        const idolTeam = TEAMS.find(t => t.name === idolClubName);
        if (idolTeam && !offers.some(o => o.id === idolTeam.id)) {
          offers.push(idolTeam);
        }
      }
    }
  }

  // Se já temos ofertas suficientes (ou a mais por causa dos ídolos), ajustar numOffers para no mínimo o que temos
  numOffers = Math.max(numOffers, offers.length);

  if (numOffers > offers.length) {
    // Quanto maior o OVR do jogador, mais forte é o perfil dos clubes
    // interessados (níveis mais altos entram no sorteio).
    let candidateLevels: number[];
    if (currentOvr >= 84) candidateLevels = [4, 5];
    else if (currentOvr >= 78) candidateLevels = [3, 4, 5];
    else if (currentOvr >= 65) candidateLevels = [2, 3, 4];
    else candidateLevels = [1, 2, 3];

    let pool = TEAMS.filter(
      (t) => candidateLevels.includes(t.level) && t.id !== player.currentTeam.id
    );
    if (pool.length === 0) {
      pool = TEAMS.filter((t) => t.id !== player.currentTeam.id);
    }

    // Sorteia clubes distintos do pool até completar numOffers (contando o
    // próprio clube, que já está na lista).
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (const team of shuffled) {
      if (offers.length >= numOffers) break;
      if (!offers.some((o) => o.id === team.id)) {
        offers.push(team);
      }
    }
  }

  return offers;
};

export const updateIdolStatus = (
  player: Player,
  newStat: SeasonStat,
  finalsStatsBonus?: { goals?: number; assists?: number; type?: string }[]
): { idolClubs: string[], newIdol?: { club: string, reason: string } } => {
  const currentIdols = new Set(player.idolClubs || []);
  const club = player.currentTeam.name;

  if (currentIdols.has(club) || !player.isPro) return { idolClubs: Array.from(currentIdols) };

  const history = [newStat, ...player.history].filter(s => s.team.name === club);

  // 1. Jogar 15 Temporadas como titular pelo clube.
  const starterSeasons = history.filter(s => !s.isBenched).length;
  if (starterSeasons >= 15) {
    currentIdols.add(club);
    return { idolClubs: Array.from(currentIdols), newIdol: { club, reason: "Você completou 15 temporadas como titular pelo clube, demonstrando dedicação e lealdade, se tornando um ídolo!" } };
  }

  // 2. Ganhar 2 Copa Continental pelo clube.
  // 3. Ganhar 4 Liga Nacional pelo clube.
  let continentalWins = 0;
  let nationalLeagueWins = 0;
  history.forEach(s => {
    if (s.leaguePosition === 1) nationalLeagueWins++;
    if (s.finals) {
      const continentalName = "Copa Continental";
      const isContinental = (name: string) => name.includes("Champions League") || name.includes("Libertadores");
      if (s.finals.some(f => f.won && isContinental(f.type))) {
        continentalWins++;
      }
    }
  });

  if (continentalWins >= 2) {
    currentIdols.add(club);
    return { idolClubs: Array.from(currentIdols), newIdol: { club, reason: "2 conquistas continentais te eternizaram na história do clube como um ídolo!" } };
  }
  
  if (nationalLeagueWins >= 4) {
    currentIdols.add(club);
    return { idolClubs: Array.from(currentIdols), newIdol: { club, reason: "Hegemonia nacional! Suas 4 conquistas de Liga Nacional te tornaram um ídolo do clube!" } };
  }

  // 4. Fazer Hat-trick (3 gols) ou 3 assitencias em final de qualquer competição pelo clube.
  if (finalsStatsBonus) {
    for (const f of finalsStatsBonus) {
      if (f.goals && f.goals >= 3) {
        currentIdols.add(club);
        return { idolClubs: Array.from(currentIdols), newIdol: { club, reason: `Uma atuação mágica! Seu hat-trick em uma final te colocou no panteão dos ídolos do clube!` } };
      }
      if (f.assists && f.assists >= 3) {
        currentIdols.add(club);
        return { idolClubs: Array.from(currentIdols), newIdol: { club, reason: `O maestro das decisões! 3 assistências em uma final te tornaram ídolo!` } };
      }
    }
  }

  // 5. Ser artilheiro da Copa Continental ou Mundial pelo clube.
  const isContinentalOrWorldScorer = (awards?: string[]) => {
    if (!awards) return false;
    return awards.find(a => 
      a.includes("Artilheiro da Copa Libertadores") ||
      a.includes("Artilheiro da Champions League") ||
      a.includes("Artilheiro da AFC Champions League") ||
      a.includes("Artilheiro do Mundial de Clubes")
    );
  };
  
  const topScorerAward = isContinentalOrWorldScorer(newStat.individualAwards);
  if (topScorerAward) {
    currentIdols.add(club);
    return { idolClubs: Array.from(currentIdols), newIdol: { club, reason: `Sua marca letal (${topScorerAward}) te elevou ao status de lenda máxima do clube!` } };
  }

  return { idolClubs: Array.from(currentIdols) };
};

// =============================================================================
// LIGA PONTO A PONTO (turno e returno) - Fase 1
// =============================================================================
// Motor de simulação da liga do jogador rodada a rodada: gera o calendário de
// jogos (turno e returno), simula partidas de times que não são o do jogador
// e mantém a tabela de classificação sempre atualizada. A partida do próprio
// jogador fica pendente na rodada até ser resolvida (jogada ou simulada) por
// quem estiver controlando o fluxo do jogo.

export function getTeamsInSameLeague(allTeams: Team[], reference: Team): Team[] {
  const division = reference.division || 1;
  // `allTeams` vem da lista estática TEAMS (data.ts), cujo campo `division`
  // nunca é atualizado quando o time do jogador sobe/desce de divisão - só o
  // objeto `player.currentTeam` (aqui passado como `reference`) reflete a
  // divisão nova. Por isso, filtramos a lista estática removendo qualquer
  // entrada antiga do próprio time do jogador e sempre incluímos `reference`
  // no lugar. Garantimos exatamente 19 oponentes + `reference` = 20 times.
  const teams = allTeams.filter((t) => t.country === reference.country && (t.division || 1) === division && t.id !== reference.id);
  const opponentTeams = teams.slice(0, 19);
  return [...opponentTeams, reference];
}

export function sanitizeLeagueSeasonState(state: LeagueSeasonState, playerTeam: Team): LeagueSeasonState {
  const hasBye = state.fixtures.some((m) => m.home.id === "__bye__" || m.away.id === "__bye__");
  const isInvalid = state.teams.length > 20 || state.totalRounds > 38 || hasBye;

  if (!isInvalid) return state;

  // 1. Limpa a lista de times: remove BYE e duplicatas do time do jogador
  let cleanTeams = state.teams.filter((t) => t.id !== "__bye__" && t.name !== "BYE" && t.id !== playerTeam.id);
  cleanTeams = [...cleanTeams.slice(0, 19), playerTeam];

  // 2. Gera novo calendário limpo de 38 rodadas para 20 times
  const newFixtures = generateLeagueFixtures(cleanTeams).map((m) => ({
    ...m,
    isPlayerMatch: m.home.id === playerTeam.id || m.away.id === playerTeam.id,
  }));

  // 3. Preserva o histórico de partidas que já foram disputadas antes
  const playedOldMatchesMap = new Map<string, LeagueMatch>();
  state.fixtures.forEach((m) => {
    if (m.played) {
      const key = `${m.home.id}_vs_${m.away.id}`;
      playedOldMatchesMap.set(key, m);
    }
  });

  let standings = initLeagueStandings(cleanTeams);

  const updatedFixtures = newFixtures.map((m) => {
    const key = `${m.home.id}_vs_${m.away.id}`;
    const oldMatch = playedOldMatchesMap.get(key);
    if (oldMatch && oldMatch.played) {
      const updated: LeagueMatch = {
        ...m,
        played: true,
        homeGoals: oldMatch.homeGoals,
        awayGoals: oldMatch.awayGoals,
        playerGoals: oldMatch.playerGoals,
        playerAssists: oldMatch.playerAssists,
        playerRating: oldMatch.playerRating,
      };
      standings = applyLeagueResultToStandings(standings, updated);
      return updated;
    }
    return m;
  });

  let currentRound = state.currentRound;
  if (currentRound > 38) currentRound = 38;

  return {
    ...state,
    teams: cleanTeams,
    fixtures: updatedFixtures,
    standings: sortLeagueStandings(standings),
    currentRound,
    totalRounds: 38,
  };
}

// Gera o calendário de turno e returno pelo método do círculo. Para N times
// (par), gera 2*(N-1) rodadas - para uma liga de 20 times, são 38 rodadas.
export function generateLeagueFixtures(teams: Team[]): LeagueMatch[] {
  const list = [...teams];
  const hasBye = list.length % 2 !== 0;
  if (hasBye) {
    list.push({ id: "__bye__", name: "BYE", level: 0, country: "" } as Team);
  }
  const n = list.length;
  const roundsFirstLeg = n - 1;
  const half = n / 2;

  const firstLeg: LeagueMatch[] = [];
  let arr = list.slice();

  for (let round = 0; round < roundsFirstLeg; round++) {
    for (let i = 0; i < half; i++) {
      const teamA = arr[i];
      const teamB = arr[n - 1 - i];
      if (teamA.id === "__bye__" || teamB.id === "__bye__") continue;
      // Alterna o mando de campo entre rodadas para não repetir sempre o mesmo padrão.
      const teamAIsHome = (round + i) % 2 === 0;
      const home = teamAIsHome ? teamA : teamB;
      const away = teamAIsHome ? teamB : teamA;
      firstLeg.push({
        id: `r${round + 1}-${home.id}-${away.id}`,
        round: round + 1,
        home,
        away,
        played: false,
        isPlayerMatch: false,
      });
    }
    // Rotaciona os times mantendo o primeiro fixo (método do círculo).
    const fixed = arr[0];
    const rest = arr.slice(1);
    rest.unshift(rest.pop()!);
    arr = [fixed, ...rest];
  }

  // Returno: mesmos confrontos com mando de campo invertido.
  const secondLeg: LeagueMatch[] = firstLeg.map((m) => ({
    id: `r${m.round + roundsFirstLeg}-${m.away.id}-${m.home.id}`,
    round: m.round + roundsFirstLeg,
    home: m.away,
    away: m.home,
    played: false,
    isPlayerMatch: false,
  }));

  return [...firstLeg, ...secondLeg];
}

// Simula o placar de uma partida entre dois times com base no nível (1-5
// estrelas) de cada um, com vantagem de mando de campo e uma distribuição
// pseudo-Poisson para os gols.
export function simulateLeagueMatchResult(home: Team, away: Team): { homeGoals: number; awayGoals: number } {
  const poisson = (lambda: number) => {
    const l = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > l);
    return k - 1;
  };

  const homeAdvantage = 0.25;
  const levelDiff = (home.level + homeAdvantage) - away.level;
  const baseGoals = 1.25;

  // Times de nível mais alto têm maior ímpeto ofensivo (+0.08 por nível em relação ao nível 3)
  const homeAttackBoost = (home.level - 3) * 0.08;
  const awayAttackBoost = (away.level - 3) * 0.08;

  // Times de nível mais alto têm defesas mais sólidas, reduzindo os gols esperados do adversário
  const homeDefensiveMultiplier = Math.max(0.65, 1 - (home.level - 3) * 0.08);
  const awayDefensiveMultiplier = Math.max(0.65, 1 - (away.level - 3) * 0.08);

  let homeExpected = (baseGoals + levelDiff * 0.22 + homeAttackBoost) * awayDefensiveMultiplier;
  let awayExpected = (baseGoals - levelDiff * 0.22 + awayAttackBoost) * homeDefensiveMultiplier;

  homeExpected = Math.max(0.18, Math.min(3.2, homeExpected));
  awayExpected = Math.max(0.18, Math.min(3.2, awayExpected));

  return { homeGoals: poisson(homeExpected), awayGoals: poisson(awayExpected) };
}

export function initLeagueStandings(teams: Team[]): LeagueStanding[] {
  return teams.map((team) => ({
    teamId: team.id,
    team,
    points: 0,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  }));
}

export function applyLeagueResultToStandings(standings: LeagueStanding[], match: LeagueMatch): LeagueStanding[] {
  if (match.homeGoals === undefined || match.awayGoals === undefined) return standings;
  const homeGoals = match.homeGoals;
  const awayGoals = match.awayGoals;

  return standings.map((s) => {
    if (s.teamId === match.home.id) {
      const won = homeGoals > awayGoals;
      const draw = homeGoals === awayGoals;
      return {
        ...s,
        played: s.played + 1,
        goalsFor: s.goalsFor + homeGoals,
        goalsAgainst: s.goalsAgainst + awayGoals,
        wins: s.wins + (won ? 1 : 0),
        draws: s.draws + (draw ? 1 : 0),
        losses: s.losses + (!won && !draw ? 1 : 0),
        points: s.points + (won ? 3 : draw ? 1 : 0),
      };
    }
    if (s.teamId === match.away.id) {
      const won = awayGoals > homeGoals;
      const draw = homeGoals === awayGoals;
      return {
        ...s,
        played: s.played + 1,
        goalsFor: s.goalsFor + awayGoals,
        goalsAgainst: s.goalsAgainst + homeGoals,
        wins: s.wins + (won ? 1 : 0),
        draws: s.draws + (draw ? 1 : 0),
        losses: s.losses + (!won && !draw ? 1 : 0),
        points: s.points + (won ? 3 : draw ? 1 : 0),
      };
    }
    return s;
  });
}

export function sortLeagueStandings(standings: LeagueStanding[]): LeagueStanding[] {
  return [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });
}

// Cria o estado inicial da liga do jogador para a temporada: calendário
// completo (38 rodadas para 20 times) e tabela zerada, já marcando quais
// partidas envolvem o time do jogador.
export function createLeagueSeasonState(
  leagueName: string,
  playerTeam: Team,
  allTeams: Team[]
): LeagueSeasonState {
  const teams = getTeamsInSameLeague(allTeams, playerTeam);
  const fixtures = generateLeagueFixtures(teams).map((m) => ({
    ...m,
    isPlayerMatch: m.home.id === playerTeam.id || m.away.id === playerTeam.id,
  }));
  const totalRounds = fixtures.reduce((max, m) => Math.max(max, m.round), 0);

  const rawState: LeagueSeasonState = {
    leagueName,
    country: playerTeam.country,
    division: playerTeam.division || 1,
    teams,
    fixtures,
    standings: initLeagueStandings(teams),
    currentRound: 1,
    totalRounds,
  };

  return sanitizeLeagueSeasonState(rawState, playerTeam);
}

// Simula todas as partidas de uma rodada, EXCETO a do jogador (que fica
// pendente para ser resolvida separadamente - jogada interativamente ou
// simulada sob demanda). Retorna o novo estado da liga.
export function simulateLeagueRound(state: LeagueSeasonState, round: number): LeagueSeasonState {
  let standings = state.standings;
  const fixtures = state.fixtures.map((m) => {
    if (m.round !== round || m.played || m.isPlayerMatch) return m;
    const result = simulateLeagueMatchResult(m.home, m.away);
    const updated: LeagueMatch = { ...m, played: true, homeGoals: result.homeGoals, awayGoals: result.awayGoals };
    standings = applyLeagueResultToStandings(standings, updated);
    return updated;
  });
  return { ...state, fixtures, standings };
}

// Resolve a partida do jogador na rodada atual com um placar já definido
// (vindo da InteractiveMatchModal, quando ele decide jogar, ou de um sorteio
// rápido, quando decide simular) e atualiza a tabela.
// Nota (0-10) para exibição no "Caixa da Temporada" da Dashboard: parte de
// uma base 6.0, soma bônus por gol/assistência e um pequeno ajuste pelo
// saldo de gols do próprio time naquela partida.
export function computeLeagueMatchRating(playerGoals: number, playerAssists: number, ownGoalDiff: number): number {
  const diffBonus = Math.max(-1, Math.min(1, ownGoalDiff)) * 0.3;
  const rating = 6.0 + playerGoals * 0.8 + playerAssists * 0.5 + diffBonus;
  return Math.round(Math.max(4, Math.min(10, rating)) * 10) / 10;
}

// Ajusta a confiança do técnico (0-100) com base na nota de uma partida de liga.
// Nota 6.0 é neutra (não muda nada); acima disso ganha confiança, abaixo perde.
// O valor final fica sempre entre 0 e 100.
export function updateCoachTrust(currentTrust: number | undefined, matchRating: number): number {
  const base = currentTrust ?? 50;
  const delta = Math.round((matchRating - 6.0) * 3);
  const clampedDelta = Math.max(-6, Math.min(9, delta));
  return Math.max(0, Math.min(100, base + clampedDelta));
}

// Converte a confiança do técnico (0-100) no papel efetivo do jogador no elenco.
export function getEffectiveSquadRole(coachTrust: number | undefined): "STARTER" | "COMPETING" | "ROTATION" {
  const trust = coachTrust ?? 50;
  if (trust >= 65) return "STARTER";
  if (trust >= 35) return "COMPETING";
  return "ROTATION";
}

export function resolvePlayerLeagueMatch(
  state: LeagueSeasonState,
  round: number,
  homeGoals: number,
  awayGoals: number,
  playerTeamId?: string,
  playerGoals: number = 0,
  playerAssists: number = 0
): LeagueSeasonState {
  let standings = state.standings;
  const fixtures = state.fixtures.map((m) => {
    if (m.round !== round || !m.isPlayerMatch) return m;
    const isHome = playerTeamId ? m.home.id === playerTeamId : true;
    const ownGoals = isHome ? homeGoals : awayGoals;
    const opponentGoals = isHome ? awayGoals : homeGoals;
    const rating = computeLeagueMatchRating(playerGoals, playerAssists, ownGoals - opponentGoals);
    const updated: LeagueMatch = {
      ...m,
      played: true,
      homeGoals,
      awayGoals,
      playerGoals,
      playerAssists,
      playerRating: rating,
    };
    standings = applyLeagueResultToStandings(standings, updated);
    return updated;
  });
  return { ...state, fixtures, standings };
}

export function getPlayerLeaguePosition(state: LeagueSeasonState, playerTeamId: string): number {
  const sorted = sortLeagueStandings(state.standings);
  return sorted.findIndex((s) => s.teamId === playerTeamId) + 1;
}

// Nome de exibição da liga nacional do time (usado pela LeagueSeasonModal
// para rotular a tela da temporada rodada a rodada).
export function getLeagueNameForTeam(team: Team): string {
  const isDiv2 = team.division === 2;
  switch (team.country) {
    case "BR": return isDiv2 ? "Série B" : "Brasileirão";
    case "EN": return isDiv2 ? "Championship" : "Premier League";
    case "IT": return isDiv2 ? "Serie B" : "Serie A";
    case "ES": return isDiv2 ? "La Liga 2" : "La Liga";
    case "DE": return isDiv2 ? "2. Bundesliga" : "Bundesliga";
    case "FR": return isDiv2 ? "Ligue 2" : "Ligue 1";
    case "PT": return isDiv2 ? "Liga Portugal 2" : "Primeira Liga";
    case "NL": return isDiv2 ? "Eerste Divisie" : "Eredivisie";
    case "US": return isDiv2 ? "USL Championship" : "MLS";
    case "SA": return isDiv2 ? "First Division League" : "Saudi Pro League";
    case "AR": return isDiv2 ? "Primera Nacional" : "Liga Profesional Argentina";
    case "UY": return isDiv2 ? "Segunda División" : "Primera División Uruguaya";
    default: return "Liga Nacional";
  }
}

// =============================================================================
// COPAS (NACIONAL E CONTINENTAL) PONTO A PONTO - Fase 4
// =============================================================================
// Mesma filosofia da liga: em vez de sortear se o time "chegou à final", o
// torneio é jogado em chaveamento eliminatório real, rodada a rodada.

export function getCupNamesForTeam(team: Team): { domestic: string; continental: string } {
  switch (team.country) {
    case "BR": return { domestic: "Copa do Brasil", continental: "Copa Libertadores" };
    case "EN": return { domestic: "FA Cup", continental: "Champions League" };
    case "IT": return { domestic: "Coppa Italia", continental: "Champions League" };
    case "ES": return { domestic: "Copa del Rey", continental: "Champions League" };
    case "DE": return { domestic: "DFB-Pokal", continental: "Champions League" };
    case "FR": return { domestic: "Coupe de France", continental: "Champions League" };
    case "PT": return { domestic: "Taça de Portugal", continental: "Champions League" };
    case "NL": return { domestic: "KNVB Cup", continental: "Champions League" };
    case "US": return { domestic: "US Open Cup", continental: "Copa Libertadores" };
    case "SA": return { domestic: "King's Cup", continental: "AFC Champions League" };
    case "AR": return { domestic: "Copa Argentina", continental: "Copa Libertadores" };
    case "UY": return { domestic: "Copa Uruguay", continental: "Copa Libertadores" };
    default: return { domestic: "Copa Nacional", continental: "Copa Continental" };
  }
}

// Mesmos critérios de classificação que o jogo já usava (times de elite têm
// chance de entrar nas copas). A diferença agora é que, uma vez classificado,
// o torneio inteiro é jogado partida a partida em vez de decidir "chegou à
// final" na sorte.
export function getCupQualifications(player: Player, currentOvr: number): { domesticCup: boolean; continentalCup: boolean } {
  if (!player.isPro || player.currentTeam.division === 2) return { domesticCup: false, continentalCup: false };

  // Terminou no G4 (top 4) da liga na temporada anterior: classificação
  // garantida para a Copa Nacional e para a Copa Continental. Importante:
  // isso só vale se o G4 foi na PRIMEIRA divisão. Sem essa checagem, um time
  // que sobe da segunda divisão (o que também resulta em posição 1-4 na
  // tabela da segunda divisão) era erroneamente classificado direto para a
  // Champions League/Copa Continental, quando na verdade só ganhou o acesso.
  const lastSeason = player.history[0];
  if (
    lastSeason &&
    lastSeason.leaguePosition !== undefined &&
    lastSeason.leaguePosition <= 4 &&
    (lastSeason.team.division || 1) === 1
  ) {
    return { domesticCup: true, continentalCup: true };
  }

  const relLevel = getRelativeLevel(player.currentTeam);
  if (relLevel !== 5) return { domesticCup: false, continentalCup: false };
  const teamPower = relLevel * 20 + currentOvr * 0.5;
  const domesticCup = Math.random() * 100 < teamPower * 0.4;
  const continentalCup = Math.random() * 100 < (teamPower - 70) * 0.6;
  return { domesticCup, continentalCup };
}

const CONTINENTAL_GROUPS: Record<string, string[]> = {
  BR: ["BR", "AR", "UY"],
  AR: ["BR", "AR", "UY"],
  UY: ["BR", "AR", "UY"],
  EN: ["EN", "IT", "ES", "DE", "FR", "PT", "NL"],
  IT: ["EN", "IT", "ES", "DE", "FR", "PT", "NL"],
  ES: ["EN", "IT", "ES", "DE", "FR", "PT", "NL"],
  DE: ["EN", "IT", "ES", "DE", "FR", "PT", "NL"],
  FR: ["EN", "IT", "ES", "DE", "FR", "PT", "NL"],
  PT: ["EN", "IT", "ES", "DE", "FR", "PT", "NL"],
  NL: ["EN", "IT", "ES", "DE", "FR", "PT", "NL"],
  US: ["US"],
  SA: ["SA"],
};

export function getDomesticCupOpponentPool(playerTeam: Team): Team[] {
  return TEAMS.filter((t) => t.country === playerTeam.country && t.id !== playerTeam.id);
}

export function getContinentalCupOpponentPool(playerTeam: Team): Team[] {
  const group = CONTINENTAL_GROUPS[playerTeam.country] || [playerTeam.country];
  return TEAMS.filter((t) => group.includes(t.country) && (t.division || 1) === 1 && t.id !== playerTeam.id);
}

export function getNationalTeamOpponentPool(nationality: string): Team[] {
  return NATIONAL_TEAMS.filter((t) => t.name !== nationality && t.id !== nationality);
}

export function getNationalContinentalOpponentPool(nationality: string): Team[] {
  if (EUROPEAN_NATIONALITIES.includes(nationality)) {
    return NATIONAL_TEAMS.filter((t) => t.name !== nationality && t.id !== nationality && EUROPEAN_NATIONALITIES.includes(t.name));
  }
  if (AMERICAN_NATIONALITIES.includes(nationality)) {
    return NATIONAL_TEAMS.filter((t) => t.name !== nationality && t.id !== nationality && AMERICAN_NATIONALITIES.includes(t.name));
  }
  if (ASIAN_NATIONALITIES.includes(nationality)) {
    return NATIONAL_TEAMS.filter((t) => t.name !== nationality && t.id !== nationality && ASIAN_NATIONALITIES.includes(t.name));
  }
  return getNationalTeamOpponentPool(nationality);
}

export function getNationalCupQualifications(
  player: Player,
  currentOvr: number
): { worldCup: boolean; continentalCup: boolean; isCalledUp: boolean } {
  if (!player.isPro) return { worldCup: false, continentalCup: false, isCalledUp: false };

  const isWorldCupYear = player.age % 4 === 0;
  const isContinentalCupYear = player.age % 4 === 2;

  if (!isWorldCupYear && !isContinentalCupYear) {
    return { worldCup: false, continentalCup: false, isCalledUp: false };
  }

  // Requisitos reais de convocação para Seleção no Modo História:
  // OVR >= 75: convocação garantida.
  // OVR 71-74: convocado se teve boa temporada anterior (gols+assists >= 8) ou 40% de chance.
  // OVR < 71: NÃO convocado.
  const topNats = ["Brasil", "Argentina", "França", "Inglaterra", "Espanha", "Itália", "Alemanha", "Portugal", "Holanda", "Uruguai", 
    "Estados Unidos", "EUA", "Arábia Saudita", "Japão", "Coreia do Sul", "Austrália", "Colômbia", "Equador", "Paraguai", "Irã", "Iraque", "Uzbequistão", "Catar",
    "Bélgica", "Suíça", "Suécia", "Noruega", "Croácia", "Turquia", "Escócia", "Bósnia", "Chile", "Venezuela", "Bolívia", "Peru", "México", "Canadá"
  ];
  const isTop = topNats.includes(player.nationality);
  const guaranteedOvr = isTop ? 75 : 71;
  const minimumOvr = isTop ? 71 : 67;

  let isCalledUp = false;
  if (currentOvr >= guaranteedOvr) {
    isCalledUp = true;
  } else if (currentOvr >= minimumOvr) {
    const lastSeason = player.history[0];
    const strongSeason = lastSeason ? (lastSeason.goals + lastSeason.assists >= 8) : false;
    isCalledUp = strongSeason || Math.random() < 0.4;
  }

  if (!isCalledUp) {
    return { worldCup: false, continentalCup: false, isCalledUp: false };
  }

  return {
    worldCup: isWorldCupYear,
    continentalCup: isContinentalCupYear,
    isCalledUp: true,
  };
}

function shuffleTeams<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickBracketSize(available: number, desired: number): number {
  const capped = Math.min(desired, available);
  if (capped >= 16) return 16;
  if (capped >= 8) return 8;
  if (capped >= 4) return 4;
  return 2;
}

function roundNamesForSize(size: number): string[] {
  if (size === 16) return ["Oitavas de Final", "Quartas de Final", "Semifinal", "Final"];
  if (size === 8) return ["Quartas de Final", "Semifinal", "Final"];
  return ["Semifinal", "Final"];
}

function pairUpCupRound(teams: Team[], roundIndex: number, roundName: string, playerTeamId: string): CupMatch[] {
  const matches: CupMatch[] = [];
  for (let i = 0; i < teams.length; i += 2) {
    const home = teams[i];
    const away = teams[i + 1];
    matches.push({
      id: `cup-r${roundIndex}-${home.id}-${away.id}`,
      roundIndex,
      roundName,
      home,
      away,
      played: false,
      isPlayerMatch: home.id === playerTeamId || away.id === playerTeamId,
    });
  }
  return matches;
}

export function applyGroupMatchResult(standings: GroupStanding[], match: CupMatch): GroupStanding[] {
  if (match.homeGoals === undefined || match.awayGoals === undefined) return standings;

  const { home, away, homeGoals, awayGoals } = match;

  return standings.map((s) => {
    if (s.team.id !== home.id && s.team.id !== away.id) return s;

    const isHome = s.team.id === home.id;
    const ownGoals = isHome ? homeGoals : awayGoals;
    const oppGoals = isHome ? awayGoals : homeGoals;

    let points = s.points;
    let wins = s.wins;
    let draws = s.draws;
    let losses = s.losses;

    if (ownGoals > oppGoals) {
      points += 3;
      wins += 1;
    } else if (ownGoals === oppGoals) {
      points += 1;
      draws += 1;
    } else {
      losses += 1;
    }

    const played = s.played + 1;
    const goalsFor = s.goalsFor + ownGoals;
    const goalsAgainst = s.goalsAgainst + oppGoals;
    const goalDifference = goalsFor - goalsAgainst;

    return {
      ...s,
      played,
      points,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference,
    };
  });
}

export function sortGroupStandings(standings: GroupStanding[]): GroupStanding[] {
  return [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return (b.team.level || 5) - (a.team.level || 5);
  });
}

export function getCupPoolSource(cupName: string, isNational: boolean): Team[] {
  if (isNational) {
    if (cupName.includes("Copa América")) {
      return NATIONAL_TEAMS.filter((t) => AMERICAN_NATIONALITIES.includes(t.name));
    }
    if (cupName.includes("Eurocopa")) {
      return NATIONAL_TEAMS.filter((t) => EUROPEAN_NATIONALITIES.includes(t.name));
    }
    if (cupName.includes("Copa da Ásia")) {
      return NATIONAL_TEAMS.filter((t) => ASIAN_NATIONALITIES.includes(t.name));
    }
    return NATIONAL_TEAMS;
  }
  return TEAMS;
}

// Monta o chaveamento inicial: para copas continentais/seleções, inicia na Fase de Grupos;
// para copas domésticas, inicia direto no mata-mata.
export function createCupBracket(
  cupName: string,
  isContinental: boolean,
  playerTeam: Team,
  opponentPool: Team[],
  desiredSize: 8 | 16,
  isNational: boolean = false
): CupSeasonState {
  const poolSource = getCupPoolSource(cupName, isNational);
  const filteredOpponentPool = opponentPool.filter((t) =>
    poolSource.some((p) => p.id === t.id || p.name === t.name)
  );

  if (isContinental) {
    // Fase de Grupos nas Copas Continentais (4 times no grupo, turno único: 3 rodadas)
    let others = shuffleTeams(filteredOpponentPool).slice(0, 3);
    if (others.length < 3) {
      const pickedIds = new Set([playerTeam.id, playerTeam.name, ...others.map((t) => t.id), ...others.map((t) => t.name)]);
      const fillPool = poolSource.filter((t) => !pickedIds.has(t.id) && !pickedIds.has(t.name));
      const extraNeeded = 3 - others.length;
      const extra = shuffleTeams(fillPool).slice(0, extraNeeded);
      others = [...others, ...extra];
    }
    const groupTeams = [playerTeam, ...others];

    const [t0, t1, t2, t3] = groupTeams;

    const groupRoundsMatches: CupMatch[][] = [
      // Rodada 1
      [
        { id: `grp-r0-${t0.id}-${t1.id}`, roundIndex: 0, roundName: "Fase de Grupos - Rodada 1", home: t0, away: t1, played: false, isPlayerMatch: true },
        { id: `grp-r0-${t2.id}-${t3.id}`, roundIndex: 0, roundName: "Fase de Grupos - Rodada 1", home: t2, away: t3, played: false, isPlayerMatch: false },
      ],
      // Rodada 2
      [
        { id: `grp-r1-${t2.id}-${t0.id}`, roundIndex: 1, roundName: "Fase de Grupos - Rodada 2", home: t2, away: t0, played: false, isPlayerMatch: true },
        { id: `grp-r1-${t1.id}-${t3.id}`, roundIndex: 1, roundName: "Fase de Grupos - Rodada 2", home: t1, away: t3, played: false, isPlayerMatch: false },
      ],
      // Rodada 3
      [
        { id: `grp-r2-${t0.id}-${t3.id}`, roundIndex: 2, roundName: "Fase de Grupos - Rodada 3", home: t0, away: t3, played: false, isPlayerMatch: true },
        { id: `grp-r2-${t1.id}-${t2.id}`, roundIndex: 2, roundName: "Fase de Grupos - Rodada 3", home: t1, away: t2, played: false, isPlayerMatch: false },
      ],
    ];

    const groupStandings: GroupStanding[] = groupTeams.map((team) => ({
      team,
      played: 0,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    }));

    return {
      cupName,
      isContinental,
      isNational,
      roundNames: ["Oitavas de Final", "Quartas de Final", "Semifinal", "Final"],
      roundsMatches: [],
      currentRoundIndex: 0,
      playerTeamId: playerTeam.id,
      eliminated: false,
      champion: false,
      playerGoalsTotal: 0,
      playerAssistsTotal: 0,
      hasGroupStage: true,
      groupStageDone: false,
      groupTeams,
      groupStandings,
      groupRoundsMatches,
      groupCurrentRoundIndex: 0,
      opponentPool: filteredOpponentPool.length > 0 ? filteredOpponentPool : poolSource,
    };
  }

  let size = pickBracketSize(filteredOpponentPool.length + 1, desiredSize);
  let roundNames = roundNamesForSize(size);
  let others = shuffleTeams(filteredOpponentPool).slice(0, size - 1);

  if (others.length < size - 1) {
    const pickedIds = new Set([playerTeam.id, playerTeam.name, ...others.map((t) => t.id), ...others.map((t) => t.name)]);
    const fillPool = poolSource.filter((t) => !pickedIds.has(t.id) && !pickedIds.has(t.name));
    const extraNeeded = (size - 1) - others.length;
    const extra = shuffleTeams(fillPool).slice(0, extraNeeded);
    others = [...others, ...extra];
  }

  const totalCount = others.length + 1;
  if (totalCount < 4) {
    size = 2;
  } else if (totalCount < 8) {
    size = 4;
  } else if (totalCount < 16 && size === 16) {
    size = 8;
  }
  roundNames = roundNamesForSize(size);
  others = others.slice(0, size - 1);

  const participants = shuffleTeams([playerTeam, ...others]);
  const firstRound = pairUpCupRound(participants, 0, roundNames[0], playerTeam.id);

  return {
    cupName,
    isContinental,
    isNational,
    roundNames,
    roundsMatches: [firstRound],
    currentRoundIndex: 0,
    playerTeamId: playerTeam.id,
    eliminated: false,
    champion: false,
    playerGoalsTotal: 0,
    playerAssistsTotal: 0,
  };
}

// Simula os confrontos da rodada atual que NÃO envolvem o jogador.
export function simulateCupRoundBots(state: CupSeasonState): CupSeasonState {
  if (state.hasGroupStage && !state.groupStageDone && state.groupRoundsMatches && state.groupCurrentRoundIndex !== undefined) {
    const grpIdx = state.groupCurrentRoundIndex;
    let standings = state.groupStandings || [];
    const groupRoundsMatches = [...state.groupRoundsMatches];

    const matches = (groupRoundsMatches[grpIdx] || []).map((m) => {
      if (m.isPlayerMatch || m.played) return m;
      const result = simulateLeagueMatchResult(m.home, m.away);
      const playedMatch = { ...m, played: true, homeGoals: result.homeGoals, awayGoals: result.awayGoals };
      standings = applyGroupMatchResult(standings, playedMatch);
      return playedMatch;
    });

    groupRoundsMatches[grpIdx] = matches;
    return {
      ...state,
      groupRoundsMatches,
      groupStandings: sortGroupStandings(standings),
    };
  }

  const roundIdx = state.currentRoundIndex;
  if (!state.roundsMatches || !state.roundsMatches[roundIdx]) return state;

  const matches = state.roundsMatches[roundIdx].map((m) => {
    if (m.isPlayerMatch || m.played) return m;
    const result = simulateLeagueMatchResult(m.home, m.away);
    let { homeGoals, awayGoals } = result;
    if (homeGoals === awayGoals) {
      if (Math.random() > 0.5) homeGoals += 1;
      else awayGoals += 1;
    }
    return { ...m, played: true, homeGoals, awayGoals };
  });
  const roundsMatches = [...state.roundsMatches];
  roundsMatches[roundIdx] = matches;
  return { ...state, roundsMatches };
}

// Resolve o confronto do jogador na rodada atual com o placar já definido.
export function resolvePlayerCupMatch(
  state: CupSeasonState,
  homeGoals: number,
  awayGoals: number,
  playerGoals: number = 0,
  playerAssists: number = 0
): CupSeasonState {
  if (state.hasGroupStage && !state.groupStageDone && state.groupRoundsMatches && state.groupCurrentRoundIndex !== undefined) {
    const grpIdx = state.groupCurrentRoundIndex;
    let standings = state.groupStandings || [];
    const groupRoundsMatches = [...state.groupRoundsMatches];

    const matches = (groupRoundsMatches[grpIdx] || []).map((m) => {
      if (!m.isPlayerMatch) return m;
      const isHome = m.home.id === state.playerTeamId;
      const ownGoals = isHome ? homeGoals : awayGoals;
      const opponentGoals = isHome ? awayGoals : homeGoals;
      const rating = computeLeagueMatchRating(playerGoals, playerAssists, ownGoals - opponentGoals);
      const playedMatch = {
        ...m,
        played: true,
        homeGoals,
        awayGoals,
        playerGoals,
        playerAssists,
        playerRating: rating,
      };
      standings = applyGroupMatchResult(standings, playedMatch);
      return playedMatch;
    });

    groupRoundsMatches[grpIdx] = matches;
    return {
      ...state,
      groupRoundsMatches,
      groupStandings: sortGroupStandings(standings),
      playerGoalsTotal: state.playerGoalsTotal + playerGoals,
      playerAssistsTotal: state.playerAssistsTotal + playerAssists,
    };
  }

  const roundIdx = state.currentRoundIndex;
  let finalHome = homeGoals;
  let finalAway = awayGoals;
  if (finalHome === finalAway) {
    if (Math.random() > 0.5) finalHome += 1;
    else finalAway += 1;
  }

  const matches = (state.roundsMatches[roundIdx] || []).map((m) => {
    if (!m.isPlayerMatch) return m;
    const isHome = m.home.id === state.playerTeamId;
    const ownGoals = isHome ? finalHome : finalAway;
    const opponentGoals = isHome ? finalAway : finalHome;
    const rating = computeLeagueMatchRating(playerGoals, playerAssists, ownGoals - opponentGoals);
    return {
      ...m,
      played: true,
      homeGoals: finalHome,
      awayGoals: finalAway,
      playerGoals,
      playerAssists,
      playerRating: rating,
    };
  });

  const roundsMatches = [...state.roundsMatches];
  roundsMatches[roundIdx] = matches;
  return {
    ...state,
    roundsMatches,
    playerGoalsTotal: state.playerGoalsTotal + playerGoals,
    playerAssistsTotal: state.playerAssistsTotal + playerAssists,
  };
}

// Avança para a próxima rodada (ou mata-mata pós-fase de grupos).
export function advanceCupToNextRound(state: CupSeasonState): CupSeasonState {
  if (state.hasGroupStage && !state.groupStageDone && state.groupRoundsMatches && state.groupCurrentRoundIndex !== undefined) {
    const grpIdx = state.groupCurrentRoundIndex;
    const matches = state.groupRoundsMatches[grpIdx] || [];
    const playerMatch = matches.find((m) => m.isPlayerMatch);
    if (!playerMatch || !playerMatch.played) return state;

    if (grpIdx < 2) {
      return {
        ...state,
        groupCurrentRoundIndex: grpIdx + 1,
      };
    }

    // Fim da Fase de Grupos
    const sorted = sortGroupStandings(state.groupStandings || []);
    const playerRank = sorted.findIndex((s) => s.team.id === state.playerTeamId);

    if (playerRank === -1 || playerRank >= 2) {
      return {
        ...state,
        groupStageDone: true,
        eliminated: true,
      };
    }

    // Classificado entre os top 2!
    const qualifiedFromGroup = sorted.slice(0, 2).map((s) => s.team);
    const groupTeamIds = new Set((state.groupTeams || []).map((t) => t.id));

    const poolSource = getCupPoolSource(state.cupName, state.isNational ?? false);
    const validPool = (state.opponentPool || []).filter((t) =>
      poolSource.some((p) => p.id === t.id || p.name === t.name)
    );
    let otherOpponents = validPool.filter((t) => !groupTeamIds.has(t.id));

    const targetKnockoutSize = poolSource.length >= 16 ? 16 : 8;
    const neededOther = targetKnockoutSize - qualifiedFromGroup.length;

    if (otherOpponents.length < neededOther) {
      const pickedIds = new Set([...groupTeamIds, ...otherOpponents.map((t) => t.id), ...otherOpponents.map((t) => t.name)]);
      const fillPool = poolSource.filter((t) => !pickedIds.has(t.id) && !pickedIds.has(t.name));
      const extraNeeded = neededOther - otherOpponents.length;
      otherOpponents = [...otherOpponents, ...shuffleTeams(fillPool).slice(0, extraNeeded)];
    } else {
      otherOpponents = shuffleTeams(otherOpponents).slice(0, neededOther);
    }

    const knockoutParticipants = shuffleTeams([...qualifiedFromGroup, ...otherOpponents]);
    const roundNames = targetKnockoutSize === 16
      ? ["Oitavas de Final", "Quartas de Final", "Semifinal", "Final"]
      : ["Quartas de Final", "Semifinal", "Final"];
    const firstKnockoutRound = pairUpCupRound(knockoutParticipants, 0, roundNames[0], state.playerTeamId);

    return {
      ...state,
      groupStageDone: true,
      roundNames,
      roundsMatches: [firstKnockoutRound],
      currentRoundIndex: 0,
    };
  }

  const roundIdx = state.currentRoundIndex;
  const matches = state.roundsMatches[roundIdx];
  if (!matches) return state;

  const playerMatch = matches.find((m) => m.isPlayerMatch);
  if (!playerMatch || playerMatch.homeGoals === undefined) return state;

  const playerWon = playerMatch.home.id === state.playerTeamId
    ? playerMatch.homeGoals! > playerMatch.awayGoals!
    : playerMatch.awayGoals! > playerMatch.homeGoals!;

  if (!playerWon) {
    return { ...state, eliminated: true };
  }

  const winners = matches.map((m) => (m.homeGoals! > m.awayGoals! ? m.home : m.away));

  if (winners.length <= 1) {
    return { ...state, champion: true };
  }

  const nextRoundIdx = roundIdx + 1;
  const shuffledWinners = shuffleTeams(winners);
  const nextRound = pairUpCupRound(shuffledWinners, nextRoundIdx, state.roundNames[nextRoundIdx], state.playerTeamId);

  return {
    ...state,
    currentRoundIndex: nextRoundIdx,
    roundsMatches: [...state.roundsMatches, nextRound],
  };
}

export function cupReachedFinalRound(state: CupSeasonState): boolean {
  if (state.hasGroupStage && !state.groupStageDone) return false;
  return state.currentRoundIndex === state.roundNames.length - 1 && (state.champion || state.eliminated);
}

export function countCupMatchesPlayed(state: CupSeasonState): number {
  let count = 0;
  if (state.hasGroupStage && state.groupRoundsMatches) {
    count += state.groupRoundsMatches.reduce(
      (sum, roundMatches) => sum + roundMatches.filter((m) => m.isPlayerMatch && m.played).length,
      0
    );
  }
  if (state.roundsMatches) {
    count += state.roundsMatches.reduce(
      (sum, roundMatches) => sum + roundMatches.filter((m) => m.isPlayerMatch && m.played).length,
      0
    );
  }
  return count;
}

export function calculateBiometricsModifiers(height: number, weight: number) {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  const weightEffect = Math.round((weight - 75) / 3);
  const heightEffect = Math.round((height - 181) / 3.8);

  const basePhysicalMod = weightEffect + heightEffect;
  const basePaceMod = -basePhysicalMod;

  let physicalDebuff = 0;
  let paceDebuff = 0;

  if (bmi < 19.0) {
    // Jogador muito leve/magro para a altura (ex: 200cm e 60kg => IMC 15.0)
    const diff = 19.0 - bmi;
    physicalDebuff = Math.round(diff * 3.2); // Debuff de físico agressivo
    paceDebuff = Math.round(diff * 0.8);
  } else if (bmi > 26.0) {
    // Jogador muito pesado/sobrepeso para a altura (ex: 162cm e 90kg => IMC 34.3)
    const diff = bmi - 26.0;
    physicalDebuff = Math.round(diff * 2.8); // Debuff de físico agressivo
    paceDebuff = Math.round(diff * 1.5);
  }

  const physicalMod = basePhysicalMod - physicalDebuff;
  const paceMod = basePaceMod - paceDebuff;

  return { physicalMod, paceMod, physicalDebuff, paceDebuff, bmi };
}

export function sanitizeCupSeasonState(state: CupSeasonState, playerTeam?: Team): CupSeasonState {
  const isNat = !!(
    state.isNational ||
    state.cupName.includes("Copa do Mundo") ||
    state.cupName.includes("Eurocopa") ||
    state.cupName.includes("Copa América") ||
    state.cupName.includes("Copa da Ásia") ||
    state.cupName.includes("Copa Continental (Seleção)")
  );

  const nationalTeamIds = new Set(NATIONAL_TEAMS.map((t) => t.id));
  const nationalTeamNames = new Set(NATIONAL_TEAMS.map((t) => t.name));

  const isInvalidTeam = (t: Team) => {
    if (!t) return false;
    if (t.id === state.playerTeamId || (playerTeam && t.name === playerTeam.name)) return false;
    if (isNat) {
      if (state.cupName.includes("Copa América")) {
        return !AMERICAN_NATIONALITIES.includes(t.name);
      }
      if (state.cupName.includes("Eurocopa")) {
        return !EUROPEAN_NATIONALITIES.includes(t.name);
      }
      if (state.cupName.includes("Copa da Ásia")) {
        return !ASIAN_NATIONALITIES.includes(t.name);
      }
      // Para Copa de Seleções (ex: Copa do Mundo): o time DEVE ser uma Seleção Nacional
      return !nationalTeamIds.has(t.id) && !nationalTeamNames.has(t.name);
    } else {
      // Para Copa de Clubes: o time NÃO deve ser uma Seleção Nacional
      return nationalTeamIds.has(t.id) || nationalTeamNames.has(t.name);
    }
  };

  let hasInvalid = false;

  if (state.groupTeams && state.groupTeams.some(isInvalidTeam)) hasInvalid = true;
  if (state.opponentPool && state.opponentPool.some(isInvalidTeam)) hasInvalid = true;

  if (state.groupRoundsMatches) {
    for (const round of state.groupRoundsMatches) {
      for (const m of round) {
        if (isInvalidTeam(m.home) || isInvalidTeam(m.away)) hasInvalid = true;
      }
    }
  }

  if (state.roundsMatches) {
    for (const round of state.roundsMatches) {
      for (const m of round) {
        if (isInvalidTeam(m.home) || isInvalidTeam(m.away)) hasInvalid = true;
      }
    }
  }

  if (!hasInvalid && state.isNational === isNat) return state;

  const replacements = new Map<string, Team>();
  const usedTeamIds = new Set<string>();
  usedTeamIds.add(state.playerTeamId);

  const checkAndCollect = (t: Team) => {
    if (t && !isInvalidTeam(t)) {
      usedTeamIds.add(t.id);
      usedTeamIds.add(t.name);
    }
  };

  if (state.groupTeams) state.groupTeams.forEach(checkAndCollect);
  if (state.roundsMatches) {
    state.roundsMatches.forEach((round) =>
      round.forEach((m) => {
        if (m.home) checkAndCollect(m.home);
        if (m.away) checkAndCollect(m.away);
      })
    );
  }

  const sourcePool = shuffleTeams(getCupPoolSource(state.cupName, isNat));

  const getReplacement = (oldTeam: Team): Team => {
    if (!oldTeam || !isInvalidTeam(oldTeam)) return oldTeam;
    if (replacements.has(oldTeam.id)) return replacements.get(oldTeam.id)!;

    const available = sourcePool.find((t) => !usedTeamIds.has(t.id) && !usedTeamIds.has(t.name));
    if (available) {
      usedTeamIds.add(available.id);
      usedTeamIds.add(available.name);
      replacements.set(oldTeam.id, available);
      return available;
    }
    return oldTeam;
  };

  const mapMatch = (m: CupMatch): CupMatch => {
    const newHome = getReplacement(m.home);
    const newAway = getReplacement(m.away);
    const isPlayerMatch = newHome.id === state.playerTeamId || newAway.id === state.playerTeamId;
    return {
      ...m,
      home: newHome,
      away: newAway,
      isPlayerMatch,
    };
  };

  const newGroupTeams = state.groupTeams ? state.groupTeams.map(getReplacement) : undefined;
  const newGroupStandings = state.groupStandings
    ? state.groupStandings.map((s) => ({ ...s, team: getReplacement(s.team) }))
    : undefined;

  const newGroupRoundsMatches = state.groupRoundsMatches
    ? state.groupRoundsMatches.map((round) => round.map(mapMatch))
    : undefined;

  const newRoundsMatches = state.roundsMatches
    ? state.roundsMatches.map((round) => round.map(mapMatch))
    : undefined;

  const newOpponentPool = state.opponentPool
    ? state.opponentPool.map(getReplacement)
    : undefined;

  return {
    ...state,
    isNational: isNat,
    groupTeams: newGroupTeams,
    groupStandings: newGroupStandings,
    groupRoundsMatches: newGroupRoundsMatches,
    roundsMatches: newRoundsMatches || [],
    opponentPool: newOpponentPool,
  };
}