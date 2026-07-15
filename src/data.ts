import { Team, FamilyMember, Friend, Relationships } from "./types";
import AthleticoParanaenseLogo from "./assets/teams/AthleticoParanaense.png";
import FlamengoLogo from "./assets/teams/Flamengo.png";
import PalmeirasLogo from "./assets/teams/Palmeiras.png";
import SaoPauloLogo from "./assets/teams/SaoPaulo.png";
import InternacionalLogo from "./assets/teams/Internacional.png";
import GremioLogo from "./assets/teams/Gremio.png";
import CorinthiansLogo from "./assets/teams/Corinthians.png";
import CruzeiroLogo from "./assets/teams/Cruzeiro.png";
import FluminenseLogo from "./assets/teams/Fluminense.png";
import BotafogoLogo from "./assets/teams/Botafogo.png";
import RemoLogo from "./assets/teams/Remo.png";
import AtleticoMineiroLogo from "./assets/teams/AtleticoMineiro.png";
import BahiaLogo from "./assets/teams/Bahia.png";
import FortalezaLogo from "./assets/teams/Fortaleza.png";
import CearaLogo from "./assets/teams/Ceara.png";
import VitoriaLogo from "./assets/teams/Vitoria.png";
import JuventudeLogo from "./assets/teams/Juventude.png";
import VascodaGamaLogo from "./assets/teams/VascodaGama.png";
import SantosLogo from "./assets/teams/Santos.png";
import GoiasLogo from "./assets/teams/Goias.png";
import ChapecoenseLogo from "./assets/teams/Chapecoense.png";
import BragantinoLogo from "./assets/teams/Bragantino.png";
import CoritibaLogo from "./assets/teams/Coritiba.png";

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
  // BRASIL (BR) - Div 1
  { id: "br1", name: "Flamengo", level: 3, color: "#FF0000", country: "BR", logo: FlamengoLogo },
  { id: "br2", name: "Palmeiras", level: 3, color: "#008000", country: "BR", logo: PalmeirasLogo },
  { id: "br3", name: "São Paulo", level: 3, color: "#FF1000", country: "BR", logo: SaoPauloLogo },
  { id: "br4", name: "Atlético Mineiro", level: 2, color: "#FFFFFF", country: "BR", logo: AtleticoMineiroLogo },
  { id: "br5", name: "Fluminense", level: 3, color: "#3d9e10", country: "BR", logo: FluminenseLogo },
  { id: "br6", name: "Internacional", level: 3, color: "#FFFF00", country: "BR", logo: InternacionalLogo },
  { id: "br7", name: "Grêmio", level: 2, color: "#800080", country: "BR", logo: GremioLogo },
  { id: "br8", name: "Corinthians", level: 3, color: "#FFA500", country: "BR", logo: CorinthiansLogo },
  { id: "br9", name: "Cruzeiro", level: 3, color: "#FF0000", country: "BR", logo: CruzeiroLogo },
  { id: "br10", name: "Botafogo", level: 3, color: "#0000FF", country: "BR", logo: BotafogoLogo },
  { id: "br11", name: "Athletico Paranaense", level: 2, color: "#008000", country: "BR", logo: AthleticoParanaenseLogo },
  { id: "br12", name: "Vasco da Gama", level: 2, color: "#FFFFFF", country: "BR", logo: VascodaGamaLogo },
  { id: "br13", name: "Bahia", level: 2, color: "#000000", country: "BR", logo: BahiaLogo },
  { id: "br14", name: "Santos", level: 2, color: "#FFFF00", country: "BR", logo: SantosLogo },
  { id: "br15", name: "Fortaleza", level: 2, color: "#800080", country: "BR", logo: FortalezaLogo },
  { id: "br16", name: "Ceará", level: 1, color: "#FFA500", country: "BR", logo: CearaLogo },
  { id: "br17", name: "Sport Recife", level: 1, color: "#FF0000", country: "BR" },
  { id: "br18", name: "Vitória", level: 1, color: "#0000FF", country: "BR", logo: VitoriaLogo },
  { id: "br19", name: "Juventude", level: 1, color: "#008000", country: "BR", logo: JuventudeLogo },
  { id: "br20", name: "Goiás", level: 1, color: "#FFFFFF", country: "BR", logo: GoiasLogo },
  // BRASIL (BR) - Div 2
  { id: "br21", name: "Guarani", level: 1, color: "#FF0000", country: "BR", division: 2 },
  { id: "br22", name: "Ponte Preta", level: 1, color: "#0000FF", country: "BR", division: 2 },
  { id: "br23", name: "Vila Nova", level: 1, color: "#008000", country: "BR", division: 2 },
  { id: "br24", name: "Coritiba", level: 1, color: "#FFFFFF", country: "BR", division: 2, logo: CoritibaLogo },
  { id: "br25", name: "América Mineiro", level: 1, color: "#000000", country: "BR", division: 2 },
  { id: "br26", name: "Criciúma", level: 1, color: "#FFFF00", country: "BR", division: 2 },
  { id: "br27", name: "Avaí", level: 1, color: "#800080", country: "BR", division: 2 },
  { id: "br28", name: "Chapecoense", level: 1, color: "#FFA500", country: "BR", division: 2, logo: ChapecoenseLogo },
  { id: "br29", name: "CRB", level: 1, color: "#FF0000", country: "BR", division: 2 },
  { id: "br30", name: "Novorizontino", level: 1, color: "#0000FF", country: "BR", division: 2 },
  { id: "br31", name: "Mirassol", level: 1, color: "#008000", country: "BR", division: 2 },
  { id: "br32", name: "Paysandu", level: 1, color: "#FFFFFF", country: "BR", division: 2 },
  { id: "br33", name: "Remo", level: 1, color: "#000000", country: "BR", division: 2, logo: RemoLogo },
  { id: "br34", name: "Ituano", level: 1, color: "#FFFF00", country: "BR", division: 2 },
  { id: "br35", name: "Bragantino", level: 1, color: "#b1b1b1", country: "BR", division: 2, logo: BragantinoLogo },
  { id: "br36", name: "Operário", level: 1, color: "#FFA500", country: "BR", division: 2 },
  { id: "br37", name: "Amazonas", level: 1, color: "#FF0000", country: "BR", division: 2 },
  { id: "br38", name: "Botafogo-SP", level: 1, color: "#0000FF", country: "BR", division: 2 },
  { id: "br39", name: "Tombense", level: 1, color: "#008000", country: "BR", division: 2 },
  { id: "br40", name: "Sampaio Corrêa", level: 1, color: "#FFFFFF", country: "BR", division: 2 },
  // INGLATERRA (EN) - Div 1
  { id: "en41", name: "Manchester City", level: 5, color: "#FF0000", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/0/02/Manchester_City_Football_Club.png/120px-Manchester_City_Football_Club.png" },
  { id: "en42", name: "Arsenal", level: 5, color: "#0000FF", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/5/53/Arsenal_FC.svg/120px-Arsenal_FC.svg.png" },
  { id: "en43", name: "Liverpool", level: 5, color: "#008000", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Liverpool-Montage.jpg/330px-Liverpool-Montage.jpg" },
  { id: "en44", name: "Manchester United", level: 4, color: "#FFFFFF", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/b/b6/Manchester_United_FC_logo.png/120px-Manchester_United_FC_logo.png" },
  { id: "en45", name: "Chelsea", level: 4, color: "#000000", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/London_%2C_Chelsea_-_Gunter_Grove_-_geograph.org.uk_-_2408961.jpg/250px-London_%2C_Chelsea_-_Gunter_Grove_-_geograph.org.uk_-_2408961.jpg" },
  { id: "en46", name: "Tottenham", level: 4, color: "#FFFF00", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tesco_South_Tottenham_%287664380178%29_%282%29.jpg/250px-Tesco_South_Tottenham_%287664380178%29_%282%29.jpg" },
  { id: "en47", name: "Newcastle", level: 4, color: "#800080", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/2/25/Newcastle_United_Logo.png/120px-Newcastle_United_Logo.png" },
  { id: "en48", name: "Aston Villa", level: 4, color: "#FFA500", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/1/15/Aston_Villa.svg/120px-Aston_Villa.svg.png" },
  { id: "en49", name: "West Ham", level: 3, color: "#FF0000", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/1/1d/West_Ham_United_FC_logo.png/120px-West_Ham_United_FC_logo.png" },
  { id: "en50", name: "Brighton", level: 3, color: "#0000FF", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Brighton.UK.JPG/330px-Brighton.UK.JPG" },
  { id: "en51", name: "Crystal Palace", level: 3, color: "#008000", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/c/c1/Crystal_Palace_FC_logo.png/250px-Crystal_Palace_FC_logo.png" },
  { id: "en52", name: "Fulham", level: 3, color: "#FFFFFF", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Fulham_Palace_courtyard_-_geograph.org.uk_-_835758.jpg/250px-Fulham_Palace_courtyard_-_geograph.org.uk_-_835758.jpg" },
  { id: "en53", name: "Brentford", level: 3, color: "#000000", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/USA_South_Dakota_location_map.svg/330px-USA_South_Dakota_location_map.svg.png" },
  { id: "en54", name: "Everton", level: 3, color: "#FFFF00", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/a/ae/Everton_FC_logo_2014.png/120px-Everton_FC_logo_2014.png" },
  { id: "en55", name: "Nottingham Forest", level: 3, color: "#800080", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/a/a2/Nottingham_Forest.png/120px-Nottingham_Forest.png" },
  { id: "en56", name: "Bournemouth", level: 2, color: "#FFA500", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Bournemouth_-_Seafront_-_geograph.org.uk_-_838983.jpg/250px-Bournemouth_-_Seafront_-_geograph.org.uk_-_838983.jpg" },
  { id: "en57", name: "Wolverhampton", level: 2, color: "#FF0000", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Wolverhampton.jpg/250px-Wolverhampton.jpg" },
  { id: "en58", name: "Leicester City", level: 2, color: "#0000FF", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/0/0e/LeicesterCity_logo2014.png/120px-LeicesterCity_logo2014.png" },
  { id: "en59", name: "Southampton", level: 2, color: "#008000", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Southampton_from_Aurora_01.JPG/330px-Southampton_from_Aurora_01.JPG" },
  { id: "en60", name: "Ipswich Town", level: 2, color: "#FFFFFF", country: "EN", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/2/2a/Ipswich_Town_FC.png/120px-Ipswich_Town_FC.png" },
  // INGLATERRA (EN) - Div 2
  { id: "en61", name: "Leeds United", level: 1, color: "#FF0000", country: "EN", division: 2 },
  { id: "en62", name: "Sunderland", level: 1, color: "#0000FF", country: "EN", division: 2 },
  { id: "en63", name: "Sheffield United", level: 1, color: "#008000", country: "EN", division: 2 },
  { id: "en64", name: "West Bromwich", level: 1, color: "#FFFFFF", country: "EN", division: 2 },
  { id: "en65", name: "Norwich City", level: 1, color: "#000000", country: "EN", division: 2 },
  { id: "en66", name: "Burnley", level: 1, color: "#FFFF00", country: "EN", division: 2 },
  { id: "en67", name: "Luton Town", level: 1, color: "#800080", country: "EN", division: 2 },
  { id: "en68", name: "Middlesbrough", level: 1, color: "#FFA500", country: "EN", division: 2 },
  { id: "en69", name: "Coventry City", level: 1, color: "#FF0000", country: "EN", division: 2 },
  { id: "en70", name: "Preston North End", level: 1, color: "#0000FF", country: "EN", division: 2 },
  { id: "en71", name: "Hull City", level: 1, color: "#008000", country: "EN", division: 2 },
  { id: "en72", name: "Cardiff City", level: 1, color: "#FFFFFF", country: "EN", division: 2 },
  { id: "en73", name: "Bristol City", level: 1, color: "#000000", country: "EN", division: 2 },
  { id: "en74", name: "Swansea City", level: 1, color: "#FFFF00", country: "EN", division: 2 },
  { id: "en75", name: "Watford", level: 1, color: "#800080", country: "EN", division: 2 },
  { id: "en76", name: "Stoke City", level: 1, color: "#FFA500", country: "EN", division: 2 },
  { id: "en77", name: "QPR", level: 1, color: "#FF0000", country: "EN", division: 2 },
  { id: "en78", name: "Blackburn Rovers", level: 1, color: "#0000FF", country: "EN", division: 2 },
  { id: "en79", name: "Sheffield Wednesday", level: 1, color: "#008000", country: "EN", division: 2 },
  { id: "en80", name: "Millwall", level: 1, color: "#FFFFFF", country: "EN", division: 2 },
  // ITÁLIA (IT) - Div 1
  { id: "it81", name: "Inter", level: 4, color: "#FF0000", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/250px-FC_Internazionale_Milano_2021.svg.png" },
  { id: "it82", name: "Milan", level: 4, color: "#0000FF", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/120px-Logo_of_AC_Milan.svg.png" },
  { id: "it83", name: "Juventus", level: 4, color: "#008000", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg/250px-Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg.png" },
  { id: "it84", name: "Napoli", level: 4, color: "#FFFFFF", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Napoli-Montaggio.jpg/330px-Napoli-Montaggio.jpg" },
  { id: "it85", name: "Roma", level: 4, color: "#000000", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Rome_skyline_panorama.jpg/330px-Rome_skyline_panorama.jpg" },
  { id: "it86", name: "Lazio", level: 3, color: "#FFFF00", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Flag_of_Lazio.svg/120px-Flag_of_Lazio.svg.png" },
  { id: "it87", name: "Atalanta", level: 3, color: "#800080", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Parque_Mata_Atl%C3%A2ntica.jpg/330px-Parque_Mata_Atl%C3%A2ntica.jpg" },
  { id: "it88", name: "Fiorentina", level: 3, color: "#FFA500", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg/250px-ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg.png" },
  { id: "it89", name: "Torino", level: 3, color: "#FF0000", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Turin_Montage.png/330px-Turin_Montage.png" },
  { id: "it90", name: "Bologna", level: 3, color: "#0000FF", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bologna_F.C._1909_logo.svg/120px-Bologna_F.C._1909_logo.svg.png" },
  { id: "it91", name: "Sassuolo", level: 3, color: "#008000", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sassuolo_Via_Menotti.jpg/330px-Sassuolo_Via_Menotti.jpg" },
  { id: "it92", name: "Genoa", level: 3, color: "#FFFFFF", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Genova_panorama_centro_storico_da_villetta_Di_Negro.jpg/330px-Genova_panorama_centro_storico_da_villetta_Di_Negro.jpg" },
  { id: "it93", name: "Udinese", level: 3, color: "#000000", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/1/19/Udinese_Calcio.png/120px-Udinese_Calcio.png" },
  { id: "it94", name: "Verona", level: 2, color: "#FFFF00", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Collage_Verona.jpg/330px-Collage_Verona.jpg" },
  { id: "it95", name: "Empoli", level: 2, color: "#800080", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Empoli_central_square.jpg/330px-Empoli_central_square.jpg" },
  { id: "it96", name: "Monza", level: 2, color: "#FFA500", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Reggia_di_Monza.jpg/330px-Reggia_di_Monza.jpg" },
  { id: "it97", name: "Lecce", level: 2, color: "#FF0000", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Square_in_Lecce.jpg/330px-Square_in_Lecce.jpg" },
  { id: "it98", name: "Cagliari", level: 2, color: "#0000FF", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Collage_Cagliari.jpg/330px-Collage_Cagliari.jpg" },
  { id: "it99", name: "Como", level: 2, color: "#008000", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/BrunateComo1.jpg/330px-BrunateComo1.jpg" },
  { id: "it100", name: "Venezia", level: 2, color: "#FFFFFF", country: "IT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Venezia_aerial_view.jpg/330px-Venezia_aerial_view.jpg" },
  // ITÁLIA (IT) - Div 2
  { id: "it101", name: "Sampdoria", level: 1, color: "#FF0000", country: "IT", division: 2 },
  { id: "it102", name: "Palermo", level: 1, color: "#0000FF", country: "IT", division: 2 },
  { id: "it103", name: "Bari", level: 1, color: "#008000", country: "IT", division: 2 },
  { id: "it104", name: "Brescia", level: 1, color: "#FFFFFF", country: "IT", division: 2 },
  { id: "it105", name: "Cremonese", level: 1, color: "#000000", country: "IT", division: 2 },
  { id: "it106", name: "Frosinone", level: 1, color: "#FFFF00", country: "IT", division: 2 },
  { id: "it107", name: "Salernitana", level: 1, color: "#800080", country: "IT", division: 2 },
  { id: "it108", name: "Pisa", level: 1, color: "#FFA500", country: "IT", division: 2 },
  { id: "it109", name: "Catanzaro", level: 1, color: "#FF0000", country: "IT", division: 2 },
  { id: "it110", name: "Modena", level: 1, color: "#0000FF", country: "IT", division: 2 },
  { id: "it111", name: "Reggiana", level: 1, color: "#008000", country: "IT", division: 2 },
  { id: "it112", name: "Sudtirol", level: 1, color: "#FFFFFF", country: "IT", division: 2 },
  { id: "it113", name: "Cosenza", level: 1, color: "#000000", country: "IT", division: 2 },
  { id: "it114", name: "Spezia", level: 1, color: "#FFFF00", country: "IT", division: 2 },
  { id: "it115", name: "Cittadella", level: 1, color: "#800080", country: "IT", division: 2 },
  { id: "it116", name: "Ternana", level: 1, color: "#FFA500", country: "IT", division: 2 },
  { id: "it117", name: "Ascoli", level: 1, color: "#FF0000", country: "IT", division: 2 },
  { id: "it118", name: "Feralpisalò", level: 1, color: "#0000FF", country: "IT", division: 2 },
  { id: "it119", name: "Lecco", level: 1, color: "#008000", country: "IT", division: 2 },
  { id: "it120", name: "Mantova", level: 1, color: "#FFFFFF", country: "IT", division: 2 },
  // ESPANHA (ES) - Div 1
  { id: "es121", name: "Real Madrid", level: 5, color: "#FF0000", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/9/98/Real_Madrid.png/120px-Real_Madrid.png" },
  { id: "es122", name: "Barcelona", level: 5, color: "#0000FF", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg/330px-Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg" },
  { id: "es123", name: "Atlético de Madrid", level: 4, color: "#008000", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/c/c1/Atletico_Madrid_logo.svg/120px-Atletico_Madrid_logo.svg.png" },
  { id: "es124", name: "Sevilla", level: 4, color: "#FFFFFF", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Collage_de_la_ciudad_de_Sevilla%2C_capital_de_Andaluc%C3%ADa%2C_Espa%C3%B1a.png/330px-Collage_de_la_ciudad_de_Sevilla%2C_capital_de_Andaluc%C3%ADa%2C_Espa%C3%B1a.png" },
  { id: "es125", name: "Real Sociedad", level: 4, color: "#000000", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/c/c2/Real_Sociedad_de_Futbol.png/120px-Real_Sociedad_de_Futbol.png" },
  { id: "es126", name: "Villarreal", level: 4, color: "#FFFF00", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pra%C3%A7a_Vila_Real.jpg/330px-Pra%C3%A7a_Vila_Real.jpg" },
  { id: "es127", name: "Athletic Bilbao", level: 3, color: "#800080", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/9/90/Athletic_Club_de_Bilbao.png/120px-Athletic_Club_de_Bilbao.png" },
  { id: "es128", name: "Real Betis", level: 3, color: "#FFA500", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/1/17/Real_Betis_Balompi%C3%A9.png/250px-Real_Betis_Balompi%C3%A9.png" },
  { id: "es129", name: "Valencia", level: 3, color: "#FF0000", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Collage_de_la_ciudad_de_Valencia%2C_capital_de_la_Comunidad_Valenciana%2C_Espa%C3%B1a.png/330px-Collage_de_la_ciudad_de_Valencia%2C_capital_de_la_Comunidad_Valenciana%2C_Espa%C3%B1a.png" },
  { id: "es130", name: "Osasuna", level: 3, color: "#0000FF", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/3/39/CA_Osasuna.png/120px-CA_Osasuna.png" },
  { id: "es131", name: "Celta de Vigo", level: 3, color: "#008000", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/3/3d/Celta_de_Vigo.png/250px-Celta_de_Vigo.png" },
  { id: "es132", name: "Getafe", level: 3, color: "#FFFFFF", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Cerro-angeles1.jpg/330px-Cerro-angeles1.jpg" },
  { id: "es133", name: "Mallorca", level: 2, color: "#000000", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Can_Picafort_beach.jpg/250px-Can_Picafort_beach.jpg" },
  { id: "es134", name: "Alavés", level: 2, color: "#FFFF00", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Deportivo_Alaves_logo_%282020%29.svg/250px-Deportivo_Alaves_logo_%282020%29.svg.png" },
  { id: "es135", name: "Las Palmas", level: 2, color: "#800080", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Collage_Las_Palmas_de_Gran_Canaria.jpg/330px-Collage_Las_Palmas_de_Gran_Canaria.jpg" },
  { id: "es136", name: "Rayo Vallecano", level: 2, color: "#FFA500", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/pt/b/b2/Rayo_Vallecano_de_Madrid.png" },
  { id: "es137", name: "Girona", level: 2, color: "#FF0000", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Girona_-_Riu_Onyar_3_exposed.jpg/330px-Girona_-_Riu_Onyar_3_exposed.jpg" },
  { id: "es138", name: "Leganés", level: 2, color: "#0000FF", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Leganes-panoramica-040711.jpg/330px-Leganes-panoramica-040711.jpg" },
  { id: "es139", name: "Valladolid", level: 2, color: "#008000", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Ciudad_de_Valladolid%2C_desde_el_aire.jpg/330px-Ciudad_de_Valladolid%2C_desde_el_aire.jpg" },
  { id: "es140", name: "Espanyol", level: 2, color: "#FFFFFF", country: "ES", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/2/29/Rcd_espanyol_logo.png/120px-Rcd_espanyol_logo.png" },
  // ESPANHA (ES) - Div 2
  { id: "es141", name: "Real Zaragoza", level: 1, color: "#FF0000", country: "ES", division: 2 },
  { id: "es142", name: "Sporting Gijón", level: 1, color: "#0000FF", country: "ES", division: 2 },
  { id: "es143", name: "Real Oviedo", level: 1, color: "#008000", country: "ES", division: 2 },
  { id: "es144", name: "Tenerife", level: 1, color: "#FFFFFF", country: "ES", division: 2 },
  { id: "es145", name: "Levante", level: 1, color: "#000000", country: "ES", division: 2 },
  { id: "es146", name: "Cadiz", level: 1, color: "#FFFF00", country: "ES", division: 2 },
  { id: "es147", name: "Almeria", level: 1, color: "#800080", country: "ES", division: 2 },
  { id: "es148", name: "Granada", level: 1, color: "#FFA500", country: "ES", division: 2 },
  { id: "es149", name: "Eibar", level: 1, color: "#FF0000", country: "ES", division: 2 },
  { id: "es150", name: "Racing Santander", level: 1, color: "#0000FF", country: "ES", division: 2 },
  { id: "es151", name: "Elche", level: 1, color: "#008000", country: "ES", division: 2 },
  { id: "es152", name: "Burgos", level: 1, color: "#FFFFFF", country: "ES", division: 2 },
  { id: "es153", name: "Huesca", level: 1, color: "#000000", country: "ES", division: 2 },
  { id: "es154", name: "Cartagena", level: 1, color: "#FFFF00", country: "ES", division: 2 },
  { id: "es155", name: "Mirandés", level: 1, color: "#800080", country: "ES", division: 2 },
  { id: "es156", name: "Albacete", level: 1, color: "#FFA500", country: "ES", division: 2 },
  { id: "es157", name: "Deportivo La Coruña", level: 1, color: "#FF0000", country: "ES", division: 2 },
  { id: "es158", name: "Málaga", level: 1, color: "#0000FF", country: "ES", division: 2 },
  { id: "es159", name: "Castellón", level: 1, color: "#008000", country: "ES", division: 2 },
  { id: "es160", name: "Córdoba", level: 1, color: "#FFFFFF", country: "ES", division: 2 },
  // ALEMANHA (DE) - Div 1
  { id: "de161", name: "Bayern de Munique", level: 5, color: "#FF0000", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg/250px-FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg.png" },
  { id: "de162", name: "Borussia Dortmund", level: 5, color: "#0000FF", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/120px-Borussia_Dortmund_logo.svg.png" },
  { id: "de163", name: "RB Leipzig", level: 4, color: "#008000", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/6/65/RB_Leipzig_2020_Logo.png/250px-RB_Leipzig_2020_Logo.png" },
  { id: "de164", name: "Bayer Leverkusen", level: 4, color: "#FFFFFF", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/a/a2/Bayer_Leverkusen.png/250px-Bayer_Leverkusen.png" },
  { id: "de165", name: "Eintracht Frankfurt", level: 4, color: "#000000", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Logo_Eintracht_Frankfurt_1970_-_1977.gif" },
  { id: "de166", name: "Stuttgart", level: 4, color: "#FFFF00", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/VfB_Stuttgart_1893_Logo.svg/120px-VfB_Stuttgart_1893_Logo.svg.png" },
  { id: "de167", name: "Wolfsburg", level: 3, color: "#800080", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Wolfsburgskyline2-2.jpg/330px-Wolfsburgskyline2-2.jpg" },
  { id: "de168", name: "Borussia Mönchengladbach", level: 3, color: "#FFA500", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Borussia_M%C3%B6nchengladbach_logo.svg/120px-Borussia_M%C3%B6nchengladbach_logo.svg.png" },
  { id: "de169", name: "Freiburg", level: 3, color: "#FF0000", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Freiburg_im_Breisgau_M%C3%BCnster.jpg/250px-Freiburg_im_Breisgau_M%C3%BCnster.jpg" },
  { id: "de170", name: "Werder Bremen", level: 3, color: "#0000FF", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/SV-Werder-Bremen-Logo.svg/120px-SV-Werder-Bremen-Logo.svg.png" },
  { id: "de171", name: "Hoffenheim", level: 3, color: "#008000", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Hoffenheim-waibst-str-web.jpg/250px-Hoffenheim-waibst-str-web.jpg" },
  { id: "de172", name: "Mainz 05", level: 2, color: "#FFFFFF", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Logo_Mainz_05.svg/250px-Logo_Mainz_05.svg.png" },
  { id: "de173", name: "Augsburg", level: 2, color: "#000000", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Augsburg_-_Markt.jpg/330px-Augsburg_-_Markt.jpg" },
  { id: "de174", name: "Union Berlin", level: 2, color: "#FFFF00", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/1._FC_Union_Berlin_Logo.svg/250px-1._FC_Union_Berlin_Logo.svg.png" },
  { id: "de175", name: "Bochum", level: 2, color: "#800080", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Bochum_080814_023_30.jpg/330px-Bochum_080814_023_30.jpg" },
  { id: "de176", name: "Heidenheim", level: 2, color: "#FFA500", country: "DE" },
  { id: "de177", name: "St. Pauli", level: 2, color: "#FF0000", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Hamburg%2C_Landungsbr%C3%BCcken_--_2016_--_3131-7.jpg/250px-Hamburg%2C_Landungsbr%C3%BCcken_--_2016_--_3131-7.jpg" },
  { id: "de178", name: "Holstein Kiel", level: 2, color: "#0000FF", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Holstein_Kiel_Logo.svg/250px-Holstein_Kiel_Logo.svg.png" },
  { id: "de179", name: "Köln", level: 2, color: "#008000", country: "DE" },
  { id: "de180", name: "Schalke 04", level: 2, color: "#FFFFFF", country: "DE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/FC_Schalke_04_Logo.svg/250px-FC_Schalke_04_Logo.svg.png" },
  // ALEMANHA (DE) - Div 2
  { id: "de181", name: "Hamburg", level: 1, color: "#FF0000", country: "DE", division: 2 },
  { id: "de182", name: "Hertha Berlin", level: 1, color: "#0000FF", country: "DE", division: 2 },
  { id: "de183", name: "Düsseldorf", level: 1, color: "#008000", country: "DE", division: 2 },
  { id: "de184", name: "Karlsruher", level: 1, color: "#FFFFFF", country: "DE", division: 2 },
  { id: "de185", name: "Hannover 96", level: 1, color: "#000000", country: "DE", division: 2 },
  { id: "de186", name: "Paderborn", level: 1, color: "#FFFF00", country: "DE", division: 2 },
  { id: "de187", name: "Greuther Fürth", level: 1, color: "#800080", country: "DE", division: 2 },
  { id: "de188", name: "Nürnberg", level: 1, color: "#FFA500", country: "DE", division: 2 },
  { id: "de189", name: "Kaiserslautern", level: 1, color: "#FF0000", country: "DE", division: 2 },
  { id: "de190", name: "Magdeburg", level: 1, color: "#0000FF", country: "DE", division: 2 },
  { id: "de191", name: "Elversberg", level: 1, color: "#008000", country: "DE", division: 2 },
  { id: "de192", name: "Eintracht Braunschweig", level: 1, color: "#FFFFFF", country: "DE", division: 2 },
  { id: "de193", name: "Schalke 04", level: 1, color: "#000000", country: "DE", division: 2 },
  { id: "de194", name: "Osnabrück", level: 1, color: "#FFFF00", country: "DE", division: 2 },
  { id: "de195", name: "Wehen Wiesbaden", level: 1, color: "#800080", country: "DE", division: 2 },
  { id: "de196", name: "Hansa Rostock", level: 1, color: "#FFA500", country: "DE", division: 2 },
  { id: "de197", name: "Preußen Münster", level: 1, color: "#FF0000", country: "DE", division: 2 },
  { id: "de198", name: "Jahn Regensburg", level: 1, color: "#0000FF", country: "DE", division: 2 },
  { id: "de199", name: "Ulm", level: 1, color: "#008000", country: "DE", division: 2 },
  { id: "de200", name: "Darmstadt", level: 1, color: "#FFFFFF", country: "DE", division: 2 },
  // FRANÇA (FR) - Div 1
  { id: "fr201", name: "PSG", level: 4, color: "#FF0000", country: "FR" },
  { id: "fr202", name: "Marseille", level: 3, color: "#0000FF", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/View_of_Marseille_from_Notre-Dame_de_la_Garde_4.jpg/330px-View_of_Marseille_from_Notre-Dame_de_la_Garde_4.jpg" },
  { id: "fr203", name: "Monaco", level: 3, color: "#008000", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Flag_of_Monaco.svg/120px-Flag_of_Monaco.svg.png" },
  { id: "fr204", name: "Lille", level: 3, color: "#FFFFFF", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Lille_Collage.jpg/330px-Lille_Collage.jpg" },
  { id: "fr205", name: "Lyon", level: 3, color: "#000000", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Lyon-part-dieu-2023.jpg/330px-Lyon-part-dieu-2023.jpg" },
  { id: "fr206", name: "Rennes", level: 3, color: "#FFFF00", country: "FR" },
  { id: "fr207", name: "Lens", level: 3, color: "#800080", country: "FR" },
  { id: "fr208", name: "Nice", level: 2, color: "#FFA500", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Nice_from_Castle_Hill_01.jpg/330px-Nice_from_Castle_Hill_01.jpg" },
  { id: "fr209", name: "Reims", level: 2, color: "#FF0000", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sub%C3%A9_Fountain%2C_Reims%2C_France.jpg/330px-Sub%C3%A9_Fountain%2C_Reims%2C_France.jpg" },
  { id: "fr210", name: "Strasbourg", level: 2, color: "#0000FF", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Strasbourg_Cathedral.jpg/330px-Strasbourg_Cathedral.jpg" },
  { id: "fr211", name: "Montpellier", level: 2, color: "#008000", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Montpellier_Place_de_la_Com%C3%A9die.jpg/250px-Montpellier_Place_de_la_Com%C3%A9die.jpg" },
  { id: "fr212", name: "Toulouse", level: 2, color: "#FFFFFF", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Toulouse_-_vue_du_Vieux_Toulouse_depuis_St_Sernin_06.jpg/250px-Toulouse_-_vue_du_Vieux_Toulouse_depuis_St_Sernin_06.jpg" },
  { id: "fr213", name: "Nantes", level: 2, color: "#000000", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Panorama_depuis_Butte_Sainte-Anne.jpg/330px-Panorama_depuis_Butte_Sainte-Anne.jpg" },
  { id: "fr214", name: "Brest", level: 2, color: "#FFFF00", country: "FR" },
  { id: "fr215", name: "Le Havre", level: 2, color: "#800080", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Panorama_of_Le_Havre%2C_September_2019.jpg/330px-Panorama_of_Le_Havre%2C_September_2019.jpg" },
  { id: "fr216", name: "Auxerre", level: 1, color: "#FFA500", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Auxerre_-_Yonne_-_1.jpg/250px-Auxerre_-_Yonne_-_1.jpg" },
  { id: "fr217", name: "Angers", level: 1, color: "#FF0000", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/40px-Flag_of_France.svg.png" },
  { id: "fr218", name: "Saint-Étienne", level: 1, color: "#0000FF", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Saint_Etienne_views.png/250px-Saint_Etienne_views.png" },
  { id: "fr219", name: "Lorient", level: 1, color: "#008000", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Lorient.jpg/250px-Lorient.jpg" },
  { id: "fr220", name: "Metz", level: 1, color: "#FFFFFF", country: "FR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Metz_centre_ville.jpg/330px-Metz_centre_ville.jpg" },
  // FRANÇA (FR) - Div 2
  { id: "fr221", name: "Bordeaux", level: 1, color: "#FF0000", country: "FR", division: 2 },
  { id: "fr222", name: "Paris FC", level: 1, color: "#0000FF", country: "FR", division: 2 },
  { id: "fr223", name: "Guingamp", level: 1, color: "#008000", country: "FR", division: 2 },
  { id: "fr224", name: "Amiens", level: 1, color: "#FFFFFF", country: "FR", division: 2 },
  { id: "fr225", name: "Caen", level: 1, color: "#000000", country: "FR", division: 2 },
  { id: "fr226", name: "Pau", level: 1, color: "#FFFF00", country: "FR", division: 2 },
  { id: "fr227", name: "Rodez", level: 1, color: "#800080", country: "FR", division: 2 },
  { id: "fr228", name: "Bastia", level: 1, color: "#FFA500", country: "FR", division: 2 },
  { id: "fr229", name: "Annecy", level: 1, color: "#FF0000", country: "FR", division: 2 },
  { id: "fr230", name: "Troyes", level: 1, color: "#0000FF", country: "FR", division: 2 },
  { id: "fr231", name: "Ajaccio", level: 1, color: "#008000", country: "FR", division: 2 },
  { id: "fr232", name: "Laval", level: 1, color: "#FFFFFF", country: "FR", division: 2 },
  { id: "fr233", name: "Dunkerque", level: 1, color: "#000000", country: "FR", division: 2 },
  { id: "fr234", name: "Clermont", level: 1, color: "#FFFF00", country: "FR", division: 2 },
  { id: "fr235", name: "Red Star", level: 1, color: "#800080", country: "FR", division: 2 },
  { id: "fr236", name: "Martigues", level: 1, color: "#FFA500", country: "FR", division: 2 },
  { id: "fr237", name: "Sochaux", level: 1, color: "#FF0000", country: "FR", division: 2 },
  { id: "fr238", name: "Nancy", level: 1, color: "#0000FF", country: "FR", division: 2 },
  { id: "fr239", name: "Dijon", level: 1, color: "#008000", country: "FR", division: 2 },
  { id: "fr240", name: "Le Mans", level: 1, color: "#FFFFFF", country: "FR", division: 2 },
  // PORTUGAL (PT) - Div 1
  { id: "pt241", name: "Benfica", level: 4, color: "#FF0000", country: "PT" },
  { id: "pt242", name: "Porto", level: 4, color: "#0000FF", country: "PT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Puente_Don_Luis_I%2C_Oporto%2C_Portugal%2C_2012-05-09%2C_DD_13.JPG/330px-Puente_Don_Luis_I%2C_Oporto%2C_Portugal%2C_2012-05-09%2C_DD_13.JPG" },
  { id: "pt243", name: "Sporting", level: 4, color: "#008000", country: "PT" },
  { id: "pt244", name: "Braga", level: 3, color: "#FFFFFF", country: "PT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Braga_Banco_Portugal_%28cropped%29.jpg/250px-Braga_Banco_Portugal_%28cropped%29.jpg" },
  { id: "pt245", name: "Vitória de Guimarães", level: 3, color: "#000000", country: "PT" },
  { id: "pt246", name: "Boavista", level: 2, color: "#FFFF00", country: "PT" },
  { id: "pt247", name: "Famalicão", level: 2, color: "#800080", country: "PT" },
  { id: "pt248", name: "Rio Ave", level: 2, color: "#FFA500", country: "PT" },
  { id: "pt249", name: "Estoril", level: 2, color: "#FF0000", country: "PT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Linha_de_Cascais_DSC_0241_%2817296423451%29.jpg/330px-Linha_de_Cascais_DSC_0241_%2817296423451%29.jpg" },
  { id: "pt250", name: "Farense", level: 2, color: "#0000FF", country: "PT" },
  { id: "pt251", name: "Gil Vicente", level: 1, color: "#008000", country: "PT" },
  { id: "pt252", name: "Casa Pia", level: 1, color: "#FFFFFF", country: "PT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Coat_of_arms_of_Portugal.svg/250px-Coat_of_arms_of_Portugal.svg.png" },
  { id: "pt253", name: "Moreirense", level: 1, color: "#000000", country: "PT" },
  { id: "pt254", name: "Arouca", level: 1, color: "#FFFF00", country: "PT" },
  { id: "pt255", name: "Estrela da Amadora", level: 1, color: "#800080", country: "PT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Emblema_Estrela_da_Amadora.jpg/250px-Emblema_Estrela_da_Amadora.jpg" },
  { id: "pt256", name: "Nacional", level: 1, color: "#FFA500", country: "PT" },
  { id: "pt257", name: "Santa Clara", level: 1, color: "#FF0000", country: "PT" },
  { id: "pt258", name: "AVS", level: 1, color: "#0000FF", country: "PT" },
  { id: "pt259", name: "Portimonense", level: 1, color: "#008000", country: "PT" },
  { id: "pt260", name: "Vizela", level: 1, color: "#FFFFFF", country: "PT" },
  // PORTUGAL (PT) - Div 2
  { id: "pt261", name: "Paços de Ferreira", level: 1, color: "#FF0000", country: "PT", division: 2 },
  { id: "pt262", name: "Marítimo", level: 1, color: "#0000FF", country: "PT", division: 2 },
  { id: "pt263", name: "Leiria", level: 1, color: "#008000", country: "PT", division: 2 },
  { id: "pt264", name: "Mafra", level: 1, color: "#FFFFFF", country: "PT", division: 2 },
  { id: "pt265", name: "Penafiel", level: 1, color: "#000000", country: "PT", division: 2 },
  { id: "pt266", name: "Torreense", level: 1, color: "#FFFF00", country: "PT", division: 2 },
  { id: "pt267", name: "Tondela", level: 1, color: "#800080", country: "PT", division: 2 },
  { id: "pt268", name: "Académico de Viseu", level: 1, color: "#FFA500", country: "PT", division: 2 },
  { id: "pt269", name: "Feirense", level: 1, color: "#FF0000", country: "PT", division: 2 },
  { id: "pt270", name: "Porto B", level: 1, color: "#0000FF", country: "PT", division: 2 },
  { id: "pt271", name: "Benfica B", level: 1, color: "#008000", country: "PT", division: 2 },
  { id: "pt272", name: "Leixões", level: 1, color: "#FFFFFF", country: "PT", division: 2 },
  { id: "pt273", name: "Oliveirense", level: 1, color: "#000000", country: "PT", division: 2 },
  { id: "pt274", name: "Alverca", level: 1, color: "#FFFF00", country: "PT", division: 2 },
  { id: "pt275", name: "Felgueiras", level: 1, color: "#800080", country: "PT", division: 2 },
  { id: "pt276", name: "Chaves", level: 1, color: "#FFA500", country: "PT", division: 2 },
  { id: "pt277", name: "Académica", level: 1, color: "#FF0000", country: "PT", division: 2 },
  { id: "pt278", name: "Belenenses", level: 1, color: "#0000FF", country: "PT", division: 2 },
  { id: "pt279", name: "Setúbal", level: 1, color: "#008000", country: "PT", division: 2 },
  { id: "pt280", name: "Varzim", level: 1, color: "#FFFFFF", country: "PT", division: 2 },
  // HOLANDA (NL) - Div 1
  { id: "nl281", name: "Ajax", level: 3, color: "#FF0000", country: "NL" },
  { id: "nl282", name: "PSV", level: 3, color: "#0000FF", country: "NL" },
  { id: "nl283", name: "Feyenoord", level: 3, color: "#008000", country: "NL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Feyenoord_logo_since_2024.svg/250px-Feyenoord_logo_since_2024.svg.png" },
  { id: "nl284", name: "AZ Alkmaar", level: 3, color: "#FFFFFF", country: "NL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/AZ_Alkmaar.svg/250px-AZ_Alkmaar.svg.png" },
  { id: "nl285", name: "Twente", level: 3, color: "#000000", country: "NL" },
  { id: "nl286", name: "Utrecht", level: 2, color: "#FFFF00", country: "NL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Utrecht_%2816295236803%29.jpg/330px-Utrecht_%2816295236803%29.jpg" },
  { id: "nl287", name: "Sparta Rotterdam", level: 2, color: "#800080", country: "NL" },
  { id: "nl288", name: "Heerenveen", level: 2, color: "#FFA500", country: "NL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Heeresloot_03.JPG/250px-Heeresloot_03.JPG" },
  { id: "nl289", name: "Go Ahead Eagles", level: 2, color: "#FF0000", country: "NL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Go_Ahead_Eagles_logo.svg/250px-Go_Ahead_Eagles_logo.svg.png" },
  { id: "nl290", name: "NEC", level: 2, color: "#0000FF", country: "NL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/NEC_logo.svg/250px-NEC_logo.svg.png" },
  { id: "nl291", name: "Almere City", level: 1, color: "#008000", country: "NL" },
  { id: "nl292", name: "PEC Zwolle", level: 1, color: "#FFFFFF", country: "NL", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/PEC_Zwolle_logo.svg/250px-PEC_Zwolle_logo.svg.png" },
  { id: "nl293", name: "Fortuna Sittard", level: 1, color: "#000000", country: "NL" },
  { id: "nl294", name: "Heracles", level: 1, color: "#FFFF00", country: "NL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Herakles_Farnese_MAN_Napoli_Inv6001_n01.jpg/250px-Herakles_Farnese_MAN_Napoli_Inv6001_n01.jpg" },
  { id: "nl295", name: "Willem II", level: 1, color: "#800080", country: "NL" },
  { id: "nl296", name: "Groningen", level: 1, color: "#FFA500", country: "NL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Martini_Toren.JPG/120px-Martini_Toren.JPG" },
  { id: "nl297", name: "NAC Breda", level: 1, color: "#FF0000", country: "NL" },
  { id: "nl298", name: "Volendam", level: 1, color: "#0000FF", country: "NL" },
  { id: "nl299", name: "Vitesse", level: 1, color: "#008000", country: "NL" },
  { id: "nl300", name: "Excelsior", level: 1, color: "#FFFFFF", country: "NL" },
  // HOLANDA (NL) - Div 2
  { id: "nl301", name: "ADO Den Haag", level: 1, color: "#FF0000", country: "NL", division: 2 },
  { id: "nl302", name: "De Graafschap", level: 1, color: "#0000FF", country: "NL", division: 2 },
  { id: "nl303", name: "Roda JC", level: 1, color: "#008000", country: "NL", division: 2 },
  { id: "nl304", name: "Emmen", level: 1, color: "#FFFFFF", country: "NL", division: 2 },
  { id: "nl305", name: "Cambuur", level: 1, color: "#000000", country: "NL", division: 2 },
  { id: "nl306", name: "VVV-Venlo", level: 1, color: "#FFFF00", country: "NL", division: 2 },
  { id: "nl307", name: "MVV", level: 1, color: "#800080", country: "NL", division: 2 },
  { id: "nl308", name: "Eindhoven", level: 1, color: "#FFA500", country: "NL", division: 2 },
  { id: "nl309", name: "Helmond Sport", level: 1, color: "#FF0000", country: "NL", division: 2 },
  { id: "nl310", name: "Den Bosch", level: 1, color: "#0000FF", country: "NL", division: 2 },
  { id: "nl311", name: "Oss", level: 1, color: "#008000", country: "NL", division: 2 },
  { id: "nl312", name: "Dordrecht", level: 1, color: "#FFFFFF", country: "NL", division: 2 },
  { id: "nl313", name: "Telstar", level: 1, color: "#000000", country: "NL", division: 2 },
  { id: "nl314", name: "Volendam", level: 1, color: "#FFFF00", country: "NL", division: 2 },
  { id: "nl315", name: "Vitesse", level: 1, color: "#800080", country: "NL", division: 2 },
  { id: "nl316", name: "Excelsior", level: 1, color: "#FFA500", country: "NL", division: 2 },
  { id: "nl317", name: "Jong Ajax", level: 1, color: "#FF0000", country: "NL", division: 2 },
  { id: "nl318", name: "Jong PSV", level: 1, color: "#0000FF", country: "NL", division: 2 },
  { id: "nl319", name: "Jong AZ", level: 1, color: "#008000", country: "NL", division: 2 },
  { id: "nl320", name: "Jong FC Utrecht", level: 1, color: "#FFFFFF", country: "NL", division: 2 },
  // ESTADOS UNIDOS (US) - Div 1
  { id: "us321", name: "Inter Miami", level: 2, color: "#FF0000", country: "US" },
  { id: "us322", name: "LA Galaxy", level: 2, color: "#0000FF", country: "US", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Los_Angeles_Galaxy_logo.svg/250px-Los_Angeles_Galaxy_logo.svg.png" },
  { id: "us323", name: "Los Angeles FC", level: 2, color: "#008000", country: "US", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Los_Angeles_Football_Club.svg/250px-Los_Angeles_Football_Club.svg.png" },
  { id: "us324", name: "New York City FC", level: 2, color: "#FFFFFF", country: "US", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_New_York_City_FC_2025.svg/250px-Logo_New_York_City_FC_2025.svg.png" },
  { id: "us325", name: "Seattle Sounders", level: 2, color: "#000000", country: "US" },
  { id: "us326", name: "Atlanta United", level: 2, color: "#FFFF00", country: "US" },
  { id: "us327", name: "Columbus Crew", level: 1, color: "#800080", country: "US", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Columbus_Crew_logo_2021.svg/250px-Columbus_Crew_logo_2021.svg.png" },
  { id: "us328", name: "FC Cincinnati", level: 1, color: "#FFA500", country: "US" },
  { id: "us329", name: "Philadelphia Union", level: 1, color: "#FF0000", country: "US", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Philadelphia_Union_2018_logo.svg/250px-Philadelphia_Union_2018_logo.svg.png" },
  { id: "us330", name: "Orlando City", level: 1, color: "#0000FF", country: "US" },
  { id: "us331", name: "Toronto FC", level: 1, color: "#008000", country: "US", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Toronto_FC_Logo.svg/330px-Toronto_FC_Logo.svg.png" },
  { id: "us332", name: "New York Red Bulls", level: 1, color: "#FFFFFF", country: "US", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/New_York_Red_Bulls_logo.svg/250px-New_York_Red_Bulls_logo.svg.png" },
  { id: "us333", name: "Portland Timbers", level: 1, color: "#000000", country: "US", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Portland_Timbers_logo.svg/250px-Portland_Timbers_logo.svg.png" },
  { id: "us334", name: "Sporting KC", level: 1, color: "#FFFF00", country: "US" },
  { id: "us335", name: "Houston Dynamo", level: 1, color: "#800080", country: "US", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Houston_Dynamo_FC_logo.svg/250px-Houston_Dynamo_FC_logo.svg.png" },
  { id: "us336", name: "Real Salt Lake", level: 1, color: "#FFA500", country: "US", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Real_Salt_Lake_2010.svg/250px-Real_Salt_Lake_2010.svg.png" },
  { id: "us337", name: "Minnesota United", level: 1, color: "#FF0000", country: "US" },
  { id: "us338", name: "Colorado Rapids", level: 1, color: "#0000FF", country: "US", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Colorado_Rapids_logo.svg/250px-Colorado_Rapids_logo.svg.png" },
  { id: "us339", name: "Charlotte FC", level: 1, color: "#008000", country: "US", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Charlotte_FC_logo.svg/250px-Charlotte_FC_logo.svg.png" },
  { id: "us340", name: "St. Louis City SC", level: 1, color: "#FFFFFF", country: "US", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Logo_of_St._Louis_City_SC.svg/250px-Logo_of_St._Louis_City_SC.svg.png" },
  // ESTADOS UNIDOS (US) - Div 2
  { id: "us341", name: "Tampa Bay Rowdies", level: 1, color: "#FF0000", country: "US", division: 2 },
  { id: "us342", name: "Phoenix Rising", level: 1, color: "#0000FF", country: "US", division: 2 },
  { id: "us343", name: "Louisville City", level: 1, color: "#008000", country: "US", division: 2 },
  { id: "us344", name: "Sacramento Republic", level: 1, color: "#FFFFFF", country: "US", division: 2 },
  { id: "us345", name: "Charleston Battery", level: 1, color: "#000000", country: "US", division: 2 },
  { id: "us346", name: "Indy Eleven", level: 1, color: "#FFFF00", country: "US", division: 2 },
  { id: "us347", name: "San Antonio FC", level: 1, color: "#800080", country: "US", division: 2 },
  { id: "us348", name: "Orange County SC", level: 1, color: "#FFA500", country: "US", division: 2 },
  { id: "us349", name: "Colorado Springs Switchbacks", level: 1, color: "#FF0000", country: "US", division: 2 },
  { id: "us350", name: "Pittsburgh Riverhounds", level: 1, color: "#0000FF", country: "US", division: 2 },
  { id: "us351", name: "El Paso Locomotive", level: 1, color: "#008000", country: "US", division: 2 },
  { id: "us352", name: "New Mexico United", level: 1, color: "#FFFFFF", country: "US", division: 2 },
  { id: "us353", name: "Memphis 901", level: 1, color: "#000000", country: "US", division: 2 },
  { id: "us354", name: "Monterey Bay FC", level: 1, color: "#FFFF00", country: "US", division: 2 },
  { id: "us355", name: "Loudoun United", level: 1, color: "#800080", country: "US", division: 2 },
  { id: "us356", name: "Tulsa", level: 1, color: "#FFA500", country: "US", division: 2 },
  { id: "us357", name: "Rhode Island", level: 1, color: "#FF0000", country: "US", division: 2 },
  { id: "us358", name: "Oakland Roots", level: 1, color: "#0000FF", country: "US", division: 2 },
  { id: "us359", name: "Miami FC", level: 1, color: "#008000", country: "US", division: 2 },
  { id: "us360", name: "Las Vegas Lights", level: 1, color: "#FFFFFF", country: "US", division: 2 },
  // ARÁBIA SAUDITA (SA) - Div 1
  { id: "sa361", name: "Al Hilal", level: 4, color: "#FF0000", country: "SA" },
  { id: "sa362", name: "Al Nassr", level: 4, color: "#0000FF", country: "SA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Nassr_FC_Logo.svg/250px-Nassr_FC_Logo.svg.png" },
  { id: "sa363", name: "Al Ittihad", level: 3, color: "#008000", country: "SA" },
  { id: "sa364", name: "Al Ahli", level: 3, color: "#FFFFFF", country: "SA" },
  { id: "sa365", name: "Al Shabab", level: 2, color: "#000000", country: "SA" },
  { id: "sa366", name: "Al Taawoun", level: 2, color: "#FFFF00", country: "SA" },
  { id: "sa367", name: "Al Ettifaq", level: 2, color: "#800080", country: "SA" },
  { id: "sa368", name: "Al Fateh", level: 2, color: "#FFA500", country: "SA" },
  { id: "sa369", name: "Damac", level: 1, color: "#FF0000", country: "SA" },
  { id: "sa370", name: "Al Fayha", level: 1, color: "#0000FF", country: "SA" },
  { id: "sa371", name: "Al Wehda", level: 1, color: "#008000", country: "SA" },
  { id: "sa372", name: "Al Raed", level: 1, color: "#FFFFFF", country: "SA" },
  { id: "sa373", name: "Al Khaleej", level: 1, color: "#000000", country: "SA" },
  { id: "sa374", name: "Al Akhdoud", level: 1, color: "#FFFF00", country: "SA" },
  { id: "sa375", name: "Al Riyadh", level: 1, color: "#800080", country: "SA" },
  { id: "sa376", name: "Al Kholood", level: 1, color: "#FFA500", country: "SA" },
  { id: "sa377", name: "Al Orobah", level: 1, color: "#FF0000", country: "SA" },
  { id: "sa378", name: "Al Qadsiah", level: 1, color: "#0000FF", country: "SA" },
  { id: "sa379", name: "Abha", level: 1, color: "#008000", country: "SA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Abha_city.png/330px-Abha_city.png" },
  { id: "sa380", name: "Al Tai", level: 1, color: "#FFFFFF", country: "SA" },
  // ARÁBIA SAUDITA (SA) - Div 2
  { id: "sa381", name: "Al Faisaly", level: 1, color: "#FF0000", country: "SA", division: 2 },
  { id: "sa382", name: "Al Hazem", level: 1, color: "#0000FF", country: "SA", division: 2 },
  { id: "sa383", name: "Al Batin", level: 1, color: "#008000", country: "SA", division: 2 },
  { id: "sa384", name: "Al Adalah", level: 1, color: "#FFFFFF", country: "SA", division: 2 },
  { id: "sa385", name: "Al Jabalain", level: 1, color: "#000000", country: "SA", division: 2 },
  { id: "sa386", name: "Al Najma", level: 1, color: "#FFFF00", country: "SA", division: 2 },
  { id: "sa387", name: "Al Arabi", level: 1, color: "#800080", country: "SA", division: 2 },
  { id: "sa388", name: "Al Bukiryah", level: 1, color: "#FFA500", country: "SA", division: 2 },
  { id: "sa389", name: "Al Safa", level: 1, color: "#FF0000", country: "SA", division: 2 },
  { id: "sa390", name: "Ohod", level: 1, color: "#0000FF", country: "SA", division: 2 },
  { id: "sa391", name: "Al Jandal", level: 1, color: "#008000", country: "SA", division: 2 },
  { id: "sa392", name: "Al Ain", level: 1, color: "#FFFFFF", country: "SA", division: 2 },
  { id: "sa393", name: "Al Kholood", level: 1, color: "#000000", country: "SA", division: 2 },
  { id: "sa394", name: "Hajer", level: 1, color: "#FFFF00", country: "SA", division: 2 },
  { id: "sa395", name: "Jeddah", level: 1, color: "#800080", country: "SA", division: 2 },
  { id: "sa396", name: "Al Qaisumah", level: 1, color: "#FFA500", country: "SA", division: 2 },
  { id: "sa397", name: "Bisha", level: 1, color: "#FF0000", country: "SA", division: 2 },
  { id: "sa398", name: "Al Zulfi", level: 1, color: "#0000FF", country: "SA", division: 2 },
  { id: "sa399", name: "Neom SC", level: 1, color: "#008000", country: "SA", division: 2 },
  { id: "sa400", name: "Al Diriyah", level: 1, color: "#FFFFFF", country: "SA", division: 2 },
  // ARGENTINA (AR) - Div 1
  { id: "ar401", name: "Boca Juniors", level: 3, color: "#FF0000", country: "AR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boca_Juniors_logo18.svg/250px-Boca_Juniors_logo18.svg.png" },
  { id: "ar402", name: "River Plate", level: 3, color: "#0000FF", country: "AR" },
  { id: "ar403", name: "Racing", level: 3, color: "#008000", country: "AR" },
  { id: "ar404", name: "Independiente", level: 2, color: "#FFFFFF", country: "AR" },
  { id: "ar405", name: "San Lorenzo", level: 2, color: "#000000", country: "AR" },
  { id: "ar406", name: "Estudiantes", level: 2, color: "#FFFF00", country: "AR" },
  { id: "ar407", name: "Talleres", level: 2, color: "#800080", country: "AR" },
  { id: "ar408", name: "Rosario Central", level: 2, color: "#FFA500", country: "AR", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Rosario_Central_logo.svg/250px-Rosario_Central_logo.svg.png" },
  { id: "ar409", name: "Newell's Old Boys", level: 2, color: "#FF0000", country: "AR" },
  { id: "ar410", name: "Vélez Sarsfield", level: 2, color: "#0000FF", country: "AR" },
  { id: "ar411", name: "Argentinos Juniors", level: 2, color: "#008000", country: "AR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Escudo_de_la_Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors.svg/250px-Escudo_de_la_Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors.svg.png" },
  { id: "ar412", name: "Defensa y Justicia", level: 2, color: "#FFFFFF", country: "AR" },
  { id: "ar413", name: "Lanús", level: 1, color: "#000000", country: "AR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Avenida_Hip%C3%B3lito_Yrigoyen_-_Lan%C3%BAs.jpg/250px-Avenida_Hip%C3%B3lito_Yrigoyen_-_Lan%C3%BAs.jpg" },
  { id: "ar414", name: "Huracán", level: 1, color: "#FFFF00", country: "AR" },
  { id: "ar415", name: "Godoy Cruz", level: 1, color: "#800080", country: "AR" },
  { id: "ar416", name: "Belgrano", level: 1, color: "#FFA500", country: "AR" },
  { id: "ar417", name: "Gimnasia y Esgrima", level: 1, color: "#FF0000", country: "AR" },
  { id: "ar418", name: "Tigre", level: 1, color: "#0000FF", country: "AR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/20px-Information_icon.svg.png" },
  { id: "ar419", name: "Platense", level: 1, color: "#008000", country: "AR" },
  { id: "ar420", name: "Unión", level: 1, color: "#FFFFFF", country: "AR" },
  // ARGENTINA (AR) - Div 2
  { id: "ar421", name: "San Martín (T)", level: 1, color: "#FF0000", country: "AR", division: 2 },
  { id: "ar422", name: "Quilmes", level: 1, color: "#0000FF", country: "AR", division: 2 },
  { id: "ar423", name: "Ferro Carril Oeste", level: 1, color: "#008000", country: "AR", division: 2 },
  { id: "ar424", name: "Chacarita Juniors", level: 1, color: "#FFFFFF", country: "AR", division: 2 },
  { id: "ar425", name: "Nueva Chicago", level: 1, color: "#000000", country: "AR", division: 2 },
  { id: "ar426", name: "Aldosivi", level: 1, color: "#FFFF00", country: "AR", division: 2 },
  { id: "ar427", name: "San Martín (SJ)", level: 1, color: "#800080", country: "AR", division: 2 },
  { id: "ar428", name: "Gimnasia (J)", level: 1, color: "#FFA500", country: "AR", division: 2 },
  { id: "ar429", name: "Colón", level: 1, color: "#FF0000", country: "AR", division: 2 },
  { id: "ar430", name: "Atlético Rafaela", level: 1, color: "#0000FF", country: "AR", division: 2 },
  { id: "ar431", name: "All Boys", level: 1, color: "#008000", country: "AR", division: 2 },
  { id: "ar432", name: "Deportivo Morón", level: 1, color: "#FFFFFF", country: "AR", division: 2 },
  { id: "ar433", name: "San Miguel", level: 1, color: "#000000", country: "AR", division: 2 },
  { id: "ar434", name: "Defensores de Belgrano", level: 1, color: "#FFFF00", country: "AR", division: 2 },
  { id: "ar435", name: "Estudiantes (BA)", level: 1, color: "#800080", country: "AR", division: 2 },
  { id: "ar436", name: "Almirante Brown", level: 1, color: "#FFA500", country: "AR", division: 2 },
  { id: "ar437", name: "Atlanta", level: 1, color: "#FF0000", country: "AR", division: 2 },
  { id: "ar438", name: "Temperley", level: 1, color: "#0000FF", country: "AR", division: 2 },
  { id: "ar439", name: "Deportivo Madryn", level: 1, color: "#008000", country: "AR", division: 2 },
  { id: "ar440", name: "Patronato", level: 1, color: "#FFFFFF", country: "AR", division: 2 },
  // URUGUAI (UY) - Div 1
  { id: "uy441", name: "Peñarol", level: 2, color: "#FF0000", country: "UY", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Escudo_del_Club_Atl%C3%A9tico_Pe%C3%B1arol.svg/250px-Escudo_del_Club_Atl%C3%A9tico_Pe%C3%B1arol.svg.png" },
  { id: "uy442", name: "Nacional", level: 2, color: "#0000FF", country: "UY" },
  { id: "uy443", name: "Defensor Sporting", level: 1, color: "#008000", country: "UY", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Defensor_Sporting.svg/250px-Defensor_Sporting.svg.png" },
  { id: "uy444", name: "Danubio", level: 1, color: "#FFFFFF", country: "UY" },
  { id: "uy445", name: "Wanderers", level: 1, color: "#000000", country: "UY" },
  { id: "uy446", name: "Liverpool (URU)", level: 1, color: "#FFFF00", country: "UY" },
  { id: "uy447", name: "Cerro", level: 1, color: "#800080", country: "UY" },
  { id: "uy448", name: "River Plate (URU)", level: 1, color: "#FFA500", country: "UY" },
  { id: "uy449", name: "Racing (Montevideo)", level: 1, color: "#FF0000", country: "UY" },
  { id: "uy450", name: "Progreso", level: 1, color: "#0000FF", country: "UY" },
  { id: "uy451", name: "Plaza Colonia", level: 1, color: "#008000", country: "UY" },
  { id: "uy452", name: "Deportivo Maldonado", level: 1, color: "#FFFFFF", country: "UY", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Deportivo_Maldonado_2020.png/250px-Deportivo_Maldonado_2020.png" },
  { id: "uy453", name: "Cerro Largo", level: 1, color: "#000000", country: "UY" },
  { id: "uy454", name: "Miramar Misiones", level: 1, color: "#FFFF00", country: "UY", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Escudo_Miramar_Misiones.jpg/250px-Escudo_Miramar_Misiones.jpg" },
  { id: "uy455", name: "Central Español", level: 1, color: "#800080", country: "UY", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Escudo_Central_Espa%C3%B1ol_2020.png/250px-Escudo_Central_Espa%C3%B1ol_2020.png" },
  { id: "uy456", name: "Fénix", level: 1, color: "#FFA500", country: "UY" },
  { id: "uy457", name: "Boston River", level: 1, color: "#FF0000", country: "UY", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Escudo_Boston_River_2019.png/250px-Escudo_Boston_River_2019.png" },
  { id: "uy458", name: "Montevideo City Torque", level: 1, color: "#0000FF", country: "UY", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/e/e2/Montevideo_City_Torque.png/250px-Montevideo_City_Torque.png" },
  { id: "uy459", name: "La Luz", level: 1, color: "#008000", country: "UY" },
  { id: "uy460", name: "Rampla Juniors", level: 1, color: "#FFFFFF", country: "UY" },
  // URUGUAI (UY) - Div 2
  { id: "uy461", name: "Juventud de Las Piedras", level: 1, color: "#FF0000", country: "UY", division: 2 },
  { id: "uy462", name: "Uruguay Montevideo", level: 1, color: "#0000FF", country: "UY", division: 2 },
  { id: "uy463", name: "Rentistas", level: 1, color: "#008000", country: "UY", division: 2 },
  { id: "uy464", name: "Cerrito", level: 1, color: "#FFFFFF", country: "UY", division: 2 },
  { id: "uy465", name: "Sud América", level: 1, color: "#000000", country: "UY", division: 2 },
  { id: "uy466", name: "Bella Vista", level: 1, color: "#FFFF00", country: "UY", division: 2 },
  { id: "uy467", name: "Villa Española", level: 1, color: "#800080", country: "UY", division: 2 },
  { id: "uy468", name: "Tacuarembó", level: 1, color: "#FFA500", country: "UY", division: 2 },
  { id: "uy469", name: "Atenas", level: 1, color: "#FF0000", country: "UY", division: 2 },
  { id: "uy470", name: "Albion", level: 1, color: "#0000FF", country: "UY", division: 2 },
  { id: "uy471", name: "Oriental", level: 1, color: "#008000", country: "UY", division: 2 },
  { id: "uy472", name: "Potencia", level: 1, color: "#FFFFFF", country: "UY", division: 2 },
  { id: "uy473", name: "Rocha", level: 1, color: "#000000", country: "UY", division: 2 },
  { id: "uy474", name: "Huracán Buceo", level: 1, color: "#FFFF00", country: "UY", division: 2 },
  { id: "uy475", name: "Basáñez", level: 1, color: "#800080", country: "UY", division: 2 },
  { id: "uy476", name: "El Tanque Sisley", level: 1, color: "#FFA500", country: "UY", division: 2 },
  { id: "uy477", name: "Villa Teresa", level: 1, color: "#FF0000", country: "UY", division: 2 },
  { id: "uy478", name: "Salus", level: 1, color: "#0000FF", country: "UY", division: 2 },
  { id: "uy479", name: "Canadian", level: 1, color: "#008000", country: "UY", division: 2 },
  { id: "uy480", name: "Platense (URU)", level: 1, color: "#FFFFFF", country: "UY", division: 2 }
];

export const INITIAL_TEAMS = TEAMS.filter((t) => t.level <= 5);

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

// Nationalities grouped by continent, so the national-team continental cup
// (played between World Cups) can be named correctly: Eurocopa for European
// nations, Copa América for the Americas.
export const EUROPEAN_NATIONALITIES = ["França", "Inglaterra", "Espanha", "Itália", "Alemanha", "Portugal", "Holanda"];
export const AMERICAN_NATIONALITIES = ["Brasil", "Argentina", "Uruguai"];

export function getNationalContinentalCup(nationality: string): string {
  if (EUROPEAN_NATIONALITIES.includes(nationality)) return "Eurocopa";
  if (AMERICAN_NATIONALITIES.includes(nationality)) return "Copa América";
  return "Copa Continental (Seleção)"; // fallback for any nationality outside the two groups
}

// Weight used to make the roulette draw from a country's clubs with a
// realistic bias: small/mid clubs (low level) are common outcomes, while
// giants (level 4-5) are rare - a 14-year-old should only very occasionally
// start their career at a club like Real Madrid or Flamengo.
function getRouletteWeight(level: number): number {
  switch (level) {
    case 1: return 100;
    case 2: return 40;
    case 3: return 8;
    case 4: return 2;
    default: return 1; // level 5 - extremely rare
  }
}

// Builds the pool of clubs the Roulette should draw from for a given
// nationality. Returns every club from that country, but repeated
// proportionally to getRouletteWeight, so a plain uniform pick over the
// returned array (as Roulette.tsx does) still lands on big clubs only very
// rarely, while any team - including the giants - remains possible.
export function getInitialTeamsForNationality(nationality: string): Team[] {
  const countryCode = NATIONALITY_COUNTRY_MAP[nationality];
  const pool = countryCode ? TEAMS.filter((t) => t.country === countryCode) : TEAMS;
  const finalPool = pool.length > 0 ? pool : TEAMS;

  const weighted: Team[] = [];
  finalPool.forEach((team) => {
    const weight = getRouletteWeight(team.level);
    for (let i = 0; i < weight; i++) {
      weighted.push(team);
    }
  });

  return weighted;
}

// ---------------------------------------------------------------------
// Família, amigos e relacionamento amoroso
// ---------------------------------------------------------------------
// Cada carreira sorteia, de forma independente, quem compõe a família do
// jogador (pais e irmãos) e um pequeno grupo de amigos. Os nomes usam um
// pool de nomes/sobrenomes por nacionalidade para dar um toque de sabor
// local, caindo no pool do Brasil como padrão quando a nacionalidade não
// tiver um pool específico cadastrado.

type NamePool = { male: string[]; female: string[]; surnames: string[] };

const NAME_POOLS: Record<string, NamePool> = {
  "Brasil": {
    male: ["João", "Pedro", "Carlos", "Marcos", "Rafael", "Lucas", "Antônio", "Paulo"],
    female: ["Maria", "Ana", "Juliana", "Fernanda", "Camila", "Patrícia", "Beatriz", "Larissa"],
    surnames: ["Silva", "Souza", "Oliveira", "Santos", "Pereira", "Costa", "Almeida", "Ribeiro"],
  },
  "Argentina": {
    male: ["Diego", "Mateo", "Facundo", "Nicolás", "Franco", "Santiago", "Ezequiel", "Agustín"],
    female: ["Sofía", "Valentina", "Camila", "Martina", "Julieta", "Lucía", "Florencia", "Milagros"],
    surnames: ["González", "Fernández", "Rodríguez", "Romero", "Díaz", "Torres", "Álvarez", "Molina"],
  },
  "França": {
    male: ["Jean", "Pierre", "Louis", "Antoine", "Nicolas", "Julien", "Mathieu", "Olivier"],
    female: ["Marie", "Camille", "Sophie", "Claire", "Julie", "Émilie", "Charlotte", "Léa"],
    surnames: ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Petit", "Moreau", "Simon"],
  },
  "Inglaterra": {
    male: ["James", "Oliver", "George", "Harry", "Jack", "Thomas", "William", "Charlie"],
    female: ["Emma", "Olivia", "Amelia", "Sophie", "Charlotte", "Grace", "Isla", "Emily"],
    surnames: ["Smith", "Jones", "Taylor", "Brown", "Wilson", "Evans", "Thomas", "Roberts"],
  },
  "Espanha": {
    male: ["Javier", "Pablo", "Alejandro", "Manuel", "Sergio", "Daniel", "Diego", "Álvaro"],
    female: ["Lucía", "María", "Paula", "Carmen", "Laura", "Elena", "Sara", "Marta"],
    surnames: ["García", "Martínez", "López", "Sánchez", "Pérez", "Gómez", "Fernández", "Díaz"],
  },
  "Itália": {
    male: ["Marco", "Luca", "Matteo", "Andrea", "Francesco", "Alessandro", "Davide", "Simone"],
    female: ["Giulia", "Sofia", "Chiara", "Francesca", "Martina", "Alessia", "Valentina", "Elisa"],
    surnames: ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci"],
  },
  "Alemanha": {
    male: ["Lukas", "Maximilian", "Felix", "Jonas", "Paul", "Leon", "Finn", "Niklas"],
    female: ["Anna", "Laura", "Lena", "Julia", "Sophie", "Marie", "Hannah", "Emilia"],
    surnames: ["Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Wagner", "Becker", "Hoffmann"],
  },
  "Portugal": {
    male: ["João", "Miguel", "Tiago", "Rui", "André", "Bruno", "Diogo", "Gonçalo"],
    female: ["Beatriz", "Inês", "Mariana", "Catarina", "Sofia", "Rita", "Carolina", "Matilde"],
    surnames: ["Ferreira", "Costa", "Rodrigues", "Martins", "Alves", "Carvalho", "Gomes", "Lopes"],
  },
  "Holanda": {
    male: ["Daan", "Sem", "Lucas", "Bram", "Milan", "Thijs", "Levi", "Finn"],
    female: ["Emma", "Julia", "Sophie", "Lisa", "Anna", "Sara", "Zoë", "Fenna"],
    surnames: ["De Jong", "Jansen", "De Vries", "Bakker", "Visser", "Smit", "Meijer", "Bos"],
  },
  "Uruguai": {
    male: ["Nicolás", "Federico", "Agustín", "Diego", "Bruno", "Gonzalo", "Matías", "Sebastián"],
    female: ["Valentina", "Camila", "Florencia", "Martina", "Sofía", "Lucía", "Agustina", "Victoria"],
    surnames: ["Pereira", "Rodríguez", "Fernández", "Silva", "González", "Núñez", "Correa", "Suárez"],
  },
};

const DEFAULT_NAME_POOL: NamePool = NAME_POOLS["Brasil"];

let relationshipIdCounter = 0;
function nextRelationshipId(prefix: string): string {
  relationshipIdCounter += 1;
  return `${prefix}_${Date.now()}_${relationshipIdCounter}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePersonName(nationality: string, gender: "male" | "female"): string {
  const pool = NAME_POOLS[nationality] || DEFAULT_NAME_POOL;
  const first = pickRandom(pool[gender]);
  const last = pickRandom(pool.surnames);
  return `${first} ${last}`;
}

// Sorteia a composição familiar do jogador para a carreira. Cinco cenários
// possíveis: pais e irmãos, apenas pais (sem irmãos), apenas pai, apenas
// mãe, ou completamente órfão (sem nenhum familiar).
function generateFamily(nationality: string): FamilyMember[] {
  const roll = Math.random() * 100;
  const members: FamilyMember[] = [];

  let hasFather = false;
  let hasMother = false;
  let hasSiblings = false;

  if (roll < 35) {
    // Pais e irmãos
    hasFather = true;
    hasMother = true;
    hasSiblings = true;
  } else if (roll < 60) {
    // Apenas os pais, sem irmãos
    hasFather = true;
    hasMother = true;
  } else if (roll < 72) {
    // Apenas o pai
    hasFather = true;
  } else if (roll < 90) {
    // Apenas a mãe
    hasMother = true;
  }
  // roll >= 90: completamente órfão, sem nenhum familiar

  if (hasFather) {
    members.push({
      id: nextRelationshipId("fam"),
      name: generatePersonName(nationality, "male"),
      role: "Pai",
      age: randomIntBetween(38, 60),
      affinity: randomIntBetween(40, 100),
    });
  }

  if (hasMother) {
    members.push({
      id: nextRelationshipId("fam"),
      name: generatePersonName(nationality, "female"),
      role: "Mãe",
      age: randomIntBetween(36, 58),
      affinity: randomIntBetween(45, 100),
    });
  }

  if (hasSiblings) {
    const siblingCount = randomIntBetween(1, 3);
    for (let i = 0; i < siblingCount; i++) {
      const isBrother = Math.random() < 0.5;
      members.push({
        id: nextRelationshipId("fam"),
        name: generatePersonName(nationality, isBrother ? "male" : "female"),
        role: isBrother ? "Irmão" : "Irmã",
        age: randomIntBetween(6, 32),
        affinity: randomIntBetween(50, 100),
      });
    }
  }

  return members;
}

const FRIEND_TAGS = ["Amigo de Infância", "Companheiro de Time", "Vizinho", "Amigo da Escola", "Melhor Amigo"];

function generateFriends(nationality: string): Friend[] {
  const count = randomIntBetween(2, 4);
  const friends: Friend[] = [];
  for (let i = 0; i < count; i++) {
    const isMale = Math.random() < 0.6;
    friends.push({
      id: nextRelationshipId("friend"),
      name: generatePersonName(nationality, isMale ? "male" : "female"),
      relationTag: pickRandom(FRIEND_TAGS),
      affinity: randomIntBetween(50, 100),
    });
  }
  return friends;
}

// Ponto de entrada usado ao criar o jogador: sorteia a família e os amigos
// da carreira. A namorada começa sempre nula - só existe se surgir de um
// RomanceEvent durante a carreira.
export function generateRelationships(nationality: string): Relationships {
  return {
    family: generateFamily(nationality),
    friends: generateFriends(nationality),
    girlfriend: null,
  };
}
