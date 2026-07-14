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
  color: string;
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
  pressMessage?: string;
  injured?: boolean;
  injuryDays?: number; // duração da lesão em dias (4 a 60)
  careerEndingInjury?: boolean; // lesão gravíssima que encerra a carreira (saúde chegou a 0%)
  relationshipLosses?: string[]; // mensagens de brigas e términos
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
  personName: string;
  relationTag: string; // ex: "Melhor Amigo", "Fã", "Conhecida"
  title: string;
  description: string;
  attraction: number; // 0 a 100, exibido como barra
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
};

export type Friend = {
  id: string;
  name: string;
  relationTag: string; // ex: "Amigo de Infância", "Companheiro de Time"
  affinity: number; // 0 a 100
};

export type Girlfriend = {
  id: string;
  name: string;
  relationTag: string;
  affinity: number; // 0 a 100
  sinceAge: number;
};

export type Relationships = {
  family: FamilyMember[];
  friends: Friend[];
  girlfriend: Girlfriend | null;
};

export type Player = {
  name: string;
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
  money: number;
  assets: string[];
  hasPersonalTrainer: boolean;
  hasMasseuse?: boolean;
  usedExclusiveParty?: boolean;
  usedInternationalTrip?: boolean;
  bootSponsor?: string | null;
  bootSponsorSeasonsLeft?: number; // temporadas restantes do contrato de chuteira (dura 5 temporadas)
  relationships: Relationships;
  personal: {
    mood: number;
    health: number;
    social: number;
  };
};
