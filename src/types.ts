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
};

export type Position = "ATA" | "PON" | "MEI" | "MC" | "VOL" | "ZAG" | "LAT";

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
  personal: {
    mood: number;
    health: number;
    social: number;
  };
};
