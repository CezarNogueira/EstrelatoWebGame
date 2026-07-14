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
  // BRASIL (BR) - Brasileirão Série A (20 times)
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

  // INGLATERRA (EN) - Premier League (20 times)
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
  { id: "en11", name: "Crystal Palace", level: 3, color: "#C41E3A", country: "EN" },
  { id: "en12", name: "Fulham", level: 3, color: "#FFFFFF", country: "EN" },
  { id: "en13", name: "Wolverhampton", level: 3, color: "#FFA500", country: "EN" },
  { id: "en14", name: "Everton", level: 3, color: "#0000FF", country: "EN" },
  { id: "en15", name: "Brentford", level: 3, color: "#FF0000", country: "EN" },
  { id: "en16", name: "Nottingham Forest", level: 4, color: "#FF0000", country: "EN" },
  { id: "en17", name: "Bournemouth", level: 3, color: "#DC143C", country: "EN" },
  { id: "en18", name: "Sunderland", level: 2, color: "#FF0000", country: "EN" },
  { id: "en19", name: "Burnley", level: 2, color: "#800000", country: "EN" },
  { id: "en20", name: "Leeds United", level: 2, color: "#FFFFFF", country: "EN" },

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

  // ITÁLIA (IT) - Serie A (20 times)
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
  { id: "it11", name: "Udinese", level: 2, color: "#000000", country: "IT" },
  { id: "it12", name: "Genoa", level: 2, color: "#FF0000", country: "IT" },
  { id: "it13", name: "Cagliari", level: 2, color: "#FF0000", country: "IT" },
  { id: "it14", name: "Hellas Verona", level: 2, color: "#FFFF00", country: "IT" },
  { id: "it15", name: "Parma", level: 2, color: "#FFFF00", country: "IT" },
  { id: "it16", name: "Como", level: 2, color: "#0000FF", country: "IT" },
  { id: "it17", name: "Lecce", level: 2, color: "#FFFF00", country: "IT" },
  { id: "it18", name: "Sassuolo", level: 2, color: "#008000", country: "IT" },
  { id: "it19", name: "Cremonese", level: 1, color: "#FF0000", country: "IT" },
  { id: "it20", name: "Pisa", level: 1, color: "#000000", country: "IT" },

  // ALEMANHA (DE) - Bundesliga (18 times)
  { id: "de1", name: "Bayern de Munique", level: 5, color: "#DC143C", country: "DE" },
  { id: "de2", name: "Borussia Dortmund", level: 4, color: "#FFD700", country: "DE" },
  { id: "de3", name: "Bayer Leverkusen", level: 5, color: "#FF0000", country: "DE" },
  { id: "de4", name: "RB Leipzig", level: 4, color: "#FFFFFF", country: "DE" },
  { id: "de5", name: "Eintracht Frankfurt", level: 3, color: "#000000", country: "DE" },
  { id: "de6", name: "Stuttgart", level: 3, color: "#FF0000", country: "DE" },
  { id: "de7", name: "Borussia Mönchengladbach", level: 3, color: "#008000", country: "DE" },
  { id: "de8", name: "Wolfsburg", level: 3, color: "#008000", country: "DE" },
  { id: "de9", name: "Union Berlin", level: 3, color: "#FF0000", country: "DE" },
  { id: "de10", name: "Freiburg", level: 3, color: "#FF0000", country: "DE" },
  { id: "de11", name: "Werder Bremen", level: 3, color: "#008000", country: "DE" },
  { id: "de12", name: "Mainz 05", level: 3, color: "#FF0000", country: "DE" },
  { id: "de13", name: "Augsburg", level: 2, color: "#FF0000", country: "DE" },
  { id: "de14", name: "Hoffenheim", level: 3, color: "#0000FF", country: "DE" },
  { id: "de15", name: "St. Pauli", level: 2, color: "#8B4513", country: "DE" },
  { id: "de16", name: "Heidenheim", level: 2, color: "#FF0000", country: "DE" },
  { id: "de17", name: "Hamburger SV", level: 1, color: "#0000FF", country: "DE" },
  { id: "de18", name: "Köln", level: 2, color: "#FF0000", country: "DE" },

  // FRANÇA (FR) - Ligue 1 (18 times)
  { id: "fr1", name: "PSG", level: 5, color: "#00008B", country: "FR" },
  { id: "fr2", name: "Monaco", level: 4, color: "#FF0000", country: "FR" },
  { id: "fr3", name: "Marseille", level: 4, color: "#87CEEB", country: "FR" },
  { id: "fr4", name: "Lyon", level: 3, color: "#FFFFFF", country: "FR" },
  { id: "fr5", name: "Lille", level: 3, color: "#FF0000", country: "FR" },
  { id: "fr6", name: "Lens", level: 3, color: "#FFD700", country: "FR" },
  { id: "fr7", name: "Nice", level: 3, color: "#000000", country: "FR" },
  { id: "fr8", name: "Rennes", level: 3, color: "#FF0000", country: "FR" },
  { id: "fr9", name: "Strasbourg", level: 3, color: "#0000FF", country: "FR" },
  { id: "fr10", name: "Toulouse", level: 2, color: "#800080", country: "FR" },
  { id: "fr11", name: "Nantes", level: 2, color: "#FFFF00", country: "FR" },
  { id: "fr12", name: "Brest", level: 3, color: "#FF0000", country: "FR" },
  { id: "fr13", name: "Auxerre", level: 2, color: "#FFFFFF", country: "FR" },
  { id: "fr14", name: "Le Havre", level: 2, color: "#0000FF", country: "FR" },
  { id: "fr15", name: "Angers", level: 2, color: "#000000", country: "FR" },
  { id: "fr16", name: "Metz", level: 1, color: "#800000", country: "FR" },
  { id: "fr17", name: "Lorient", level: 1, color: "#FF8C00", country: "FR" },
  { id: "fr18", name: "Paris FC", level: 2, color: "#0000FF", country: "FR" },

  // PORTUGAL (PT) - Primeira Liga (18 times)
  { id: "pt1", name: "Benfica", level: 4, color: "#FF0000", country: "PT" },
  { id: "pt2", name: "Porto", level: 4, color: "#0000FF", country: "PT" },
  { id: "pt3", name: "Sporting", level: 4, color: "#008000", country: "PT" },
  { id: "pt4", name: "Braga", level: 3, color: "#FF0000", country: "PT" },
  { id: "pt5", name: "Vitória Guimarães", level: 2, color: "#FFFFFF", country: "PT" },
  { id: "pt6", name: "Gil Vicente", level: 2, color: "#FFFFFF", country: "PT" },
  { id: "pt7", name: "Santa Clara", level: 2, color: "#008000", country: "PT" },
  { id: "pt8", name: "Famalicão", level: 2, color: "#FFFFFF", country: "PT" },
  { id: "pt9", name: "Moreirense", level: 2, color: "#008000", country: "PT" },
  { id: "pt10", name: "Casa Pia", level: 2, color: "#008000", country: "PT" },
  { id: "pt11", name: "Arouca", level: 2, color: "#FFFF00", country: "PT" },
  { id: "pt12", name: "Estoril", level: 2, color: "#FFFF00", country: "PT" },
  { id: "pt13", name: "Nacional", level: 1, color: "#FFFF00", country: "PT" },
  { id: "pt14", name: "Rio Ave", level: 1, color: "#008000", country: "PT" },
  { id: "pt15", name: "AVS", level: 1, color: "#FFFFFF", country: "PT" },
  { id: "pt16", name: "Alverca", level: 1, color: "#FF0000", country: "PT" },
  { id: "pt17", name: "Tondela", level: 1, color: "#FFFF00", country: "PT" },
  { id: "pt18", name: "Estrela Amadora", level: 1, color: "#FF0000", country: "PT" },

  // HOLANDA (NL) - Eredivisie (18 times)
  { id: "nl1", name: "Ajax", level: 4, color: "#FF0000", country: "NL" },
  { id: "nl2", name: "PSV Eindhoven", level: 4, color: "#FF0000", country: "NL" },
  { id: "nl3", name: "Feyenoord", level: 4, color: "#FF0000", country: "NL" },
  { id: "nl4", name: "AZ Alkmaar", level: 3, color: "#FF0000", country: "NL" },
  { id: "nl5", name: "Twente", level: 3, color: "#FF0000", country: "NL" },
  { id: "nl6", name: "Utrecht", level: 3, color: "#FF0000", country: "NL" },
  { id: "nl7", name: "Go Ahead Eagles", level: 2, color: "#FFFF00", country: "NL" },
  { id: "nl8", name: "NEC Nijmegen", level: 2, color: "#FF0000", country: "NL" },
  { id: "nl9", name: "Sparta Rotterdam", level: 2, color: "#FF0000", country: "NL" },
  { id: "nl10", name: "Fortuna Sittard", level: 2, color: "#FFFF00", country: "NL" },
  { id: "nl11", name: "Heerenveen", level: 2, color: "#0000FF", country: "NL" },
  { id: "nl12", name: "PEC Zwolle", level: 1, color: "#0000FF", country: "NL" },
  { id: "nl13", name: "NAC Breda", level: 1, color: "#FFFF00", country: "NL" },
  { id: "nl14", name: "Groningen", level: 2, color: "#008000", country: "NL" },
  { id: "nl15", name: "Excelsior", level: 1, color: "#FF0000", country: "NL" },
  { id: "nl16", name: "Telstar", level: 1, color: "#FF0000", country: "NL" },
  { id: "nl17", name: "Volendam", level: 1, color: "#FF0000", country: "NL" },
  { id: "nl18", name: "Heracles Almelo", level: 1, color: "#FFFF00", country: "NL" },

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
  { id: "sa5", name: "Al Shabab", level: 2, color: "#FFFFFF", country: "SA" },

  // ARGENTINA (AR) - Campeonato Argentino / Liga Profesional (28 times)
  { id: "ar1", name: "Boca Juniors", level: 4, color: "#003087", country: "AR" },
  { id: "ar2", name: "River Plate", level: 4, color: "#FFFFFF", country: "AR" },
  { id: "ar3", name: "Racing Club", level: 3, color: "#87CEEB", country: "AR" },
  { id: "ar4", name: "Independiente", level: 3, color: "#FF0000", country: "AR" },
  { id: "ar5", name: "San Lorenzo", level: 2, color: "#0000FF", country: "AR" },
  { id: "ar6", name: "Estudiantes", level: 2, color: "#FF0000", country: "AR" },
  { id: "ar7", name: "Vélez Sarsfield", level: 2, color: "#FFFFFF", country: "AR" },
  { id: "ar8", name: "Talleres", level: 2, color: "#0000FF", country: "AR" },
  { id: "ar9", name: "Newell's Old Boys", level: 2, color: "#FF0000", country: "AR" },
  { id: "ar10", name: "Rosario Central", level: 2, color: "#FFFF00", country: "AR" },
  { id: "ar11", name: "Argentinos Juniors", level: 1, color: "#FF0000", country: "AR" },
  { id: "ar12", name: "Huracán", level: 1, color: "#FFFFFF", country: "AR" },
  { id: "ar13", name: "Banfield", level: 1, color: "#008000", country: "AR" },
  { id: "ar14", name: "Lanús", level: 1, color: "#800000", country: "AR" },
  { id: "ar15", name: "Godoy Cruz", level: 1, color: "#0000FF", country: "AR" },
  { id: "ar16", name: "Gimnasia La Plata", level: 2, color: "#87CEEB", country: "AR" },
  { id: "ar17", name: "Defensa y Justicia", level: 2, color: "#800080", country: "AR" },
  { id: "ar18", name: "Tigre", level: 2, color: "#0000FF", country: "AR" },
  { id: "ar19", name: "Platense", level: 1, color: "#800000", country: "AR" },
  { id: "ar20", name: "Barracas Central", level: 1, color: "#FFFFFF", country: "AR" },
  { id: "ar21", name: "Instituto", level: 1, color: "#FF0000", country: "AR" },
  { id: "ar22", name: "Belgrano", level: 2, color: "#87CEEB", country: "AR" },
  { id: "ar23", name: "Central Córdoba", level: 1, color: "#000000", country: "AR" },
  { id: "ar24", name: "Sarmiento", level: 1, color: "#008000", country: "AR" },
  { id: "ar25", name: "Unión Santa Fe", level: 1, color: "#FF0000", country: "AR" },
  { id: "ar26", name: "Colón", level: 1, color: "#FF0000", country: "AR" },
  { id: "ar27", name: "Deportivo Riestra", level: 1, color: "#FFFFFF", country: "AR" },
  { id: "ar28", name: "Independiente Rivadavia", level: 1, color: "#0000FF", country: "AR" },

  // URUGUAI (UY) - Liga AUF Uruguaya / Primera División (16 times)
  { id: "uy1", name: "Peñarol", level: 4, color: "#FFD700", country: "UY" },
  { id: "uy2", name: "Nacional", level: 4, color: "#FFFFFF", country: "UY" },
  { id: "uy3", name: "Defensor Sporting", level: 2, color: "#800080", country: "UY" },
  { id: "uy4", name: "Danubio", level: 2, color: "#0000FF", country: "UY" },
  { id: "uy5", name: "Liverpool FC", level: 1, color: "#FF0000", country: "UY" },
  { id: "uy6", name: "Montevideo Wanderers", level: 1, color: "#000000", country: "UY" },
  { id: "uy7", name: "Cerro", level: 1, color: "#0000FF", country: "UY" },
  { id: "uy8", name: "Rentistas", level: 1, color: "#FFFF00", country: "UY" },
  { id: "uy9", name: "Racing (Montevideo)", level: 2, color: "#FF0000", country: "UY" },
  { id: "uy10", name: "Progreso", level: 1, color: "#FFFFFF", country: "UY" },
  { id: "uy11", name: "Plaza Colonia", level: 1, color: "#0000FF", country: "UY" },
  { id: "uy12", name: "Deportivo Maldonado", level: 1, color: "#FF0000", country: "UY" },
  { id: "uy13", name: "Cerro Largo", level: 1, color: "#008000", country: "UY" },
  { id: "uy14", name: "Miramar Misiones", level: 1, color: "#FFFFFF", country: "UY" },
  { id: "uy15", name: "Central Español", level: 1, color: "#FF0000", country: "UY" },
  { id: "uy16", name: "Juventud de Las Piedras", level: 1, color: "#FFFF00", country: "UY" }
];

export const INITIAL_TEAMS = TEAMS.filter((t) => t.level <= 2);

// Maps the Portuguese nationality labels shown in ChooseNationality to the
// country codes used on Team.country, so the roulette can be restricted to
// clubs from the player's chosen nationality.
export const NATIONALITY_COUNTRY_MAP: Record<string, string> = {
  "Brasil": "BR",
  "Argentina": "AR",
  "França": "FR",
  "Inglaterra": "EN",
  "Espanha": "ES",
  "Itália": "IT",
  "Alemanha": "DE",
  "Portugal": "PT",
  "Holanda": "NL",
  "Uruguai": "UY",
};

// Builds the pool of clubs the Roulette should draw from for a given
// nationality. Prefers lower-tier "youth academy" clubs (level <= 2) from
// that country, since that's where a 14-year-old career normally starts.
// Falls back to any club from that country if it has no low-tier clubs, and
// falls back to the global INITIAL_TEAMS as a last resort so the roulette
// never ends up with an empty pool.
export function getInitialTeamsForNationality(nationality: string): Team[] {
  const countryCode = NATIONALITY_COUNTRY_MAP[nationality];
  if (!countryCode) return INITIAL_TEAMS;

  const youthTeams = TEAMS.filter((t) => t.country === countryCode && t.level <= 2);
  if (youthTeams.length > 0) return youthTeams;

  const countryTeams = TEAMS.filter((t) => t.country === countryCode);
  if (countryTeams.length > 0) return countryTeams;

  return INITIAL_TEAMS;
}
