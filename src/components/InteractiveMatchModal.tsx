import { useState, useEffect, useRef } from "react";
import { Player, PlayStyle, Position, Team } from "../types";
import { calculateOverall } from "../utils";
import { Trophy, Goal, Activity, FastForward, Play, AlertCircle, Shield, UserCheck, Rocket, MoveRight, Target, Crosshair, Star } from "lucide-react";
import { TEAMS, NATIONAL_TEAMS, EUROPEAN_NATIONALITIES, AMERICAN_NATIONALITIES, ASIAN_NATIONALITIES, NATIONALITIES, PLAY_STYLE_LEVEL_CHANCE } from "../data";

// -----------------------------------------------------------------------------
// Cenários de jogada
// -----------------------------------------------------------------------------
// Para ATA, PON e MEI: o jogador vive momentos mais ofensivos (recebe a bola
// na frente do gol, na lateral, na entrada da área, ou toma a bola no meio).
// Para MC, VOL, ZAG e LAT: os momentos são mais ligados à marcação/transição
// (tomar a bola no meio de campo ou desarmar uma infiltração adversária).
type Scenario =
  | "FRENTE_GOL"   // Receber a bola na frente do gol -> Chutar ou Passe
  | "FRENTE_GOL_DRIBLE" // Driblou a marcação -> Cara a cara com o gol (Chutar ou Passe sempre 85%)
  | "LATERAL"      // Receber a bola na lateral -> Cruzar ou Passe
  | "MEIO_CAMPO"   // Tomou a bola no meio de campo -> Correr pra área ou Passe
  | "ENTRADA_AREA" // Bola sobrou na entrada da área -> Chutar, Driblar ou Passe
  | "INFILTRACAO"  // Atacante tentando infiltrar -> Desarmar ou Marcar outro atacante
  | "PENALTI"      // Cobrador oficial do time bate um pênalti
  | "FALTA"        // Cobrador oficial do time bate uma falta perigosa
  // Jogadas raras ligadas a PlayStyles: sem o PlayStyle correspondente a
  // chance de sucesso cai para apenas 10%; com o PlayStyle, o sucesso é
  // garantido (100%).
  | "CHUTE_COLOCADO"     // Chute Colocado - bola sobra de longe, fora da área
  | "FORCA_AEREA"        // Força Aérea - cruzamento na área para cabecear
  | "TIKI_TAKA"          // Tiki-Taka - passe decisivo entre linhas
  | "CRUZAMENTO_PRECISO" // Cruzamento Preciso - cruzamento em ângulo fechado
  | "VELOZ"              // Veloz - corrida contra a marcação
  | "XERIFE";            // Xerife - desarme decisivo como marcador

type MatchStatus = "INTRO" | "SIMULATING" | "WAITING_ACTION" | "ROLLING_DICE" | "FINISHED";

const ATTACKING_POSITIONS: Position[] = ["ATA", "PON", "MEI"];
// MC, VOL, ZAG, LAT caem no grupo defensivo/transição.

const ATTACKING_SCENARIOS: Scenario[] = ["FRENTE_GOL", "LATERAL", "MEIO_CAMPO", "ENTRADA_AREA"];
const DEFENSIVE_SCENARIOS: Scenario[] = ["MEIO_CAMPO", "INFILTRACAO"];
const SET_PIECE_SCENARIOS: Scenario[] = ["PENALTI", "FALTA"];

// OVR mínimo (por nível do time) para o jogador ser o cobrador oficial de
// faltas e pênaltis da equipe. Times mais fracos (nível 1) têm um padrão de
// qualidade menor, então basta um OVR mais baixo para ser o cobrador; nos
// times de elite (nível 5) só um jogador de altíssimo nível assume a cobrança.
const SET_PIECE_OVR_THRESHOLD: Record<number, number> = {
  1: 69,
  2: 74,
  3: 79,
  4: 84,
  5: 90,
};

// Ações defensivas (INFILTRACAO) não geram gol do próprio jogador quando dão
// certo — elas evitam o gol do adversário. Quando falham, é o adversário que
// marca. Todos os outros cenários são "ofensivos": sucesso = gol da sua
// equipe, falha = perde a jogada.
const DEFENSIVE_SCENARIO_SET = new Set<Scenario>(["INFILTRACAO", "XERIFE"]);

// Retorna a chance (%) de sucesso na jogada rara associada a um PlayStyle:
// 50% (Bronze), 70% (Prata) ou 90% (Dourado). Sem o PlayStyle, apenas 10%.
function getPlayStyleChance(player: Player, style: PlayStyle): number {
  const owned = player.playStyles?.find((ps) => ps.id === style);
  return owned ? PLAY_STYLE_LEVEL_CHANCE[owned.level] : 10;
}

// Cenários raros de PlayStyle: sem o PlayStyle correspondente, a chance é
// travada em 10%; com o PlayStyle, o sucesso é garantido (100%). Por isso
// esses cenários NÃO passam pelo clamp de 10-90% aplicado às jogadas normais.
const PLAYSTYLE_SCENARIO_SET = new Set<Scenario>([
  "CHUTE_COLOCADO",
  "FORCA_AEREA",
  "TIKI_TAKA",
  "CRUZAMENTO_PRECISO",
  "VELOZ",
  "XERIFE",
]);

// Pools raros por perfil de posição - só entram em jogo ocasionalmente,
// bem mais raro que os cenários normais.
const ATTACKING_PLAYSTYLE_SCENARIOS: Scenario[] = ["CHUTE_COLOCADO", "FORCA_AEREA", "TIKI_TAKA", "CRUZAMENTO_PRECISO", "VELOZ"];
const DEFENSIVE_PLAYSTYLE_SCENARIOS: Scenario[] = ["XERIFE", "VELOZ", "TIKI_TAKA"];

// Chance de que, quando surge uma oportunidade para o jogador, ela seja uma
// dessas jogadas raras de PlayStyle em vez de um cenário comum.
const RARE_PLAYSTYLE_MOMENT_CHANCE = 0.15;

interface ActionDef {
  id: string;
  label: string;
  icon: typeof Goal;
  classes: string;
  // Para cenários ofensivos, indica se um sucesso nessa ação conta como gol
  // do próprio jogador ou como assistência (jogada finalizada por um
  // companheiro). Cenários defensivos (INFILTRACAO) não usam este campo,
  // já que um sucesso ali apenas evita o gol adversário.
  resultType?: "goal" | "assist";
}

interface ScenarioConfig {
  chanceText: (playerName: string, opponentName: string) => string;
  actions: ActionDef[];
  computeChance: (actionId: string, player: Player, difficultyMod: number) => number;
  successText: (actionId: string, playerName: string, opponentName: string) => string;
  failText: (actionId: string, playerName: string, opponentName: string) => string;
}

const SCENARIOS: Record<Scenario, ScenarioConfig> = {
  FRENTE_GOL: {
    chanceText: (name) => `${name} recebe a bola na frente do gol! O que ele vai fazer?`,
    actions: [
      { id: "chutar", label: "Chutar", icon: Goal, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
      { id: "passe", label: "Passe", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs } = player;
      let chance = 50;
      if (actionId === "chutar") {
        chance = 30 + (attrs.shooting - 50) * 2 - difficultyMod;
      } else {
        chance = 35 + Math.floor((attrs.passing - 50) / 2) * 2 - difficultyMod;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "chutar"
        ? `GOLAÇO DE ${name.toUpperCase()}! Chute certeiro que morre no fundo das redes!`
        : `PASSE DE MESTRE DE ${name.toUpperCase()}! Encontra o companheiro livre e é GOL!`,
    failText: (actionId, name, opponentName) =>
      actionId === "chutar"
        ? `Para fora! ${name} chuta torto e a bola passa longe da meta do ${opponentName}.`
        : `Passe errado de ${name}! A zaga do ${opponentName} intercepta com tranquilidade.`,
  },

  LATERAL: {
    chanceText: (name) => `${name} recebe a bola na lateral do campo! O que ele vai fazer?`,
    actions: [
      { id: "cruzar", label: "Cruzar", icon: Activity, classes: "bg-amber-900/50 hover:bg-amber-800/80 border border-amber-700 text-amber-200", resultType: "assist" },
      { id: "passe", label: "Passe", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs } = player;
      let chance = 50;
      if (actionId === "cruzar") {
        chance = 20 + (attrs.passing - 50) * 2 - difficultyMod;
      } else {
        chance = 35 + Math.floor((attrs.passing - 50) / 2) * 2 - difficultyMod;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "cruzar"
        ? `CRUZAMENTO PERFEITO DE ${name.toUpperCase()}! O companheiro cabeceia e é GOL!`
        : `Bom passe de ${name}! A jogada termina em GOL!`,
    failText: (actionId, name, opponentName) =>
      actionId === "cruzar"
        ? `Cruzamento errado de ${name}, a bola sai sem perigo pela linha de fundo.`
        : `Passe cortado! A defesa do ${opponentName} afasta o perigo.`,
  },

  MEIO_CAMPO: {
    chanceText: (name) => `${name} toma a bola no meio de campo! O que ele vai fazer?`,
    actions: [
      { id: "correr", label: "Correr pra Área", icon: Rocket, classes: "bg-purple-900/50 hover:bg-purple-800/80 border border-purple-700 text-purple-200", resultType: "goal" },
      { id: "passe", label: "Passe", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs } = player;
      let chance = 50;
      if (actionId === "correr") {
        chance = 35 + (attrs.pace - 50) * 2 - difficultyMod;
      } else {
        chance = 35 + Math.floor((attrs.passing - 50) / 2) * 2 - difficultyMod;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "correr"
        ? `${name.toUpperCase()} ARRANCA EM VELOCIDADE, entra na área e é GOL!`
        : `LANÇAMENTO PERFEITO DE ${name.toUpperCase()}! O companheiro só empurra pra rede. GOL!`,
    failText: (actionId, name, opponentName) =>
      actionId === "correr"
        ? `${name} tenta avançar mas é travado antes de chegar na área.`
        : `Passe mal calculado de ${name}, a bola sobra fácil para o ${opponentName}.`,
  },

  ENTRADA_AREA: {
    chanceText: (name) => `A bola sobra para ${name} na entrada da área! O que ele vai fazer?`,
    actions: [
      { id: "chutar", label: "Chutar", icon: Goal, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
      { id: "driblar", label: "Driblar", icon: FastForward, classes: "bg-purple-900/50 hover:bg-purple-800/80 border border-purple-700 text-purple-200" },
      { id: "passe", label: "Passe", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs } = player;
      let chance = 50;
      if (actionId === "chutar") {
        chance = 30 + (attrs.shooting - 50) * 2 - difficultyMod;
      } else if (actionId === "driblar") {
        chance = 25 + (attrs.dribbling - 50) * 4 - difficultyMod;
      } else {
        chance = 35 + Math.floor((attrs.passing - 50) / 2) * 2 - difficultyMod;
      }
      return chance;
    },
    successText: (actionId, name) => {
      if (actionId === "chutar") return `QUE PANCADA DE ${name.toUpperCase()}! Bate de primeira e é GOL!`;
      if (actionId === "driblar") return `${name.toUpperCase()} DRIBLA O MARCADOR e fica de frente pro gol!`;
      return `${name.toUpperCase()} VÊ O COMPANHEIRO LIVRE e serve na medida. GOL!`;
    },
    failText: (actionId, name, opponentName) => {
      if (actionId === "chutar") return `Chute travado de ${name}, a bola desvia para escanteio.`;
      if (actionId === "driblar") return `${name} tenta o drible mas é desarmado na entrada da área.`;
      return `Passe muito forte de ${name}, ninguém alcança e a bola sai pela linha de fundo.`;
    },
  },

  FRENTE_GOL_DRIBLE: {
    chanceText: (name) => `${name} driblou a marcação e ficou de frente pro gol! O que ele vai fazer?`,
    actions: [
      { id: "chutar", label: "Chutar", icon: Goal, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
      { id: "passe", label: "Passe", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: () => 85,
    successText: (actionId, name) => {
      if (actionId === "chutar") return `GOLAÇO DE ${name.toUpperCase()}! De frente pro gol, finaliza com maestria e marca!`;
      return `PASSE SERVIDO DE ${name.toUpperCase()}! Deixa o companheiro livre na cara do gol. GOL!`;
    },
    failText: (actionId, name, opponentName) => {
      if (actionId === "chutar") return `Incrível! De frente pro gol, ${name} acaba chutando para fora!`;
      return `Passe muito forte de ${name} de frente pro gol, a zaga do ${opponentName} intercepta!`;
    },
  },

  INFILTRACAO: {
    chanceText: (_name, opponentName) => `O atacante do ${opponentName} tenta infiltrar a linha defensiva! O que fazer?`,
    actions: [
      { id: "desarmar", label: "Desarmar", icon: Shield, classes: "bg-emerald-900/50 hover:bg-emerald-800/80 border border-emerald-700 text-emerald-200" },
      { id: "marcar", label: "Marcar Outro Atacante", icon: UserCheck, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs, position } = player;
      let chance = 50;
      if (actionId === "desarmar") {
        chance = 35 + attrs.defending * 0.6 + attrs.physical * 0.1 - difficultyMod;
        if (position === "ZAG" || position === "VOL") chance += 10;
      } else {
        chance = 35 + attrs.defending * 0.4 + attrs.pace * 0.3 - difficultyMod;
        if (position === "LAT" || position === "VOL") chance += 10;
      }
      return chance;
    },
    // Aqui "sucesso" = evitar o gol adversário (não é gol do próprio jogador).
    successText: (actionId, name, opponentName) =>
      actionId === "desarmar"
        ? `GRANDE DESARME DE ${name.toUpperCase()}! Corta a jogada de perigo do ${opponentName}.`
        : `${name.toUpperCase()} NÃO SAI DA MARCAÇÃO um segundo sequer. Jogada anulada!`,
    // "Falha" aqui = o adversário marca o gol.
    failText: (actionId, name, opponentName) =>
      actionId === "desarmar"
        ? `Não chegou a tempo! ${name} falha no desarme e é GOL DO ${opponentName.toUpperCase()}!`
        : `${name} perde a referência da marcação e é GOL DO ${opponentName.toUpperCase()}!`,
  },

  PENALTI: {
    chanceText: (name) => `PÊNALTI para o seu time! Como cobrador oficial, ${name} se prepara para bater. Como vai cobrar?`,
    actions: [
      { id: "canto", label: "Canto do Gol", icon: Target, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
      { id: "cavadinha", label: "Cavadinha", icon: FastForward, classes: "bg-purple-900/50 hover:bg-purple-800/80 border border-purple-700 text-purple-200", resultType: "goal" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs } = player;
      let chance = 50;
      if (actionId === "canto") {
        // Cobrança mais segura, alto índice de acerto para bons finalizadores.
        chance = 60 + attrs.shooting * 0.3 - difficultyMod * 0.5;
      } else {
        // Cavadinha: mais arriscada, mas quase imparável quando dá certo.
        chance = 40 + attrs.shooting * 0.25 + attrs.dribbling * 0.15 - difficultyMod;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "canto"
        ? `PÊNALTI CONVERTIDO! ${name.toUpperCase()} bate no canto e não dá chance ao goleiro. GOL!`
        : `QUE CAVADINHA DE ${name.toUpperCase()}! Rouba o tempo do goleiro com categoria. GOL!`,
    failText: (actionId, name) =>
      actionId === "canto"
        ? `O goleiro adivinha o canto! Pênalti defendido por ${name}, seguimos no jogo.`
        : `Cavadinha mal calculada de ${name}, o goleiro não sai do lugar e defende!`,
  },

  FALTA: {
    chanceText: (name) => `Falta perigosa na entrada da área! ${name}, o cobrador oficial do time, vai bater. O que fazer?`,
    actions: [
      { id: "cobrar", label: "Cobrar no Ângulo", icon: Crosshair, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
      { id: "cruzar", label: "Cruzar na Área", icon: MoveRight, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "assist" },
    ],
    computeChance: (actionId, player, difficultyMod) => {
      const { attributes: attrs } = player;
      let chance = 50;
      if (actionId === "cobrar") {
        chance = 30 + (attrs.shooting - 50) * 2 - difficultyMod;
      } else {
        chance = 20 + (attrs.passing - 50) * 2 - difficultyMod;
      }
      return chance;
    },
    successText: (actionId, name) =>
      actionId === "cobrar"
        ? `QUE COBRANÇA DE FALTA DE ${name.toUpperCase()}! Acerta o ângulo! GOLAÇO!`
        : `Cruzamento perfeito na cobrança de falta de ${name}! O companheiro cabeceia. GOL!`,
    failText: (actionId, name, opponentName) =>
      actionId === "cobrar"
        ? `Na barreira! A cobrança de falta de ${name} desvia e sai pela linha de fundo.`
        : `Falta cobrada errada por ${name}, a defesa do ${opponentName} afasta sem problemas.`,
  },

  // --------------------------------------------------------------------
  // Cenários raros de PlayStyle
  // --------------------------------------------------------------------
  CHUTE_COLOCADO: {
    chanceText: (name) => `A bola sobra para ${name} bem de longe, fora da área! Só resta arriscar de primeira!`,
    actions: [
      { id: "chute_colocado", label: "Chute Colocado", icon: Crosshair, classes: "bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200", resultType: "goal" },
    ],
    computeChance: (_actionId, player) => {
      const baseChance = getPlayStyleChance(player, "chute_colocado");
      return Math.min(95, Math.max(10, baseChance + Math.round((player.attributes.shooting - 50) * 0.2)));
    },
    successText: (_actionId, name) => `GOLAÇO DE FORA DA ÁREA! ${name.toUpperCase()} ACERTA UM CHUTE COLOCADO PERFEITO NO ÂNGULO!`,
    failText: (_actionId, name) => `${name} arrisca de longe, mas a bola vai longe do gol.`,
  },

  FORCA_AEREA: {
    chanceText: (name) => `Cruzamento na área! A bola sobra na altura de ${name} para o cabeceio!`,
    actions: [
      { id: "cabecear", label: "Cabecear", icon: Target, classes: "bg-blue-900/50 hover:bg-blue-800/80 border border-blue-700 text-blue-200", resultType: "goal" },
    ],
    computeChance: (_actionId, player) => {
      const baseChance = getPlayStyleChance(player, "forca_aerea");
      const heightBonus = Math.round((player.height || 180) / 20);
      return Math.min(95, Math.max(10, baseChance + heightBonus + Math.round((player.attributes.physical - 50) * 0.2)));
    },
    successText: (_actionId, name) => `CABEÇADA MORTAL DE ${name.toUpperCase()}! Sobe mais que todo mundo e é GOL DE CABEÇA!`,
    failText: (_actionId, name) => `${name} sobe bem, mas cabeceia por cima do gol.`,
  },

  TIKI_TAKA: {
    chanceText: (name) => `${name} recebe entre as linhas e enxerga um espaço claríssimo para o passe decisivo!`,
    actions: [
      { id: "passe_matador", label: "Passe Matador", icon: MoveRight, classes: "bg-emerald-900/50 hover:bg-emerald-800/80 border border-emerald-700 text-emerald-200", resultType: "assist" },
    ],
    computeChance: (_actionId, player) => {
      const baseChance = getPlayStyleChance(player, "tiki_taka");
      return Math.min(95, Math.max(10, baseChance + Math.round((player.attributes.passing - 50) * 0.2)));
    },
    successText: (_actionId, name) => `PASSE DE PRIMEIRA CATEGORIA DE ${name.toUpperCase()}! Encaixa entre os zagueiros e é GOL do companheiro!`,
    failText: (_actionId, name, opponentName) => `${name} tenta o passe entre linhas, mas a zaga do ${opponentName} intercepta.`,
  },

  CRUZAMENTO_PRECISO: {
    chanceText: (name) => `Ângulo fechadíssimo na linha de fundo! ${name} tenta um cruzamento dificílimo!`,
    actions: [
      { id: "cruzamento_dificil", label: "Cruzamento Difícil", icon: Activity, classes: "bg-amber-900/50 hover:bg-amber-800/80 border border-amber-700 text-amber-200", resultType: "assist" },
    ],
    computeChance: (_actionId, player) => {
      const baseChance = getPlayStyleChance(player, "cruzamento_preciso");
      return Math.min(95, Math.max(10, baseChance + Math.round((player.attributes.passing - 50) * 0.2)));
    },
    successText: (_actionId, name) => `CRUZAMENTO DE TIRAR O FÔLEGO DE ${name.toUpperCase()}! Encontra a cabeça do companheiro. GOL!`,
    failText: (_actionId, name) => `${name} tenta o cruzamento quase impossível, mas a bola sai direto pela linha de fundo.`,
  },

  VELOZ: {
    chanceText: (name, opponentName) => `Bola em profundidade! ${name} disputa uma corrida contra o zagueiro do ${opponentName}!`,
    actions: [
      { id: "disparar", label: "Disparar", icon: Rocket, classes: "bg-purple-900/50 hover:bg-purple-800/80 border border-purple-700 text-purple-200", resultType: "goal" },
    ],
    computeChance: (_actionId, player) => {
      const baseChance = getPlayStyleChance(player, "veloz");
      return Math.min(95, Math.max(10, baseChance + Math.round((player.attributes.pace - 50) * 0.2)));
    },
    successText: (_actionId, name) => `${name.toUpperCase()} DISPARA E DEIXA A MARCAÇÃO PARA TRÁS! Fica na cara do gol e é GOL!`,
    failText: (_actionId, name) => `${name} tenta a arrancada, mas é alcançado antes de finalizar.`,
  },

  XERIFE: {
    chanceText: (name, opponentName) => `Bola disputada na entrada da área! O atacante do ${opponentName} tenta passar por ${name} na marcação!`,
    actions: [
      { id: "desarme_xerife", label: "Desarme de Xerife", icon: Shield, classes: "bg-emerald-900/50 hover:bg-emerald-800/80 border border-emerald-700 text-emerald-200" },
    ],
    computeChance: (_actionId, player) => (getPlayStyleChance(player, "xerife")),
    // Sucesso = evita o gol adversário (cenário defensivo, como INFILTRACAO).
    successText: (_actionId, name) => `DESARME DE MESTRE DE ${name.toUpperCase()}! Tira a bola sem cometer falta e ainda sai jogando!`,
    failText: (_actionId, name, opponentName) => `${name} não consegue o desarme e é GOL DO ${opponentName.toUpperCase()}!`,
  },
};

function selectScenarioForPlayer(player: Player, isSetPieceTaker: boolean): Scenario {
  const isAttacker = ATTACKING_POSITIONS.includes(player.position);
  const h = player.height || 180;
  const pace = player.attributes.pace;
  const shooting = player.attributes.shooting;
  const passing = player.attributes.passing;
  const defending = player.attributes.defending;
  const position = player.position;

  const weights: Partial<Record<Scenario, number>> = {};

  if (isAttacker) {
    weights.FRENTE_GOL = 20;
    weights.LATERAL = 20;
    weights.MEIO_CAMPO = 20;
    weights.ENTRADA_AREA = 20;
  } else {
    weights.MEIO_CAMPO = 25;
    weights.INFILTRACAO = 25;
  }

  if (isSetPieceTaker) {
    weights.PENALTI = 12;
    weights.FALTA = 12;
  }

  const hasPlayStyle = (style: PlayStyle) => player.playStyles?.some((ps) => ps.id === style);

  // 1. Quanto mais alto, mais ações de cabeceio (FORCA_AEREA - apenas com PlayStyle)
  if (hasPlayStyle("forca_aerea")) {
    weights.FORCA_AEREA = Math.max(3, Math.round((h - 160) * 0.95));
  }

  // 2. Quanto mais ritmo, mais situações de corrida difícil (VELOZ / Disparar - apenas com PlayStyle)
  if (hasPlayStyle("veloz")) {
    weights.VELOZ = Math.max(3, Math.round((pace - 25) * 0.45));
  }

  // 3. Quanto mais chute, mais situações de chute colocado (CHUTE_COLOCADO - apenas com PlayStyle)
  if (hasPlayStyle("chute_colocado")) {
    weights.CHUTE_COLOCADO = Math.max(3, Math.round((shooting - 25) * 0.45));
  }

  // 4. As posições PON e LAT têm mais situações de cruzamento difícil (CRUZAMENTO_PRECISO - apenas com PlayStyle)
  if (hasPlayStyle("cruzamento_preciso")) {
    if (position === "PON" || position === "LAT") {
      weights.CRUZAMENTO_PRECISO = 32 + Math.round((passing - 50) * 0.2);
    } else {
      weights.CRUZAMENTO_PRECISO = 6;
    }
  }

  // 5. TIKI_TAKA (apenas com PlayStyle)
  if (hasPlayStyle("tiki_taka")) {
    weights.TIKI_TAKA = Math.max(3, Math.round((passing - 25) * 0.3));
  }

  // 6. XERIFE (apenas com PlayStyle)
  if (!isAttacker && hasPlayStyle("xerife")) {
    weights.XERIFE = Math.max(5, Math.round((defending - 25) * 0.35));
  }

  const entries = Object.entries(weights) as [Scenario, number][];
  const totalWeight = entries.reduce((acc, [_, w]) => acc + w, 0);
  let roll = Math.random() * totalWeight;

  for (const [sc, w] of entries) {
    if (roll < w) return sc;
    roll -= w;
  }

  return isAttacker ? "FRENTE_GOL" : "INFILTRACAO";
}

function getScenarioPool(position: Position, includeSetPieces: boolean): Scenario[] {
  const base = ATTACKING_POSITIONS.includes(position) ? ATTACKING_SCENARIOS : DEFENSIVE_SCENARIOS;
  return includeSetPieces ? [...base, ...SET_PIECE_SCENARIOS] : base;
}

// -----------------------------------------------------------------------------

// Lives at module scope (not component state) so it persists across finals and
// seasons for as long as the app is open, but resets on a full page reload.
// This is what prevents the player from facing the exact same rival final
// after final — both within the same season (multiple finals) and across
// consecutive seasons.
const recentOpponentsByCategory = new Map<string, string[]>();

export function resetOpponentMemory() {
  recentOpponentsByCategory.clear();
}

interface MatchEvent {
  minute: number;
  text: string;
  type: "neutral" | "goal_us" | "goal_them" | "chance" | "miss";
}



const QUALITY_WORDS = ["Perfeito", "Muito Bom", "Bom", "Mediano", "Ruim", "Horrível"];

function getQualityWord(roll: number, chance: number): string {
  if (roll <= chance) {
    if (roll <= chance / 3) return "Perfeito";
    if (roll <= (chance * 2) / 3) return "Muito Bom";
    return "Bom";
  } else {
    const gap = 100 - chance;
    if (roll <= chance + gap / 3) return "Mediano";
    if (roll <= chance + (gap * 2) / 3) return "Ruim";
    return "Horrível";
  }
}

function getQualityColor(word: string): string {
  switch (word) {
    case "Perfeito": return "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]";
    case "Muito Bom": return "text-emerald-400";
    case "Bom": return "text-green-300";
    case "Mediano": return "text-yellow-400";
    case "Ruim": return "text-orange-500";
    case "Horrível": return "text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]";
    default: return "text-white";
  }
}

function AnimatedActionQuality({ rollValue, chance }: { rollValue: number, chance: number }) {
  const [currentWord, setCurrentWord] = useState(QUALITY_WORDS[0]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let startTime: number;
    const duration = 950;
    let lastChange = 0;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        if (timestamp - lastChange > 100) {
          setCurrentWord(QUALITY_WORDS[Math.floor(Math.random() * QUALITY_WORDS.length)]);
          lastChange = timestamp;
        }
        requestAnimationFrame(animate);
      } else {
        setCurrentWord(getQualityWord(rollValue, chance));
        setDone(true);
      }
    };
    
    requestAnimationFrame(animate);
  }, [rollValue, chance]);

  const colorClass = done ? getQualityColor(currentWord) : "text-slate-300 opacity-50";
  const scaleClass = done ? "scale-110 transition-transform duration-200" : "scale-100";

  return <span className={`inline-block font-black text-2xl md:text-3xl uppercase tracking-widest ${colorClass} ${scaleClass}`}>{currentWord}</span>;
}


export function InteractiveMatchModal({
 
  player, 
  finalType, 
  onComplete,
  explicitOpponent,
  allowDraw = false,
  headerLabel,
}: { 
  player: Player; 
  finalType: string; 
  onComplete: (
    won: boolean,
    playerGoals: number,
    playerAssists: number,
    finalScoreFor?: number,
    finalScoreAgainst?: number,
    isDraw?: boolean,
    rating?: number,
    isMOTM?: boolean
  ) => void;
  // Quando informado (partidas de liga com adversário já sorteado pelo
  // calendário), pula o sorteio aleatório de adversário e usa este time.
  explicitOpponent?: Team;
  // Partidas de liga podem terminar empatadas (ao contrário de finais, que
  // vão para os pênaltis). Quando true, pula a disputa de pênaltis.
  allowDraw?: boolean;
  // Texto customizado exibido no lugar de "Final: {finalType}" (ex: "Rodada 12 - Brasileirão").
  headerLabel?: string;
}) {
  const [status, setStatus] = useState<MatchStatus>("INTRO");
  const [minute, setMinute] = useState(0);
  const [scoreUs, setScoreUs] = useState(0);
  const [scoreThem, setScoreThem] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [opponentName, setOpponentName] = useState("Adversário");
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  
  // To track player chances
  const [chancesHad, setChancesHad] = useState(0);
  const [totalChances, setTotalChances] = useState(1);
  
  const [resolvingPenalties, setResolvingPenalties] = useState(false);
  const [diceRollInfo, setDiceRollInfo] = useState<{ actionId: string; chance: number; isSuccess: boolean; rollValue: number } | null>(null);


  // Gols e assistências que o PRÓPRIO jogador fez nesta final (somados ao
  // total da temporada quando a partida termina). Gols/assistências de
  // outros companheiros ("GOL DA SUA EQUIPE!") não entram aqui.
  const [matchGoals, setMatchGoals] = useState(0);
  const [matchAssists, setMatchAssists] = useState(0);
  const [successfulPasses, setSuccessfulPasses] = useState(0);
  const [successfulDribbles, setSuccessfulDribbles] = useState(0);
  const [successfulTackles, setSuccessfulTackles] = useState(0);
  const [successfulMarkings, setSuccessfulMarkings] = useState(0);
  const [successfulActions, setSuccessfulActions] = useState(0);
  const [failedActions, setFailedActions] = useState(0);

  const isNational = finalType.includes("Copa do Mundo") || finalType.includes("Eurocopa") || finalType.includes("Copa América") || finalType.includes("Copa da Ásia") || finalType.includes("Copa Continental (Seleção)");
  const playerTeamName = isNational ? player.nationality : player.currentTeam.name;

  const playerTeamLogo = isNational
    ? NATIONAL_TEAMS.find(t => t.name === player.nationality)?.logo
    : player.currentTeam.logo;

  const opponentLogo = isNational
    ? NATIONAL_TEAMS.find(t => t.name === opponentName)?.logo
    : TEAMS.find(t => t.name === opponentName)?.logo;

  useEffect(() => {
    if (explicitOpponent) {
      // Partida de liga: o adversário já vem definido pelo calendário da
      // rodada, então pulamos todo o sorteio aleatório de adversário.
      setOpponentName(explicitOpponent.name);
      setStatus("INTRO");
      setMinute(0);
      setScoreUs(0);
      setScoreThem(0);
      setEvents([]);
      setChancesHad(0);
      setCurrentScenario(null);
      setMatchGoals(0);
      setMatchAssists(0);
      setSuccessfulPasses(0);
      setSuccessfulDribbles(0);
      setSuccessfulTackles(0);
      setSuccessfulMarkings(0);
      const isIdol = player.idolClubs?.includes(player.currentTeam.name);
      setTotalChances(isIdol ? 6 : Math.floor(Math.random() * 6) + 1);
      return;
    }

    let ops = TEAMS.map(t => t.name);
    // `category` groups finals that draw from the same pool of possible
    // opponents, so we know which "recently faced" list applies to this draw.
    let category = "geral";

    if (finalType.includes("Mundial")) {
      category = "mundial";
      // Qualquer time nível 5 (o mais alto) do mundo pode ser sorteado como
      // adversário no Mundial de Clubes, exceto o próprio time do jogador.
      ops = TEAMS.filter(t => t.level >= 4 && t.id !== player.currentTeam.id).map(t => t.name);
      if (ops.length === 0) ops = ["Real Madrid", "M. City", "B. de Munique"];
    } else if (finalType.includes("Eurocopa")) {
      // Eurocopa - só seleções europeias disputam.
      category = `selecao-${finalType}`;
      ops = EUROPEAN_NATIONALITIES.filter(c => c !== player.nationality);
    } else if (finalType.includes("Copa América")) {
      // Copa América - só seleções americanas disputam.
      category = `selecao-${finalType}`;
      ops = AMERICAN_NATIONALITIES.filter(c => c !== player.nationality);
    } else if (finalType.includes("Copa da Ásia")) {
      // Copa da Ásia - só seleções asiáticas disputam.
      category = `selecao-${finalType}`;
      ops = ASIAN_NATIONALITIES.filter(c => c !== player.nationality);
    } else if (isNational) {
      // Copa do Mundo (ou fallback genérico) - qualquer seleção cadastrada em
      // data.ts pode aparecer, exceto a do próprio jogador.
      category = `selecao-${finalType}`;
      ops = NATIONALITIES.filter(c => c !== player.nationality);
    } else if (finalType.includes("Libertadores")) {
      category = "libertadores";
      // Países sul-americanos cadastrados em TEAMS
      const LIBERTADORES_COUNTRIES = ["BR", "AR", "UY"];
      ops = TEAMS.filter(
        t => LIBERTADORES_COUNTRIES.includes(t.country) && t.level >= 3 && t.id !== player.currentTeam.id
      ).map(t => t.name);
      if (ops.length === 0) ops = ["Boca Juniors", "River Plate", "Peñarol"]; // fallback de segurança
    } else if (finalType.includes("Champions") || (finalType.includes("Continental") && !isNational)) {
      // A Champions League é uma competição europeia - só clubes da Europa
      category = "continental";
      const UEFA_COUNTRIES = ["EN", "ES", "IT", "DE", "FR", "PT", "NL"];
      ops = TEAMS.filter(t => UEFA_COUNTRIES.includes(t.country) && t.level >= 4 && t.id !== player.currentTeam.id).map(t => t.name);
      if (ops.length === 0) ops = ["B. de Munique", "Real Madrid", "PSG", "M. City", "Juventus"];
    } else {
      category = `domestico-${player.currentTeam.country}`;
      const domestic = TEAMS.filter(t => t.country === player.currentTeam.country && t.id !== player.currentTeam.id);
      if (domestic.length > 0) {
        ops = domestic.map(t => t.name);
      }
    }
    ops = ops.filter(name => name !== playerTeamName);
    if (ops.length === 0) {
      ops = ["Rival"];
    }

    // Exclude opponents recently faced in this same category (this is what
    // stops back-to-back finals — same season or consecutive seasons —
    // against the identical rival). If excluding them would leave no
    // options (tiny pools), fall back to the full list so the draw never breaks.
    const recent = recentOpponentsByCategory.get(category) || [];
    const freshOptions = ops.filter(name => !recent.includes(name));
    const pool = freshOptions.length > 0 ? freshOptions : ops;

    const chosen = pool[Math.floor(Math.random() * pool.length)] || "Adversário";
    setOpponentName(chosen);

    // Remember this pick. We only keep up to half the pool size so that in
    // small pools (e.g. a 5-team domestic league) we don't end up excluding
    // every possible opponent.
    const memorySize = Math.max(1, Math.floor(ops.length / 2));
    recentOpponentsByCategory.set(category, [chosen, ...recent].slice(0, memorySize));

    setStatus("INTRO");
    setMinute(0);
    setScoreUs(0);
    setScoreThem(0);
    setEvents([]);
    setChancesHad(0);
    setCurrentScenario(null);
    setMatchGoals(0);
    setMatchAssists(0);
    setSuccessfulPasses(0);
    setSuccessfulDribbles(0);
    setSuccessfulTackles(0);
    setSuccessfulMarkings(0);
    // Cada final agora sorteia entre 1 e 6 chances de o jogador participar
    // ativamente da jogada, em vez de sempre uma única oportunidade.
    const isIdol = player.idolClubs?.includes(player.currentTeam.name);
    setTotalChances(isIdol && !isNational ? 6 : Math.floor(Math.random() * 6) + 1);
  }, [finalType, player.currentTeam.country, player.currentTeam.name, player.idolClubs, player.nationality, isNational, explicitOpponent]);

  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events]);

  const addEvent = (text: string, type: MatchEvent["type"] = "neutral", atMinute?: number) => {
    setEvents(prev => [...prev, { minute: atMinute ?? minute, text, type }]);
  };

  useEffect(() => {
    let timer: number;
    if (status === "SIMULATING") {
      timer = window.setInterval(() => {
        setMinute(m => {
          const nextMin = m + 1;
          
          if (nextMin >= 90) {
            setStatus("FINISHED");
            addEvent("Fim de Jogo! O árbitro apita o final da partida.", "neutral", nextMin);
            return 90;
          }

          // Random generic events
          if (Math.random() < 0.12) {
            const genericEvents = [
              `A equipe do ${opponentName} troca passes no meio de campo.`,
              "Falta dura no meio de campo. O juiz só adverte.",
              "Cobrança de escanteio perigosa, mas o goleiro afasta.",
              "A bola sai pela lateral.",
              "Posse de bola disputada, jogo muito truncado e pegado.",
              `O ${opponentName} tenta um lançamento, mas a zaga corta.`,
              "Impedimento marcado pelo bandeirinha.",
              "Jogo paralisado para atendimento médico."
            ];
            addEvent(genericEvents[Math.floor(Math.random() * genericEvents.length)], "neutral", nextMin);
          }

          // Probabilidades dinâmicas de gol baseadas nos níveis dos times (mais realistas)
          const playerTeamLevel = player.currentTeam?.level || 3;
          let opponentLevel = explicitOpponent?.level;
          if (!opponentLevel) {
            const foundOpponent = TEAMS.find(t => t.name.toLowerCase() === opponentName.toLowerCase());
            opponentLevel = foundOpponent?.level || 3;
          }

          const opponentGoalChance = Math.max(0.001, Math.min(0.008, 0.0035 * Math.sqrt(opponentLevel / 3.0) / Math.sqrt(playerTeamLevel / 3.0)));
          const teammateGoalChance = Math.max(0.001, Math.min(0.008, 0.0035 * Math.sqrt(playerTeamLevel / 3.0) / Math.sqrt(opponentLevel / 3.0)));

          // Opponent scores
          if (Math.random() < opponentGoalChance) {
            setScoreThem(s => s + 1);
            addEvent(`GOL DO ${opponentName.toUpperCase()}! Eles abrem a defesa e marcam.`, "goal_them", nextMin);
          }

          // Team scores without player
          if (Math.random() < teammateGoalChance) {
            setScoreUs(s => s + 1);
            addEvent(`GOL DA SUA EQUIPE! Uma bela jogada coletiva termina na rede!`, "goal_us", nextMin);
          }

          // Player chance! (probabilidade um pouco maior que antes para que
          // seja realmente possível emplacar as até 6 chances sorteadas
          // dentro dos 90 minutos, e não só na teoria). O cenário sorteado
          // depende da posição do jogador: ATA/PON/MEI vivem momentos mais
          // ofensivos, enquanto MC/VOL/ZAG/LAT vivem momentos de recuperação
          // de bola e marcação.
          if (chancesHad < totalChances && Math.random() < 0.035) {
            const playerOvr = calculateOverall(player.attributes, player.position);
            const threshold = SET_PIECE_OVR_THRESHOLD[player.currentTeam.level] ?? Infinity;
            const isSetPieceTaker = playerOvr >= threshold;

            const scenario = selectScenarioForPlayer(player, isSetPieceTaker);

            setCurrentScenario(scenario);
            setStatus("WAITING_ACTION");
            addEvent(SCENARIOS[scenario].chanceText(player.name, opponentName), "chance", nextMin);
          }

          return nextMin;
        });
      }, 75); // Velocidade da partida (75ms por minuto)
    }
    
    return () => clearInterval(timer);
  }, [status, chancesHad, totalChances, player.name, player.position, player.currentTeam.level, opponentName]);

  const getDifficultyMod = () => {
    let oppLevel = explicitOpponent?.level;
    if (!oppLevel) {
      const found = TEAMS.find(t => t.name.toLowerCase() === opponentName.toLowerCase());
      oppLevel = found?.level || 3;
    }
    return (oppLevel - 1) * 2;
  };

  const handleAction = (actionId: string) => {
    if (!currentScenario) return;

    const config = SCENARIOS[currentScenario];
    const difficultyMod = getDifficultyMod();

    let chance = config.computeChance(actionId, player, difficultyMod);
    chance = PLAYSTYLE_SCENARIO_SET.has(currentScenario)
      ? Math.round(chance)
      : Math.max(10, Math.min(90, Math.round(chance)));
    
    // Rola de 1 a 100
    const rollValue = Math.floor(Math.random() * 100) + 1;
    const isSuccess = rollValue <= chance;

    setDiceRollInfo({ actionId, chance, isSuccess, rollValue });
    setStatus("ROLLING_DICE");
    
    // Apply result after animation (e.g. 1.8s)
    setTimeout(() => {
      const isDefensiveScenario = DEFENSIVE_SCENARIO_SET.has(currentScenario);
      const quality = getQualityWord(rollValue, chance);

      if (isSuccess) {
        setSuccessfulActions(s => s + 1);

        if (actionId === "driblar") {
          setSuccessfulDribbles(d => d + 1);
          addEvent(`${player.name.toUpperCase()} DRIBLA O MARCADOR E FICA DE FRENTE PRO GOL!`, "chance");

          setDiceRollInfo(null);
          setCurrentScenario("FRENTE_GOL_DRIBLE");
          setStatus("WAITING_ACTION");
          return;
        }

        setChancesHad(c => c + 1);

        const isPassOrCross = actionId === "passe" || actionId === "cruzar" || actionId === "passe_matador" || actionId === "cruzamento_dificil";

        if (actionId === "desarmar" || actionId === "desarme_xerife") {
          setSuccessfulTackles(t => t + 1);
        } else if (actionId === "marcar") {
          setSuccessfulMarkings(m => m + 1);
        } else if (isPassOrCross) {
          setSuccessfulPasses(p => p + 1);
        }

        if (isDefensiveScenario) {
          addEvent(config.successText(actionId, player.name, opponentName), "chance");
        } else if (isPassOrCross) {
          const action = config.actions.find(a => a.id === actionId);
          // Se for "Perfeito", 100% gol/assistência.
          // Se for "Muito Bom" ou "Bom", o companheiro tem chance de errar o gol baseada no nível do time.
          const isPerfeito = quality === "Perfeito";
          const teamLevel = player.currentTeam.level || 1;
          const missChanceMap: Record<number, number> = { 1: 0.80, 2: 0.75, 3: 0.60, 4: 0.50, 5: 0.40 };
          const missChance = missChanceMap[teamLevel] ?? 0.40;
          const teammateMissed = !isPerfeito && Math.random() < missChance;

          if (teammateMissed) {
            addEvent(`${player.name} fez o lançamento de qualidade (${quality}), mas o companheiro de equipe errou o chute e perdeu o gol!`, "miss");
          } else {
            setScoreUs(s => s + 1);
            if (action?.resultType === "assist" || isPassOrCross) {
              setMatchAssists(a => a + 1);
            }
            addEvent(config.successText(actionId, player.name, opponentName), "goal_us");
          }
        } else {
          const opponentTeamLevel = explicitOpponent?.level || TEAMS.find(t => t.name === opponentName)?.level || 3;
          const gkSaveChanceMap: Record<number, number> = { 1: 0.10, 2: 0.15, 3: 0.20, 4: 0.25, 5: 0.30 };
          const gkSaveChance = gkSaveChanceMap[opponentTeamLevel] ?? 0.20;
          const gkSaved = Math.random() < gkSaveChance;

          if (gkSaved) {
            addEvent(`DEFESA DO GOLEIRO! ${player.name} finalizou bem (${quality}), mas o goleiro do ${opponentName} fez a defesa e evitou o gol!`, "miss");
          } else {
            setScoreUs(s => s + 1);
            const action = config.actions.find(a => a.id === actionId);
            if (action?.resultType === "goal" || !action?.resultType) {
              setMatchGoals(g => g + 1);
            } else if (action?.resultType === "assist") {
              setMatchAssists(a => a + 1);
            }
            addEvent(config.successText(actionId, player.name, opponentName), "goal_us");
          }
        }
      } else {
        setChancesHad(c => c + 1);
        setFailedActions(f => f + 1);
        if (isDefensiveScenario) {
          setScoreThem(s => s + 1);
          addEvent(config.failText(actionId, player.name, opponentName), "goal_them");
        } else {
          addEvent(config.failText(actionId, player.name, opponentName), "miss");
        }
      }

      setDiceRollInfo(null);
      setCurrentScenario(null);
      setStatus("SIMULATING");
    }, 2000);
  };

  const getEventColor = (type: MatchEvent["type"]) => {
    switch(type) {
      case "goal_us": return "text-emerald-400 font-bold bg-emerald-950/30 p-2 rounded";
      case "goal_them": return "text-red-400 font-bold bg-red-950/30 p-2 rounded";
      case "chance": return "text-blue-400 font-bold border-l-4 border-blue-500 pl-2";
      case "miss": return "text-orange-400 italic";
      default: return "text-slate-400";
    }
  };

  const calculateLiveRating = (
    currMinute: number,
    goals: number,
    assists: number,
    passes: number,
    dribbles: number,
    tackles: number,
    markings: number
  ): number => {
    const base = 6.0;
    const minuteLoss = Math.floor(currMinute / 10) * 0.1;
    const passesGain = passes * 0.4;
    const goalsGain = goals * 1.9;
    const assistsGain = assists * 1.8;
    const dribblesGain = dribbles * 0.3;
    const tacklesGain = tackles * 0.9;
    const markingsGain = markings * 1.4;

    const total = base - minuteLoss + passesGain + goalsGain + assistsGain + dribblesGain + tacklesGain + markingsGain;
    return Number(Math.min(10.0, Math.max(1.0, total)).toFixed(1));
  };

  const matchRating = calculateLiveRating(
    minute,
    matchGoals,
    matchAssists,
    successfulPasses,
    successfulDribbles,
    successfulTackles,
    successfulMarkings
  );
  const isMOTM = matchRating >= 8.0;

  const handleFinish = () => {
    if (resolvingPenalties) return;

    if (scoreUs === scoreThem && allowDraw) {
      onComplete(false, matchGoals, matchAssists, scoreUs, scoreThem, true, matchRating, isMOTM);
      return;
    }

    if (scoreUs === scoreThem) {
      setResolvingPenalties(true);
      const won = Math.random() > 0.5;
      addEvent("Fim do tempo regulamentar! Vamos para a disputa de pênaltis!", "neutral");
      
      setTimeout(() => {
        const finalUs = won ? scoreUs + 1 : scoreUs;
        const finalThem = won ? scoreThem : scoreThem + 1;
        const finalRating = calculateLiveRating(minute, matchGoals, matchAssists, successfulPasses, successfulDribbles, successfulTackles, successfulMarkings);
        const finalMOTM = finalRating >= 8.0;

        if (won) {
          setScoreUs(s => s + 1);
          addEvent(`O goleiro defende a última cobrança do ${opponentName}! SEU TIME É CAMPEÃO NOS PÊNALTIS!`, "goal_us");
        } else {
          setScoreThem(s => s + 1);
          addEvent(`Cobrança na trave... O ${opponentName} vence nos pênaltis.`, "goal_them");
        }
        setResolvingPenalties(false);
        onComplete(won, matchGoals, matchAssists, finalUs, finalThem, false, finalRating, finalMOTM);
      }, 1500);
      return;
    }
    
    let won = scoreUs > scoreThem;
    onComplete(won, matchGoals, matchAssists, scoreUs, scoreThem, false, matchRating, isMOTM);
  };

  const currentActions = currentScenario ? SCENARIOS[currentScenario].actions : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border-2 border-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col h-[85vh] max-h-[800px] overflow-hidden">
        
        {/* Header / Scoreboard */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 text-center relative shrink-0">
          <div className="text-emerald-500 mb-2 font-black uppercase tracking-widest text-sm flex justify-center items-center gap-2">
            {headerLabel || `Final: ${finalType}`}
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="text-right flex-1 overflow-hidden flex flex-col items-center justify-end gap-3">
              {playerTeamLogo && (
                <img src={playerTeamLogo} alt={playerTeamName} draggable="false" className="w-14 h-auto object-contain p-1 shadow-md flex-shrink-0" />
              )}
              <div>
                <h2 className="text-xs sm:text-xl font-black text-slate-100">{playerTeamName}</h2>
              </div>
            </div>
            
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="bg-slate-900 border-2 border-slate-800 px-4 py-2 rounded-2xl flex items-center justify-center gap-4 text-xl sm:text-4xl font-black text-white min-w-[80px]">
                <span>{scoreUs}</span>
                <span className="text-slate-600">-</span>
                <span>{scoreThem}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-xl text-slate-100 font-bold">{minute}'</span>
              </div>
            </div>

            <div className="text-left flex-1 overflow-hidden flex flex flex-col items-center justify-start gap-3">
              {opponentLogo && (
                <img src={opponentLogo} alt={opponentName} draggable="false" className="w-14 h-auto object-contain p-1 shadow-md flex-shrink-0" />
              )}
              <div>
                <h2 className="text-xs sm:text-xl font-black text-slate-100">{opponentName}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Match Events Scroll */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3 font-mono text-sm bg-[#0a0f1c]">
          {events.length === 0 && status === "INTRO" && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Trophy className="w-16 h-16 opacity-20" />
            </div>
          )}
          {events.map((ev, i) => (
            <div key={i} className={`flex gap-4 ${getEventColor(ev.type)} transition-all animate-in slide-in-from-bottom-2`}>
              <span className="w-8 shrink-0 font-bold opacity-70">{ev.minute}'</span>
              <span>{ev.text}</span>
            </div>
          ))}
          <div ref={eventsEndRef} />
        </div>

        {/* Controls / Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 shrink-0">
          {status === "INTRO" && (
            <button 
              onClick={() => {
                setStatus("SIMULATING");
                addEvent("Apita o árbitro! Começa a grande final!", "neutral");
              }}
              className="w-full py-4 bg-emerald-800 hover:bg-emerald-700 text-slate-100 font-black rounded-2xl transition-all text-xl flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" fill="currentColor" /> Iniciar Partida
            </button>
          )}

          {status === "WAITING_ACTION" && currentScenario && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 text-blue-400 font-bold justify-center mb-2">
                <AlertCircle className="w-5 h-5 animate-bounce" />
                Escolha:
              </div>
              <div className={`grid gap-4 ${currentActions.length === 3 ? "grid-cols-1 sm:grid-cols-3" : currentActions.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {currentActions.map((action) => {
                  const Icon = action.icon;
                  const difficultyMod = getDifficultyMod();
                  let chance = SCENARIOS[currentScenario].computeChance(action.id, player, difficultyMod);
                  chance = PLAYSTYLE_SCENARIO_SET.has(currentScenario)
                    ? Math.round(chance)
                    : Math.max(10, Math.min(90, Math.round(chance)));
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      className={`p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${action.classes}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-6 h-6" /> {action.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          
          {status === "ROLLING_DICE" && diceRollInfo && (
            <div className="flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
              
              <div className="h-28 flex items-center justify-center w-full">
                <AnimatedActionQuality rollValue={diceRollInfo.rollValue} chance={diceRollInfo.chance} />
              </div>
            </div>
          )}

          {status === "SIMULATING" && (
            <div className="flex flex-col justify-center items-center py-2 space-y-1.5 h-20">
              <div className="text-slate-500 font-bold tracking-widest uppercase text-xs sm:text-sm animate-pulse">
                Simulando...
              </div>
              <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nota do Jogador:</span>
                <span className={`text-lg font-black ${
                  matchRating >= 8.0
                    ? "text-amber-400"
                    : matchRating >= 7.0
                    ? "text-emerald-400"
                    : matchRating >= 6.0
                    ? "text-blue-400"
                    : "text-red-400"
                }`}>
                  {matchRating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {status === "FINISHED" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl border flex flex-col items-center justify-center font-black ${
                    matchRating >= 8.0 
                      ? 'border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10'
                      : matchRating >= 7.0
                      ? 'border-emerald-500/50 text-emerald-300'
                      : 'border-slate-800 text-slate-200'
                  }`}>
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Nota do Jogador</span>
                    <span className="text-2xl font-black">{matchRating.toFixed(1)}</span>
                  </div>

                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold text-slate-200 flex flex-wrap gap-1">
                      <span>{matchGoals} Gols</span> • <span>{matchAssists} Assistências</span>
                    </div>
                    {isMOTM ? (
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400 mt-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 w-fit">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        🏆 MELHOR DA PARTIDA!
                      </div>
                    ) : (
                      <p className=""></p>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleFinish}
                disabled={resolvingPenalties}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all text-xl"
              >
                {resolvingPenalties
                  ? "Cobrando pênaltis..."
                  : scoreUs === scoreThem && allowDraw
                  ? "Confirmar e Continuar"
                  : scoreUs === scoreThem
                  ? "Ir para os Pênaltis"
                  : "Confirmar e Continuar"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}