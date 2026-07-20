import { Attributes, Player, Position, SeasonStat, Team } from "./types";
import { TEAMS, getNationalContinentalCup } from "./data";

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
      weights = { pace: 2, shooting: 3, passing: 0.5, dribbling: 1, defending: 0.2, physical: 1.5 };
      break;
    case "PON":
      weights = { pace: 3, shooting: 1.5, passing: 1.5, dribbling: 3, defending: 0.2, physical: 0.5 };
      break;
    case "MEI":
      weights = { pace: 1.5, shooting: 1.5, passing: 3, dribbling: 3, defending: 0.5, physical: 0.5 };
      break;
    case "MC":
      weights = { pace: 1, shooting: 1, passing: 3, dribbling: 2, defending: 2, physical: 1.5 };
      break;
    case "VOL":
      weights = { pace: 1, shooting: 0.5, passing: 2, dribbling: 1, defending: 3, physical: 2.5 };
      break;
    case "ZAG":
      weights = { pace: 1, shooting: 0.2, passing: 1, dribbling: 0.5, defending: 4, physical: 3 };
      break;
    case "LAT":
      weights = { pace: 3, shooting: 0.5, passing: 2, dribbling: 1.5, defending: 2.5, physical: 1.5 };
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
  ATA: { goals: 1.20, assists: 0.55, tackles: 0.05, cleanSheets: 0.25 },
  PON: { goals: 1.15, assists: 0.85, tackles: 0.20, cleanSheets: 0.25 },
  MEI: { goals: 0.75, assists: 1.40, tackles: 0.25, cleanSheets: 0.35 },
  MC:  { goals: 0.30, assists: 0.75, tackles: 0.70, cleanSheets: 0.50 },
  VOL: { goals: 0.12, assists: 0.45, tackles: 1.00, cleanSheets: 0.75 },
  LAT: { goals: 0.10, assists: 0.60, tackles: 0.85, cleanSheets: 0.75 },
  ZAG: { goals: 0.04, assists: 0.30, tackles: 1.25, cleanSheets: 1.00 },
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
  if (age > 25 && ovr < 80) return "Mediano";
  return "Padrão";
};

export const getSeasonHealthDecline = (age: number): number => {
  if (age <= 18) return 1;
  if (age <= 23) return 4;
  if (age <= 29) return 9;
  return 15;
};

export const generateGrowthPoints = (age: number): { points: number, decline: Partial<Attributes> } => {
  let points = 0;
  const decline: Partial<Attributes> = {};
  
  if (age < 18) {
    points = randomInt(8, 15);
  } else if (age < 24) {
    points = randomInt(4, 8);
  } else if (age < 29) {
    points = randomInt(1, 4);
  } else if (age < 33) {
    points = 0;
    const attrs: (keyof Attributes)[] = ["pace", "shooting", "passing", "dribbling", "defending", "physical"];
    attrs.forEach((attr) => decline[attr] = randomInt(-2, 0));
  } else {
    points = 0;
    const attrs: (keyof Attributes)[] = ["pace", "shooting", "passing", "dribbling", "defending", "physical"];
    attrs.forEach((attr) => decline[attr] = randomInt(-4, -1));
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
  else if (age < 24) multiplier = 1.4;
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
    "VOL": ["defending", "physical", "passing", "pace", "dribbling", "shooting"],
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
    } else {
      messages.push(`"Temporada regular de ${player.name}. Especialistas cobram mais protagonismo."`);
    }
  }

  let chosenMessage = messages[Math.floor(Math.random() * messages.length)];
  return chosenMessage;
};

export const getReachedFinals = (player: Player, currentOvr: number): string[] => {
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

    if (!isDiv2) {
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

  if (currentOvr > 78 && callScore >= 15 && Math.random() > 0.4) {
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
  prePlayedFinals?: { type: string; won: boolean; goals?: number; assists?: number }[]
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

  let matches = Math.round(totalTeamMatches * Math.min(1, Math.max(0.6, performanceRatio)));

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

    if (player.squadRole === "STARTER") {
      isBenched = false; // Always plays
    } else if (currentOvr < requiredOvr) {
      isBenched = true;
      matches = Math.round(matches * 0.25);
      performanceRatio = performanceRatio * 0.8;
    }
  }

  let isolated = false;
  let depressed = false;

  if (player.mode !== "QUICK") {
    if (player.personal.mood === 0) {
      depressed = true;
      matches = 0;
      performanceRatio = 0;
    } else if (player.personal.mood < 50) {
      isolated = true;
      const moodFactor = player.personal.mood / 50;
      matches = Math.round(matches * moodFactor);
      performanceRatio = performanceRatio * (0.6 + moodFactor * 0.4);
    }
  }

  if (injured) {
    const matchesLost = seasonEndingInjury
      ? matches
      : Math.round(totalTeamMatches * Math.min(1, injuryDays / 300));
    matches = Math.max(0, matches - matchesLost);
    performanceRatio = performanceRatio * (0.5 + Math.random() * 0.2);
  }

  let { goals, assists, tackles, cleanSheets } = generateSeasonMatchStats(player, matches, performanceRatio);
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

  if (player.isPro) {
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

    if (goals >= 35 && Math.random() > 0.3) {
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

    // Bola de Ouro
    const wonWC = finals.some(f => f.type === "Copa do Mundo" && f.won);
    const wcTopScorer = individualAwards.includes("Artilheiro da Copa do Mundo");
    const wonCL = finals.some(f => f.type === continentalName && f.won);
    const clTopScorer = individualAwards.includes(getArtilheiroString(continentalName));
    const wonLeague = leaguePosition === 1;

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
            { name: "Neto Santos", club: "Real Madrid", country: "Brasil", ovr: 94, score: 95 },
            { name: "Brendo Silva", club: "Real Madrid", country: "Brasil", ovr: 94, score: 94 },
            { name: "Bernardo Couto", club: "Manchester City", country: "Portugal", ovr: 92, score: 93 },
            { name: "Harry Glow", club: "Real Madrid", country: "Inglaterra", ovr: 91, score: 90 },
            { name: "Robin Backroom", club: "Bayern München", country: "Inglaterra", ovr: 91, score: 88 },
            { name: "Phil Lend", club: "Manchester City", country: "Inglaterra", ovr: 89, score: 86 },
            { name: "Natan Luwis", club: "Manchester City", country: "Espanha", ovr: 90, score: 87 },
            { name: "Renan Sultado", club: "Arsenal", country: "Itália", ovr: 94, score: 84 },
            { name: "Laro Aldo", club: "Barcelona", country: "Espanha", ovr: 93, score: 82 },
            { name: "Flop Bouer", club: "Bayer Leverkusen", country: "Alemanha", ovr: 92, score: 85 }
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
  finalPoints += artilheiroCount * 4;
  
  const muralhaCount = individualAwards.filter(a => a.includes("Muralha")).length;
  finalPoints += muralhaCount * 2;
  
  const chuteiraCount = individualAwards.filter(a => a.includes("Chuteira de Ouro")).length;
  finalPoints += chuteiraCount * 2;

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
    finalPoints += 1; // Campeão da liga
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
  if (newGirlfriend) {
    newGirlfriend.affinity = Math.max(0, newGirlfriend.affinity - randomInt(1, 3));
  }

  const newRelationships = {
    family: newFamily,
    friends: newFriends,
    girlfriend: newGirlfriend
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

  const seasonStatObj: SeasonStat = {
    age: player.age,
    team: player.currentTeam,
    matches,
    goals,
    assists,
    tackles,
    cleanSheets,
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

  if (baseUpdatedPlayer.chats && baseUpdatedPlayer.chats["treinador"]) {
    baseUpdatedPlayer.chats = { ...baseUpdatedPlayer.chats };
    delete baseUpdatedPlayer.chats["treinador"];
  }

  return { baseUpdatedPlayer, seasonStat: seasonStatObj, transfer, earnedPoints: points, proContractOffer };
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

  // 1. Jogar 6 Temporadas como titular pelo clube.
  const starterSeasons = history.filter(s => !s.isBenched).length;
  if (starterSeasons >= 6) {
    currentIdols.add(club);
    return { idolClubs: Array.from(currentIdols), newIdol: { club, reason: "Você completou 6 temporadas como titular pelo clube, demonstrando dedicação e lealdade!" } };
  }

  // 2. Ganhar 2 Copa Continental pelo clube.
  // 3. Ganhar 4 Liga Nacional pelo clube.
  let continentalWins = 0;
  let nationalLeagueWins = 0;
  history.forEach(s => {
    if (s.leaguePosition === 1) nationalLeagueWins++;
    if (s.finals) {
      // Need to find what continental cup name is for this club
      const continentalName = "Copa Continental"; // We can just check if any final name contains "Champions League", "Libertadores" etc
      const isContinental = (name: string) => name.includes("Champions League") || name.includes("Libertadores");
      if (s.finals.some(f => f.won && isContinental(f.type))) {
        continentalWins++;
      }
    }
  });

  if (continentalWins >= 2) {
    currentIdols.add(club);
    return { idolClubs: Array.from(currentIdols), newIdol: { club, reason: "Suas atuações históricas e 2 conquistas continentais te eternizaram na história do clube!" } };
  }
  
  if (nationalLeagueWins >= 4) {
    currentIdols.add(club);
    return { idolClubs: Array.from(currentIdols), newIdol: { club, reason: "Hegemonia nacional! Suas 4 conquistas de Liga Nacional te tornaram uma lenda do clube!" } };
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
