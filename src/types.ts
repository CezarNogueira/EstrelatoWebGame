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
};
