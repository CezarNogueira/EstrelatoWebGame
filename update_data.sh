cat << 'INNER_EOF' > src/data.ts
import { Team } from "./types";

export const NATIONALITIES = [
  "Brasil",
  "Argentina",
  "França",
  "Inglaterra",
  "Espanha",
  "Itália",
  "Alemanha",
  "Portugal",
  "Holanda",
  "Uruguai"
];

export const TEAMS: Team[] = [
  // BRASIL (BR) - Brasileirão
  { id: "br1", name: "Flamengo", level: 3, color: "#B22222", country: "BR" },
  { id: "br2", name: "Palmeiras", level: 3, color: "#006400", country: "BR" },
  { id: "br3", name: "São Paulo", level: 3, color: "#FF0000", country: "BR" },
  { id: "br4", name: "Atlético Mineiro", level: 2, color: "#000000", country: "BR" },
  { id: "br5", name: "Fluminense", level: 2, color: "#8B0000", country: "BR" },
  { id: "br6", name: "Internacional", level: 2, color: "#FF0000", country: "BR" },
  { id: "br7", name: "Grêmio", level: 2, color: "#0000FF", country: "BR" },
  { id: "br8", name: "Corinthians", level: 2, color: "#FFFFFF", country: "BR" },
  { id: "br9", name: "Cruzeiro", level: 2, color: "#0000CD", country: "BR" },
  { id: "br10", name: "Botafogo", level: 2, color: "#000000", country: "BR" },
  { id: "br11", name: "Athletico Paranaense", level: 2, color: "#FF0000", country: "BR" },
  { id: "br12", name: "Vasco da Gama", level: 2, color: "#000000", country: "BR" },
  { id: "br13", name: "Bahia", level: 2, color: "#0000FF", country: "BR" },
  { id: "br14", name: "Santos", level: 2, color: "#FFFFFF", country: "BR" },
  { id: "br15", name: "Fortaleza", level: 2, color: "#0000FF", country: "BR" },
  { id: "br16", name: "Ceará", level: 1, color: "#000000", country: "BR" },
  { id: "br17", name: "Sport Recife", level: 1, color: "#FF0000", country: "BR" },
  { id: "br18", name: "Vitória", level: 1, color: "#FF0000", country: "BR" },
  { id: "br19", name: "Juventude", level: 1, color: "#008000", country: "BR" },
  { id: "br20", name: "Goiás", level: 1, color: "#008000", country: "BR" },

  // INGLATERRA (EN) - Premier League
  { id: "en1", name: "Manchester City", level: 5, color: "#87CEEB", country: "EN" },
  { id: "en2", name: "Arsenal", level: 5, color: "#FF0000", country: "EN" },
  { id: "en3", name: "Liverpool", level: 5, color: "#FF0000", country: "EN" },
  { id: "en4", name: "Manchester United", level: 4, color: "#FF0000", country: "EN" },
  { id: "en5", name: "Chelsea", level: 4, color: "#0000FF", country: "EN" },
  { id: "en6", name: "Tottenham", level: 4, color: "#FFFFFF", country: "EN" },
  { id: "en7", name: "Newcastle", level: 4, color: "#000000", country: "EN" },
  { id: "en8", name: "Aston Villa", level: 4, color: "#800000", country: "EN" },
  { id: "en9", name: "West Ham", level: 3, color: "#800000", country: "EN" },
  { id: "en10", name: "Brighton", level: 3, color: "#0000FF", country: "EN" },

  // ESPANHA (ES) - La Liga
  { id: "es1", name: "Real Madrid", level: 5, color: "#FFFFFF", country: "ES" },
  { id: "es2", name: "Barcelona", level: 5, color: "#00008B", country: "ES" },
  { id: "es3", name: "Atlético de Madrid", level: 5, color: "#FF0000", country: "ES" },
  { id: "es4", name: "Sevilla", level: 4, color: "#FFFFFF", country: "ES" },
  { id: "es5", name: "Real Sociedad", level: 4, color: "#0000FF", country: "ES" },
  { id: "es6", name: "Villarreal", level: 4, color: "#FFFF00", country: "ES" },
  { id: "es7", name: "Athletic Bilbao", level: 4, color: "#FF0000", country: "ES" },
  { id: "es8", name: "Real Betis", level: 3, color: "#008000", country: "ES" },
  { id: "es9", name: "Valencia", level: 3, color: "#FFFFFF", country: "ES" },
  { id: "es10", name: "Celta de Vigo", level: 3, color: "#87CEEB", country: "ES" },

  // ITÁLIA (IT) - Serie A
  { id: "it1", name: "Inter de Milão", level: 5, color: "#0000FF", country: "IT" },
  { id: "it2", name: "Juventus", level: 5, color: "#000000", country: "IT" },
  { id: "it3", name: "Milan", level: 5, color: "#FF0000", country: "IT" },
  { id: "it4", name: "Napoli", level: 4, color: "#87CEEB", country: "IT" },
  { id: "it5", name: "Roma", level: 4, color: "#800000", country: "IT" },
  { id: "it6", name: "Lazio", level: 4, color: "#87CEEB", country: "IT" },
  { id: "it7", name: "Atalanta", level: 4, color: "#0000FF", country: "IT" },
  { id: "it8", name: "Fiorentina", level: 3, color: "#800080", country: "IT" },
  { id: "it9", name: "Torino", level: 3, color: "#800000", country: "IT" },
  { id: "it10", name: "Bologna", level: 3, color: "#0000FF", country: "IT" },

  // ALEMANHA (DE) - Bundesliga
  { id: "de1", name: "Bayern de Munique", level: 5, color: "#DC143C", country: "DE" },
  { id: "de2", name: "Borussia Dortmund", level: 4, color: "#FFD700", country: "DE" },
  { id: "de3", name: "Bayer Leverkusen", level: 5, color: "#FF0000", country: "DE" },
  { id: "de4", name: "RB Leipzig", level: 4, color: "#FFFFFF", country: "DE" },
  { id: "de5", name: "Eintracht Frankfurt", level: 3, color: "#000000", country: "DE" },
  { id: "de6", name: "Stuttgart", level: 3, color: "#FF0000", country: "DE" },
  { id: "de7", name: "Borussia Mönchengladbach", level: 3, color: "#008000", country: "DE" },
  { id: "de8", name: "Wolfsburg", level: 3, color: "#008000", country: "DE" },

  // FRANÇA (FR) - Ligue 1
  { id: "fr1", name: "PSG", level: 5, color: "#00008B", country: "FR" },
  { id: "fr2", name: "Monaco", level: 4, color: "#FF0000", country: "FR" },
  { id: "fr3", name: "Marseille", level: 4, color: "#87CEEB", country: "FR" },
  { id: "fr4", name: "Lyon", level: 3, color: "#FFFFFF", country: "FR" },
  { id: "fr5", name: "Lille", level: 3, color: "#FF0000", country: "FR" },
  { id: "fr6", name: "Lens", level: 3, color: "#FFD700", country: "FR" },
  { id: "fr7", name: "Nice", level: 3, color: "#000000", country: "FR" },
  { id: "fr8", name: "Rennes", level: 3, color: "#FF0000", country: "FR" },

  // PORTUGAL (PT) - Primeira Liga
  { id: "pt1", name: "Benfica", level: 4, color: "#FF0000", country: "PT" },
  { id: "pt2", name: "Porto", level: 4, color: "#0000FF", country: "PT" },
  { id: "pt3", name: "Sporting", level: 4, color: "#008000", country: "PT" },
  { id: "pt4", name: "Braga", level: 3, color: "#FF0000", country: "PT" },
  { id: "pt5", name: "Vitória Guimarães", level: 2, color: "#FFFFFF", country: "PT" },

  // HOLANDA (NL) - Eredivisie
  { id: "nl1", name: "Ajax", level: 4, color: "#FF0000", country: "NL" },
  { id: "nl2", name: "PSV Eindhoven", level: 4, color: "#FF0000", country: "NL" },
  { id: "nl3", name: "Feyenoord", level: 4, color: "#FF0000", country: "NL" },
  { id: "nl4", name: "AZ Alkmaar", level: 3, color: "#FF0000", country: "NL" },
  { id: "nl5", name: "Twente", level: 3, color: "#FF0000", country: "NL" },

  // ESTADOS UNIDOS (US) - MLS
  { id: "us1", name: "Inter Miami", level: 3, color: "#FFC0CB", country: "US" },
  { id: "us2", name: "LA Galaxy", level: 2, color: "#FFFFFF", country: "US" },
  { id: "us3", name: "Los Angeles FC", level: 3, color: "#000000", country: "US" },
  { id: "us4", name: "Seattle Sounders", level: 2, color: "#008000", country: "US" },
  { id: "us5", name: "New York City FC", level: 2, color: "#87CEEB", country: "US" },

  // ARÁBIA SAUDITA (SA) - Saudi Pro League
  { id: "sa1", name: "Al Hilal", level: 4, color: "#0000FF", country: "SA" },
  { id: "sa2", name: "Al Nassr", level: 4, color: "#FFFF00", country: "SA" },
  { id: "sa3", name: "Al Ittihad", level: 3, color: "#FFFF00", country: "SA" },
  { id: "sa4", name: "Al Ahli", level: 3, color: "#008000", country: "SA" },
  { id: "sa5", name: "Al Shabab", level: 2, color: "#FFFFFF", country: "SA" }
];

export const INITIAL_TEAMS = TEAMS.filter((t) => t.level <= 2);
INNER_EOF
sh update_data.sh