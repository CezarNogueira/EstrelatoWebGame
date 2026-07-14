import { Attributes, Player, Position, SeasonStat, Team } from "./types";
import { TEAMS } from "./data";

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
  ATA: { goals: 1.00, assists: 0.55, tackles: 0.15, cleanSheets: 0.25 },
  PON: { goals: 0.75, assists: 0.85, tackles: 0.20, cleanSheets: 0.25 },
  MEI: { goals: 0.55, assists: 1.00, tackles: 0.35, cleanSheets: 0.35 },
  MC:  { goals: 0.30, assists: 0.75, tackles: 0.70, cleanSheets: 0.50 },
  VOL: { goals: 0.12, assists: 0.45, tackles: 1.00, cleanSheets: 0.75 },
  LAT: { goals: 0.10, assists: 0.60, tackles: 0.85, cleanSheets: 0.75 },
  ZAG: { goals: 0.06, assists: 0.30, tackles: 0.95, cleanSheets: 1.00 },
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

  const goals = Math.max(0, Math.round(
    randomInt(2, 20) * performanceRatio * (player.attributes.shooting / 55) * w.goals
  ));
  const assists = Math.max(0, Math.round(
    randomInt(2, 14) * performanceRatio * (player.attributes.passing / 55) * w.assists
  ));

  const tacklesPerMatch = (0.6 + (player.attributes.defending / 99) * 3.4) * w.tackles;
  const tackles = Math.max(0, Math.round(matches * tacklesPerMatch * (0.85 + Math.random() * 0.3)));

  const teamDefenseFactor = Math.min(1, Math.max(0.05,
    (player.attributes.defending / 99) * 0.5 + (player.currentTeam.level / 5) * 0.5
  ));
  const cleanSheetRate = Math.min(0.75, 0.12 + teamDefenseFactor * 0.5) * w.cleanSheets;
  const cleanSheets = Math.min(matches, Math.max(0, Math.round(matches * cleanSheetRate)));

  return { goals, assists, tackles, cleanSheets };
};

// Combines attacking and defensive output into one "worthy of a call-up"
// score, so a great ZAG/LAT/VOL can reach the national team purely on
// tackles and clean sheets, without needing goals or assists.
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
  else if (age < 35) multiplier = 0.5;
  else multiplier = 0.3;

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
    "MC": ["passing", "physical", "dribbling", "defending", "pace", "shooting"],
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
    // If all attributes are 99 or we couldn't allocate
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

  // Awards
  if (stat.individualAwards && stat.individualAwards.includes("Bola de Ouro")) {
    messages.push(`"Absoluto! ${player.name} ganha a Bola de Ouro e entra para a história como o melhor do mundo!"`);
    messages.push(`"Não tem para ninguém! Temporada mágica coroa ${player.name} com a Bola de Ouro."`);
  }

  // Titles
  const wonFinals = stat.finals?.filter(f => f.won) || [];
  if (wonFinals.length > 0) {
    messages.push(`"${player.name} foi fundamental na conquista da ${wonFinals[0].type}!"`);
    if (wonFinals.length > 1) {
      messages.push(`"Temporada vitoriosa! ${player.name} empilha taças com atuações de gala."`);
    }
  }

  // Goals & Assists
  if (stat.goals > 30) {
    messages.push(`"Máquina de gols! ${player.name} aterrorizou as defesas adversárias nesta temporada."`);
  } else if (stat.goals > 15 && stat.assists > 15) {
    messages.push(`"O maestro do time! ${player.name} anota um 'duplo-duplo' com gols e assistências de sobra."`);
  }

  // Defensive awards & standout defensive seasons
  if (stat.individualAwards && (stat.individualAwards.includes("Muralha da Temporada") || stat.individualAwards.includes("Muralha da Base"))) {
    messages.push(`"Intransponível! ${player.name} vira sinônimo de segurança na defesa e conquista a Muralha da Temporada."`);
    messages.push(`"Ninguém passa! ${player.name} anula os atacantes rivais e leva a Muralha da Temporada."`);
  } else if (stat.tackles > 100 && stat.cleanSheets > 10) {
    messages.push(`"Parede na defesa! ${player.name} foi decisivo evitando gols do adversário nesta temporada."`);
  }

  // Pro contract
  if (proContractOffer) {
    messages.push(`"Olho nele! A jovem promessa ${player.name} ganha sua primeira chance no time profissional."`);
    messages.push(`"O futuro chegou? ${player.name} impressiona na base e sobe para os profissionais."`);
  }

  // Transfer
  if (transferOffer) {
    messages.push(`"Fim de ciclo? Gigantes de olho no talento de ${player.name}, o ${transferOffer.name} prepara proposta."`);
  }

  // Training/Attributes
  const attrTotal = Object.values(stat.attributeChanges || {}).reduce((a, b) => a + (b || 0), 0);
  if (attrTotal > 5 && !proContractOffer && !transferOffer && wonFinals.length === 0 && stat.goals < 15) {
     messages.push(`"Evolução visível! ${player.name} focou nos treinos e os resultados físicos e técnicos já aparecem."`);
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

  return messages[Math.floor(Math.random() * messages.length)];
};

export const getReachedFinals = (player: Player, currentOvr: number): string[] => {
  const finals: string[] = [];
  const teamPower = player.currentTeam.level * 20 + currentOvr * 0.5;

  let cupName = "Copa Nacional";
  let leagueName = "Liga Nacional";
  let continentalName = "Copa Continental";
  let clubWCName = "Mundial de Clubes";

  if (player.isPro) {
    const country = player.currentTeam.country;
    if (country === "BR") {
      cupName = "Copa do Brasil";
      leagueName = "Brasileirão";
      continentalName = "Copa Libertadores";
    } else if (country === "EN") {
      cupName = "FA Cup";
      leagueName = "Premier League";
      continentalName = "Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = "La Liga";
      continentalName = "Champions League";
    } else if (country === "DE") {
      cupName = "DFB-Pokal";
      leagueName = "Bundesliga";
      continentalName = "Champions League";
    } else if (country === "FR") {
      cupName = "Coupe de France";
      leagueName = "Ligue 1";
      continentalName = "Champions League";
    } else if (country === "PT") {
      cupName = "Taça de Portugal";
      leagueName = "Primeira Liga";
      continentalName = "Champions League";
    } else if (country === "NL") {
      cupName = "KNVB Cup";
      leagueName = "Eredivisie";
      continentalName = "Champions League";
    } else if (country === "US") {
      cupName = "US Open Cup";
      leagueName = "MLS";
      continentalName = "Copa Libertadores";
    } else if (country === "SA") {
      cupName = "King\'s Cup";
      leagueName = "Saudi Pro League";
      continentalName = "AFC Champions League";
    } else if (country === "AR") {
      cupName = "Copa Argentina";
      leagueName = "Liga Profesional Argentina";
      continentalName = "Copa Libertadores";
    } else if (country === "UY") {
      cupName = "Copa Uruguay";
      leagueName = "Primera División Uruguaya";
      continentalName = "Copa Libertadores";
    }

    if (Math.random() * 100 < teamPower * 0.15) {
      finals.push(cupName);
    }
    if (Math.random() * 100 < (teamPower - 50) * 0.2) {
      finals.push(leagueName);
    }
    if (Math.random() * 100 < (teamPower - 70) * 0.25) {
      finals.push(continentalName);
      if (Math.random() > 0.5 && Math.random() > 0.3) {
        finals.push(clubWCName);
      }
    }
  } else {
    // Torneio de Base
    if (Math.random() * 100 < teamPower * 0.25) {
      finals.push("Torneio de Base");
    }
  }

  // National Team check
  const expectedOvr = player.currentTeam.level * 15 + 35;
  const performanceRatio = Math.min(1.5, Math.max(0.5, currentOvr / expectedOvr));
  // Estimated matches just for this gating calculation - the real season
  // stats are generated later in simulateSeason.
  const estimatedMatches = 30;
  const { goals, assists, tackles, cleanSheets } = generateSeasonMatchStats(player, estimatedMatches, performanceRatio);
  const callScore = getNationalCallScore(goals, assists, tackles, cleanSheets);

  if (currentOvr > 78 && callScore >= 15 && Math.random() > 0.4) {
    if (player.age % 4 === 0 && Math.random() > 0.7) {
      finals.push("Copa do Mundo");
    } else if (player.age % 4 === 2 && Math.random() > 0.6) {
      finals.push("Copa Continental (Seleção)");
    }
  }

  return finals;
};

export const simulateSeason = (
  player: Player,
  prePlayedFinals?: { type: string; won: boolean }[]
): { baseUpdatedPlayer: Player; seasonStat: SeasonStat; transfer?: Team; earnedPoints: number; proContractOffer?: boolean } => {
  const currentOvr = calculateOverall(player.attributes, player.position);
  
  // Match Stats Generation based on CURRENT OVR vs Team Level
  const expectedOvr = player.currentTeam.level * 15 + 35; 
  const performanceRatio = Math.min(1.5, Math.max(0.5, currentOvr / expectedOvr));
  
  const matches = Math.min(50, Math.max(0, Math.round(randomInt(20, 45) * performanceRatio)));
  const { goals, assists, tackles, cleanSheets } = generateSeasonMatchStats(player, matches, performanceRatio);
  const cleanSheetRateThisSeason = matches > 0 ? cleanSheets / matches : 0;

  let nationalTeamCall = false;
  const callScore = getNationalCallScore(goals, assists, tackles, cleanSheets);
  if (currentOvr > 78 && callScore >= 15) {
    if (Math.random() > 0.4) {
      nationalTeamCall = true;
    }
  }

  // Finals Logic
  let finals: { type: string; won: boolean }[] = prePlayedFinals || [];
  
  if (!prePlayedFinals) {
    const reached = getReachedFinals(player, currentOvr);
    finals = reached.map(f => ({ type: f, won: Math.random() > 0.5 }));
    // Adjust for clubWC depending on continental win in legacy flow
    // But since this is a refactor and we usually pass prePlayedFinals, this is mostly fallback.
  }

  let cupName = "Copa Nacional";
  let leagueName = "Liga Nacional";
  let continentalName = "Copa Continental";
  let clubWCName = "Mundial de Clubes";

  if (player.isPro) {
    const country = player.currentTeam.country;
    if (country === "BR") {
      cupName = "Copa do Brasil";
      leagueName = "Brasileirão";
      continentalName = "Copa Libertadores";
    } else if (country === "EN") {
      cupName = "FA Cup";
      leagueName = "Premier League";
      continentalName = "Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = "La Liga";
      continentalName = "Champions League";
    } else if (country === "DE") {
      cupName = "DFB-Pokal";
      leagueName = "Bundesliga";
      continentalName = "Champions League";
    } else if (country === "FR") {
      cupName = "Coupe de France";
      leagueName = "Ligue 1";
      continentalName = "Champions League";
    } else if (country === "PT") {
      cupName = "Taça de Portugal";
      leagueName = "Primeira Liga";
      continentalName = "Champions League";
    } else if (country === "NL") {
      cupName = "KNVB Cup";
      leagueName = "Eredivisie";
      continentalName = "Champions League";
    } else if (country === "US") {
      cupName = "US Open Cup";
      leagueName = "MLS";
      continentalName = "Copa Libertadores";
    } else if (country === "SA") {
      cupName = "King\'s Cup";
      leagueName = "Saudi Pro League";
      continentalName = "AFC Champions League";
    } else if (country === "AR") {
      cupName = "Copa Argentina";
      leagueName = "Liga Profesional Argentina";
      continentalName = "Copa Libertadores";
    } else if (country === "UY") {
      cupName = "Copa Uruguay";
      leagueName = "Primera División Uruguaya";
      continentalName = "Copa Libertadores";
    }
  }

  // Individual Awards
  const individualAwards: string[] = [];
  
  const getArtilheiroString = (competition: string) => {
    const masculine = ["Brasileirão", "Mundial de Clubes", "Torneio de Base"];
    if (masculine.includes(competition)) {
      return `Artilheiro do ${competition}`;
    }
    return `Artilheiro da ${competition}`;
  };

  if (player.isPro) {
    if (goals >= 25 && Math.random() > 0.4) {
      individualAwards.push(getArtilheiroString(leagueName));
    }
    if (finals.some(f => f.type === cupName) && goals >= 8 && Math.random() > 0.5) {
      individualAwards.push(getArtilheiroString(cupName));
    }
    if (finals.some(f => f.type === continentalName) && goals >= 10 && Math.random() > 0.5) {
      individualAwards.push(getArtilheiroString(continentalName));
    }
    if (finals.some(f => f.type === clubWCName) && goals >= 5 && Math.random() > 0.6) {
      individualAwards.push(getArtilheiroString(clubWCName));
    }
    if (finals.some(f => f.type === "Copa do Mundo") && goals >= 6 && Math.random() > 0.6) {
      individualAwards.push("Artilheiro da Copa do Mundo");
    }

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
    const wonLeague = finals.some(f => f.type === leagueName && f.won);

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

    if (wonBallonDor) {
      individualAwards.push("Bola de Ouro");
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
  finals.forEach(f => {
    if (f.won) finalPoints += 4;
  });

  const points = basePoints + finalPoints;

  const newAttributes = applyGrowth(player.attributes, decline); // Only decline applied here
  
  // Transfer Logic based on CURRENT OVR
  let transfer: Team | undefined;
  let proContractOffer = false;

  if (!player.isPro) {
    if (player.age + 1 >= 16 && currentOvr >= 59) {
      proContractOffer = true;
    }
  } else {
    if (currentOvr > player.currentTeam.level * 12 + 45) { // Needs to be better than current tier
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

  const seasonStat: SeasonStat = {
    age: player.age,
    team: player.currentTeam,
    matches,
    goals,
    assists,
    tackles,
    cleanSheets,
    rating: currentOvr,
    attributeChanges: decline, // will be augmented with distributed points later
    nationalTeamCall,
    finals,
    individualAwards,
  };

  const baseUpdatedPlayer: Player = {
    ...player,
    age: player.age + 1,
    attributes: newAttributes,
    history: player.history, // history is not updated yet, will be appended after point distribution
    retired: player.age >= 38 || (player.age >= 34 && Math.random() > 0.7),
    contractYears: player.isPro ? Math.max(0, (player.contractYears || 0) - 1) : 0,
  };

  return { baseUpdatedPlayer, seasonStat, transfer, earnedPoints: points, proContractOffer };
};
