export type Attributes = {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
};

export type Team = {
  id: string;
  name: string;
  level: number; // 1 to 5 stars
  color?: string;
  country: string;
  division?: number;
  logo?: string; // URL do escudo do time (opcional)
};

export type FinalResult = {
  type: string;
  won: boolean;
};

export type SeasonStat = {
  age: number;
  team: Team;
  matches: number;
  goals: number;
  assists: number;
  tackles: number; // desarmes - key stat for ZAG/LAT/VOL
  cleanSheets: number; // jogos sem sofrer gols - key stat for ZAG/LAT/VOL
  rating: number; // overall rating that season
  attributeChanges: Partial<Attributes>; 
  nationalTeamCall?: boolean;
  finals?: FinalResult[];
  individualAwards?: string[];
  ballonDorCandidates?: any[];
  pressMessage?: string;
  injured?: boolean;
  injuryDays?: number; // duração da lesão em dias (4 a 60)
  seasonEndingInjury?: boolean; // lesão gravíssima que tira o jogador da temporada (saúde chegou a 0%)
  isBenched?: boolean;
  isolated?: boolean;
  depressed?: boolean;
  leaguePosition?: number;
  leagueName?: string;
};

export type Position = "ATA" | "PON" | "MEI" | "MC" | "VOL" | "ZAG" | "LAT";

// PlayStyles (inspirado no EAFC): habilidades especiais que garantem o
// sucesso em jogadas raras específicas dentro das partidas/finais
// interativas. Desbloqueados e evoluídos ao atingir certos marcos de Overall
// (64, 80 e 90).
export type PlayStyle =
  | "chute_colocado"
  | "forca_aerea"
  | "tiki_taka"
  | "cruzamento_preciso"
  | "veloz"
  | "xerife";

export type PlayStyleLevel = "bronze" | "prata" | "dourado";

export type PlayerPlayStyle = {
  id: PlayStyle;
  level: PlayStyleLevel;
};

export type RomanceChoiceTone = "safe" | "risky" | "neutral" | "positive";

export type RomanceChoice = {
  id: string;
  label: string;
  tone: RomanceChoiceTone;
};

export type RomanceEvent = {
  id: string;
  friendId?: string; // se for um evento gerado a partir de um amigo
  personName: string;
  relationTag: string; // ex: "Melhor Amigo", "Fã", "Conhecida"
  title: string;
  description: string;
  attraction: number; // 0 a 100, exibido como barra
  age?: number;
  occupation?: string;
  avatarUrl?: string;
  choices: RomanceChoice[];
};

export type FamilyEvent = {
  id: string;
  role: FamilyRole | "Amigo"; // quem causou o evento
  title: string;
  description: string;
  choices: {
    id: string;
    label: string;
    tone: RomanceChoiceTone; 
  }[];
};

export type FamilyRole = "Pai" | "Mãe" | "Irmão" | "Irmã";

export type FamilyMember = {
  id: string;
  name: string;
  role: FamilyRole;
  age: number;
  affinity: number; // 0 a 100, o quão próxima é a relação
  avatarUrl?: string;
};

export type Friend = {
  id: string;
  name: string;
  relationTag: string; // ex: "Amigo de Infância", "Companheiro de Time"
  affinity: number; // 0 a 100
  age?: number;
  occupation?: string;
  avatarUrl?: string;
};

export type Girlfriend = {
  id: string;
  name: string;
  relationTag: string;
  affinity: number; // 0 a 100
  sinceAge: number;
  age?: number;
  occupation?: string;
  avatarUrl?: string;
};

export type Relationships = {
  family: FamilyMember[];
  friends: Friend[];
  girlfriend: Girlfriend | null;
};

export type ChatMessage = {
  sender: "me" | "them";
  text: string;
};

export type ChatState = {
  messages: ChatMessage[];
  hasUnread: boolean;
};

// -----------------------------------------------------------------------------
// Liga ponto a ponto (pontos corridos)
// -----------------------------------------------------------------------------
// Estrutura de dados para simular a liga do jogador rodada a rodada (turno e
// returno, 38 jogos para uma liga de 20 times), em vez de sortear a posição
// final de forma abstrata.
export type LeagueStanding = {
  teamId: string;
  team: Team;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
};

export type LeagueMatch = {
  id: string;
  round: number; // 1-indexed
  home: Team;
  away: Team;
  played: boolean;
  homeGoals?: number;
  awayGoals?: number;
  isPlayerMatch: boolean; // o time do jogador está envolvido nesta partida
  // Preenchidos apenas quando isPlayerMatch é true e a partida já foi
  // resolvida (jogada ou simulada) - usados no "Caixa da Temporada" da Dashboard.
  playerGoals?: number;
  playerAssists?: number;
  playerRating?: number;
};

export type LeagueSeasonState = {
  leagueName: string;
  country: string;
  division: number;
  teams: Team[];
  fixtures: LeagueMatch[];
  standings: LeagueStanding[];
  currentRound: number; // próxima rodada ainda não disputada
  totalRounds: number;
};

export type Player = {
  name: string;
  mode?: "STORY" | "QUICK";
  avatarUrl?: string;
  age: number;
  position: Position;
  attributes: Attributes;
  currentTeam: Team;
  history: SeasonStat[];
  retired: boolean;
  caps: number;
  nationality: string;
  isPro: boolean;
  marketValue: number;
  salary: number;
  contractYears: number;
  squadRole?: "STARTER" | "COMPETING" | "ROTATION";
  money: number;
  assets: string[];
  hasPersonalTrainer: boolean;
  hasMasseuse?: boolean;
  hadFirstKiss?: boolean;
  usedExclusiveParty?: boolean;
  usedInternationalTrip?: boolean;
  bootSponsor?: string | null;
  bootSponsorSeasonsLeft?: number; // temporadas restantes do contrato de chuteira (dura 5 temporadas)
  relationships: Relationships;
  chats?: Record<string, ChatState>;
  personal: {
    mood: number;
    health: number;
    social: number;
  };
  idolClubs?: string[];
  playStyles?: PlayerPlayStyle[];
  playStyleMilestones?: number[]; // marcos de Overall (64, 80, 90) já concedidos
};
