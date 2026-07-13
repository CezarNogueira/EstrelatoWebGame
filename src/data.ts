import { Team } from "./types";

export const TEAMS: Team[] = [
  // Level 1: Base / Pequenos (Brasil)
  { id: "t1", name: "Guarani", level: 1, color: "#006400", country: "BR" },
  { id: "t2", name: "Ponte Preta", level: 1, color: "#000000", country: "BR" },
  { id: "t3", name: "Juventude", level: 1, color: "#008000", country: "BR" },
  { id: "t4", name: "Criciúma", level: 1, color: "#FFD700", country: "BR" },
  { id: "t5", name: "Vila Nova", level: 1, color: "#FF0000", country: "BR" },
  { id: "t_vitoria", name: "Vitória", level: 1, color: "#FF0000", country: "BR" },
  { id: "t_atlg", name: "Atlético Goianiense", level: 1, color: "#FF0000", country: "BR" },
  { id: "t_sport", name: "Sport Recife", level: 1, color: "#FF0000", country: "BR" },
  { id: "t_ceara", name: "Ceará", level: 1, color: "#000000", country: "BR" },
  { id: "t_fort", name: "Fortaleza", level: 1, color: "#0000FF", country: "BR" },
  { id: "t_cori", name: "Coritiba", level: 1, color: "#008000", country: "BR" },
  { id: "t_goias", name: "Goiás", level: 1, color: "#008000", country: "BR" },
  { id: "t_am", name: "América Mineiro", level: 1, color: "#008000", country: "BR" },
  
  // Level 2: Médios / Grandes em reestruturação (Brasil)
  { id: "t6", name: "Santos", level: 2, color: "#FFFFFF", country: "BR" },
  { id: "t7", name: "Vasco da Gama", level: 2, color: "#000000", country: "BR" },
  { id: "t8", name: "Cruzeiro", level: 2, color: "#0000CD", country: "BR" },
  { id: "t9", name: "Botafogo", level: 2, color: "#000000", country: "BR" },
  { id: "t10", name: "Bahia", level: 2, color: "#0000FF", country: "BR" },
  { id: "t_flu", name: "Fluminense", level: 2, color: "#8B0000", country: "BR" },
  { id: "t_int", name: "Internacional", level: 2, color: "#FF0000", country: "BR" },
  { id: "t_gre", name: "Grêmio", level: 2, color: "#0000FF", country: "BR" },
  { id: "t_atl", name: "Atlético Mineiro", level: 2, color: "#000000", country: "BR" },
  { id: "t_ath", name: "Athletico Paranaense", level: 2, color: "#FF0000", country: "BR" },
  { id: "t_cor", name: "Corinthians", level: 2, color: "#FFFFFF", country: "BR" },
  
  // Level 3: Top Brasil / Pequenos Europa
  { id: "t11", name: "Flamengo", level: 3, color: "#B22222", country: "BR" },
  { id: "t12", name: "Palmeiras", level: 3, color: "#006400", country: "BR" },
  { id: "t13", name: "São Paulo", level: 3, color: "#FF0000", country: "BR" },
  { id: "t14", name: "Porto", level: 3, color: "#0000FF", country: "PT" },
  { id: "t15", name: "Benfica", level: 3, color: "#FF0000", country: "PT" },
  { id: "t16", name: "Ajax", level: 3, color: "#FF0000", country: "NL" },

  // Level 4: Médios Europa / Times de Liga Europa
  { id: "t17", name: "Sevilla", level: 4, color: "#FFFFFF", country: "ES" },
  { id: "t18", name: "Roma", level: 4, color: "#800000", country: "IT" },
  { id: "t19", name: "Borussia Dortmund", level: 4, color: "#FFD700", country: "DE" },
  { id: "t20", name: "Tottenham", level: 4, color: "#FFFFFF", country: "EN" },
  { id: "t21", name: "Newcastle", level: 4, color: "#000000", country: "EN" },

  // Level 5: Gigantes Europeus
  { id: "t22", name: "Real Madrid", level: 5, color: "#FFFFFF", country: "ES" },
  { id: "t23", name: "Barcelona", level: 5, color: "#00008B", country: "ES" },
  { id: "t24", name: "Manchester City", level: 5, color: "#87CEEB", country: "EN" },
  { id: "t25", name: "Bayern de Munique", level: 5, color: "#DC143C", country: "DE" },
  { id: "t26", name: "Arsenal", level: 5, color: "#FF0000", country: "EN" },
];

export const INITIAL_TEAMS = TEAMS.filter((t) => t.level <= 2);
