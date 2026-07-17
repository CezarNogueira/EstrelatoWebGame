import { useState } from "react";
import { Attributes, FinalResult, Player, Position, RomanceEvent, SeasonStat, Team } from "./types";
import { StartScreen } from "./components/StartScreen";
import { ChooseNationality } from "./components/ChooseNationality";
import { ChooseAppearance } from "./components/ChooseAppearance";
import { Roulette } from "./components/Roulette";
import { ChoosePosition } from "./components/ChoosePosition";
import { Dashboard } from "./components/Dashboard";
import { TrainingModal } from "./components/TrainingModal";
import { FinalsModal } from "./components/FinalsModal";
import { ProContractModal } from "./components/ProContractModal";
import { CareerSummary } from "./components/CareerSummary";
import { ContractNegotiationModal } from "./components/ContractNegotiationModal";
import { ContractOffersModal } from "./components/ContractOffersModal";

import { InteractiveMatchModal, resetOpponentMemory } from "./components/InteractiveMatchModal";
import { RomanceEventModal } from "./components/RomanceEventModal";
import { generateRomanceEvent } from "./data/romanceEvents";
import { MentalHealthModal } from "./components/MentalHealthModal";
import { HeartCrack, Heart } from "lucide-react";
import { generateRelationships, generateFriend } from "./data";
import { simulateSeason, applyGrowth, autoDistributePoints, generatePressMessage, calculateMarketValue, calculateOverall, formatCurrency, getReachedFinals, getContractEndOffers, addMessageToChat } from "./utils";
import { NewFriendModal } from "./components/NewFriendModal";
import { Friend } from "./types";

// Abaixo deste valor de Social, os encontros da temporada tendem a terminar
// em "não rolou química" em vez de virarem um evento de romance completo.
const ROMANCE_INTEREST_THRESHOLD = 40;

type Screen = "START" | "CHOOSE_NATIONALITY" | "CHOOSE_APPEARANCE" | "ROULETTE" | "CHOOSE_POSITION" | "DASHBOARD" | "CAREER_SUMMARY";

export default function App() {
  const [screen, setScreen] = useState<Screen>("START");
  const [player, setPlayer] = useState<Player | null>(null);
  const [draftTeam, setDraftTeam] = useState<Team | null>(null);
  const [playerName, setPlayerName] = useState<string>("Você");
  const [playerNationality, setPlayerNationality] = useState<string>("");
  const [playerAvatar, setPlayerAvatar] = useState<string>("");

  const handleStart = (name: string) => {
    setPlayerName(name);
    setScreen("CHOOSE_NATIONALITY");
  };

  const handleNationalitySelected = (nationality: string) => {
    setPlayerNationality(nationality);
    setScreen("CHOOSE_APPEARANCE");
  };

  const handleAppearanceSelected = (avatarUrl: string) => {
    setPlayerAvatar(avatarUrl);
    setScreen("ROULETTE");
  };

  const handleTeamSelected = (team: Team) => {
    setDraftTeam(team);
    setScreen("CHOOSE_POSITION");
  };

  const handlePositionSelected = (position: Position) => {
    if (!draftTeam) return;
    const attributes = {
      pace: 50,
      shooting: 50,
      passing: 50,
      dribbling: 50,
      defending: 50,
      physical: 50,
    };
    const initialOvr = calculateOverall(attributes, position);
    const initialMarketValue = calculateMarketValue(initialOvr, 14);

    setPlayer({
      name: playerName,
      avatarUrl: playerAvatar,
      age: 14,
      position,
      attributes,
      currentTeam: draftTeam,
      history: [],
      retired: false,
      caps: 0,
      nationality: playerNationality,
      isPro: false,
      marketValue: initialMarketValue,
      salary: 0,
      contractYears: 0,
      money: 0,
      assets: [],
      hasPersonalTrainer: false,
      hasMasseuse: false,
      usedExclusiveParty: false,
      usedInternationalTrip: false,
      bootSponsor: null,
      relationships: generateRelationships(playerNationality),
      personal: {
        mood: 100,
        health: 100,
        social: 0
      }
    });
    setScreen("DASHBOARD");
  };

  const [transferOffer, setTransferOffer] = useState<Team | null>(null);
  const [showTraining, setShowTraining] = useState(false);
  const [nationalTeamMsg, setNationalTeamMsg] = useState(false);
  const [pendingFinals, setPendingFinals] = useState<FinalResult[] | null>(null);

  const [pendingProContract, setPendingProContract] = useState<boolean>(false);
  
  const [pendingContractNegotiation, setPendingContractNegotiation] = useState<{
    type: "PRO" | "TRANSFER" | "RENEWAL";
    team: Team;
  } | null>(null);
  const [pendingContractOffers, setPendingContractOffers] = useState<Team[] | null>(null);

  const [pendingSimulationPhase, setPendingSimulationPhase] = useState<{
    baseUpdatedPlayer: Player;
    seasonStat: SeasonStat;
    transferOffer: Team | null;
    proContractOffer: boolean;
  } | null>(null);

  const [reachedFinalsQueue, setReachedFinalsQueue] = useState<string[]>([]);
  const [playedFinals, setPlayedFinals] = useState<{type: string; won: boolean}[]>([]);
  const [currentFinalType, setCurrentFinalType] = useState<string | null>(null);
  const [pendingTrainingBuff, setPendingTrainingBuff] = useState<Partial<Attributes> | undefined>();
  // Soma de gols e assistências que o jogador fez pessoalmente nas finais
  // interativas jogadas nesta temporada - somada ao total gerado pela
  // simulação da temporada quando ela termina.
  const [finalsGoalsAssists, setFinalsGoalsAssists] = useState({ goals: 0, assists: 0 });

  const [pendingMentalHealthEvent, setPendingMentalHealthEvent] = useState<{ type: "depressed" | "isolated" } | null>(null);

  const handleSimulate = () => {
    if (!player) return;
    
    if (Math.random() < 0.25) {
      setShowTraining(true);
    } else {
      startSimulationFlow();
    }
  };

  const handleTrain = (trainingBuff: Partial<Attributes>) => {
    setShowTraining(false);
    startSimulationFlow(trainingBuff);
  };

  const startSimulationFlow = (trainingBuff?: Partial<Attributes>) => {
    if (!player) return;
    setPendingTrainingBuff(trainingBuff);

    const currentOvr = calculateOverall(player.attributes, player.position);
    const reached = getReachedFinals(player, currentOvr);

    if (reached.length > 0) {
      setReachedFinalsQueue(reached);
      setPlayedFinals([]);
      setFinalsGoalsAssists({ goals: 0, assists: 0 });
      setCurrentFinalType(reached[0]);
    } else {
      executeSimulation(trainingBuff, []);
    }
  };

  const handleInteractiveFinalComplete = (won: boolean, playerGoals: number, playerAssists: number) => {
    const updatedPlayed = [...playedFinals, { type: currentFinalType!, won }];
    setPlayedFinals(updatedPlayed);

    const updatedGoalsAssists = {
      goals: finalsGoalsAssists.goals + playerGoals,
      assists: finalsGoalsAssists.assists + playerAssists,
    };
    setFinalsGoalsAssists(updatedGoalsAssists);

    if (reachedFinalsQueue.length > 1) {
      const newQueue = reachedFinalsQueue.slice(1);
      setReachedFinalsQueue(newQueue);
      setCurrentFinalType(newQueue[0]);
    } else {
      setReachedFinalsQueue([]);
      setCurrentFinalType(null);
      executeSimulation(pendingTrainingBuff, updatedPlayed, updatedGoalsAssists);
    }
  };

  const executeSimulation = (
    trainingBuff?: Partial<Attributes>,
    prePlayedFinals?: {type: string; won: boolean}[],
    finalsStatsBonus?: { goals: number; assists: number }
  ) => {
    if (!player) return;
    const { baseUpdatedPlayer, seasonStat, transfer, earnedPoints, proContractOffer } = simulateSeason(player, prePlayedFinals);

    const autoDist = autoDistributePoints(earnedPoints, baseUpdatedPlayer.attributes, player.position);
    
    const combinedBuff: Partial<Attributes> = {};
    const attrs: (keyof Attributes)[] = ["pace", "shooting", "passing", "dribbling", "defending", "physical"];
    attrs.forEach(attr => {
      combinedBuff[attr] = (autoDist[attr] || 0) + (trainingBuff?.[attr] || 0);
    });

    if (player.hasPersonalTrainer && combinedBuff.physical) {
      combinedBuff.physical = Math.ceil(combinedBuff.physical * 1.5);
    }

    const finalAttributes = applyGrowth(baseUpdatedPlayer.attributes, combinedBuff);

    const pressMessage = generatePressMessage(
      baseUpdatedPlayer,
      seasonStat,
      transfer || null,
      proContractOffer || false
    );

    const finalStat: SeasonStat = {
      ...seasonStat,
      // Gols e assistências feitos pelo jogador nas finais interativas somam
      // ao total gerado pela simulação da temporada.
      goals: seasonStat.goals + (finalsStatsBonus?.goals || 0),
      assists: seasonStat.assists + (finalsStatsBonus?.assists || 0),
      attributeChanges: {
        pace: (seasonStat.attributeChanges.pace || 0) + (combinedBuff.pace || 0),
        shooting: (seasonStat.attributeChanges.shooting || 0) + (combinedBuff.shooting || 0),
        passing: (seasonStat.attributeChanges.passing || 0) + (combinedBuff.passing || 0),
        dribbling: (seasonStat.attributeChanges.dribbling || 0) + (combinedBuff.dribbling || 0),
        defending: (seasonStat.attributeChanges.defending || 0) + (combinedBuff.defending || 0),
        physical: (seasonStat.attributeChanges.physical || 0) + (combinedBuff.physical || 0),
      },
      pressMessage,
    };

    const currentOvr = calculateOverall(finalAttributes, player.position);
    const marketValue = calculateMarketValue(currentOvr, baseUpdatedPlayer.age);

    const finalBasePlayer: Player = {
      ...baseUpdatedPlayer,
      attributes: finalAttributes,
      marketValue,
      history: [finalStat, ...player.history],
      caps: player.caps + (finalStat.nationalTeamCall ? 1 : 0),
      money: player.money + (player.salary || 0),
      hasPersonalTrainer: false,
      hasMasseuse: false,
      usedExclusiveParty: false,
      usedInternationalTrip: false,
    };

    if (finalStat.nationalTeamCall) {
      setNationalTeamMsg(true);
      setTimeout(() => setNationalTeamMsg(false), 4000);
    }

    const stateToPass = {
      baseUpdatedPlayer: finalBasePlayer,
      seasonStat: finalStat,
      transferOffer: transfer || null,
      proContractOffer: proContractOffer || false,
    };

    if (finalStat.depressed) {
      setPendingMentalHealthEvent({ type: "depressed" });
      setPendingSimulationPhase(stateToPass);
    } else if (finalStat.isolated) {
      setPendingMentalHealthEvent({ type: "isolated" });
      setPendingSimulationPhase(stateToPass);
    } else {
      proceedToInjuryCheck(stateToPass);
    }
  };

  const proceedToInjuryCheck = (stateToPass: any) => {
    if (stateToPass.baseUpdatedPlayer.retired) {
      finishSeason(stateToPass);
    } else {
      proceedAfterInjuryCheck(stateToPass);
    }
  };

  const handleContinueFromMentalHealth = () => {
    if (!pendingSimulationPhase) return;
    const stateToPass = pendingSimulationPhase;
    setPendingMentalHealthEvent(null);
    proceedToInjuryCheck(stateToPass);
  };

  const proceedAfterInjuryCheck = (stateToPass: any) => {
    if (stateToPass.seasonStat.finals && stateToPass.seasonStat.finals.length > 0) {
      setPendingFinals(stateToPass.seasonStat.finals);
      setPendingSimulationPhase(stateToPass);
    } else {
      proceedToProContract(stateToPass);
    }
  };



  const proceedToProContract = (stateToPass: any) => {
    if (stateToPass.proContractOffer) {
      setPendingProContract(true);
      setPendingSimulationPhase(stateToPass);
    } else {
      proceedToTransfer(stateToPass);
    }
  };

  const proceedToTransfer = (stateToPass: any) => {
    if (stateToPass.transferOffer) {
      setTransferOffer(stateToPass.transferOffer);
      setPendingSimulationPhase(stateToPass);
    } else {
      checkRenewalOrFinish(stateToPass);
    }
  };

  const checkRenewalOrFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (p.isPro && p.contractYears === 0 && !p.retired) {
      // Fim de contrato: em vez de oferecer apenas a renovação com o time
      // atual, o jogador recebe de 1 a 5 propostas de clubes, dependendo
      // dos prêmios individuais conquistados na carreira e do OVR atual.
      const currentOvr = calculateOverall(p.attributes, p.position);
      const offers = getContractEndOffers(p, currentOvr);
      setPendingContractOffers(offers);
      setPendingSimulationPhase(stateToPass);
    } else {
      checkPartyOrFinish(stateToPass);
    }
  };

  const handleSelectContractOffer = (team: Team) => {
    if (!pendingSimulationPhase) return;
    const currentTeamId = pendingSimulationPhase.baseUpdatedPlayer.currentTeam.id;
    setPendingContractOffers(null);
    setPendingContractNegotiation({
      type: team.id === currentTeamId ? "RENEWAL" : "TRANSFER",
      team,
    });
  };

  const [pendingParty, setPendingParty] = useState<{ cost: number } | null>(null);

  const checkPartyOrFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if ((p.assets.includes("Casa") || p.assets.includes("Mansão")) && !p.retired && p.money >= 450000) {
      if (Math.random() <= 0.1) {
        const cost = Math.floor(Math.random() * (900000 - 450000 + 1)) + 450000;
        if (p.money >= cost) {
          setPendingParty({ cost });
          setPendingSimulationPhase(stateToPass);
          return;
        }
      }
    }
    checkRomanceEventOrNext(stateToPass);
  };

  const handlePartyDecision = (accept: boolean) => {
    if (!pendingSimulationPhase || !pendingParty) return;

    const stateToPass = { ...pendingSimulationPhase };
    const p = stateToPass.baseUpdatedPlayer;

    if (accept) {
      p.money -= pendingParty.cost;
      p.personal.mood = Math.min(100, p.personal.mood + 30);
      p.personal.social = Math.min(100, p.personal.social + 15);
      p.personal.health = Math.max(0, p.personal.health - 10);
      if (p.history.length > 0) {
        p.history[0].pressMessage = `"Festa do ano! ${p.name} organiza evento milionário e vira assunto no mundo todo!"`;
      }
    }

    setPendingParty(null);
    checkRomanceEventOrNext(stateToPass);
  };

  const [pendingRomanceEvent, setPendingRomanceEvent] = useState<RomanceEvent | null>(null);
  const [pendingRomanceResult, setPendingRomanceResult] = useState<{ success: boolean, personName: string } | null>(null);
  const [pendingFriendEvent, setPendingFriendEvent] = useState<Friend | null>(null);

  // Quanto maior o Social do jogador, mais comum é surgir um evento de
  // romance na temporada — com Social em 100%, o evento acontece sempre.
  // Quando o encontro rola mas o Social ainda é baixo, em vez do evento
  // completo (com escolhas) aparece só um aviso de que não houve interesse.
  const checkRomanceEventOrNext = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (!p.retired) {
      if (p.age >= 14 && p.age <= 16 && !p.hadFirstKiss && !p.relationships.girlfriend) {
        p.hadFirstKiss = true;
        setPendingRomanceEvent(generateRomanceEvent(p, true));
        setPendingSimulationPhase(stateToPass);
        return;
      }

      const social = p.personal.social;
      const eventChance = Math.min(100, Math.max(15, social));

      if (Math.random() * 100 < eventChance) {
        if (Math.random() > 0.5) {
          if (social >= ROMANCE_INTEREST_THRESHOLD) {
            setPendingRomanceEvent(generateRomanceEvent(p));
            setPendingSimulationPhase(stateToPass);
            return;
          }
        } else {
          setPendingFriendEvent(generateFriend(p.nationality, p.age));
          setPendingSimulationPhase(stateToPass);
          return;
        }
      }
    }
    checkSponsorOrFinish(stateToPass);
  };

  const handleFriendChoice = (accept: boolean) => {
    if (!pendingSimulationPhase || !pendingFriendEvent) return;
    
    const stateToPass = { ...pendingSimulationPhase };
    const p = stateToPass.baseUpdatedPlayer;

    if (accept) {
      p.relationships.friends = [...p.relationships.friends, pendingFriendEvent];
      p.personal.social = Math.min(100, p.personal.social + 10);
      p.personal.mood = Math.min(100, p.personal.mood + 5);
      if (p.history.length > 0) {
         p.history[0].pressMessage = `"Nova amizade! ${p.name} é visto com ${pendingFriendEvent.name} e aumenta seu círculo social."`;
      }
    }

    setPendingFriendEvent(null);
    checkSponsorOrFinish(stateToPass);
  };

  const handleRomanceChoice = (choiceId: string) => {
    if (!pendingSimulationPhase || !pendingRomanceEvent) return;

    const stateToPass = { ...pendingSimulationPhase };
    const p = stateToPass.baseUpdatedPlayer;
    const event = pendingRomanceEvent;
    const choice = event.choices.find((c) => c.id === choiceId);

    if (choice) {
      switch (choice.tone) {
        case "safe":
          p.personal.social = Math.min(100, p.personal.social + 5);
          p.personal.mood = Math.min(100, p.personal.mood + 5);
          if (!p.relationships.girlfriend && !p.relationships.friends.some(f => f.name === event.personName)) {
            p.relationships = {
              ...p.relationships,
              friends: [
                ...p.relationships.friends,
                { id: `friend_${Date.now()}`, name: event.personName, relationTag: "Amiga", affinity: event.attraction, age: event.age, occupation: event.occupation, avatarUrl: event.avatarUrl },
              ],
            };
          }
          break;
        case "positive": {
          p.personal.social = Math.min(100, p.personal.social + 10);
          p.personal.mood = Math.min(100, p.personal.mood + 5);
          if (!p.relationships.girlfriend && Math.random() < 0.5) {
            // A escolha "positiva" pode evoluir para um namoro de verdade.
            p.relationships = {
              ...p.relationships,
              girlfriend: {
                id: `gf_${Date.now()}`,
                name: event.personName,
                relationTag: "Namorada",
                affinity: event.attraction,
                sinceAge: p.age,
                age: event.age,
                occupation: event.occupation,
                avatarUrl: event.avatarUrl
              },
            };
            if (p.history.length > 0) {
              p.history[0].pressMessage = `"Romance confirmado! ${p.name} está namorando ${event.personName}."`;
            }
            setPendingRomanceEvent(null);
            setPendingSimulationPhase(stateToPass);
            setPendingRomanceResult({ success: true, personName: event.personName });
            return;
          } else if (!p.relationships.girlfriend) {
            // Não virou namoro dessa vez, mas rende uma nova amizade.
            p.relationships = {
              ...p.relationships,
              friends: [
                ...p.relationships.friends,
                { id: `friend_${Date.now()}`, name: event.personName, relationTag: event.relationTag, affinity: event.attraction, age: event.age, occupation: event.occupation, avatarUrl: event.avatarUrl },
              ],
            };
            p.personal.mood = Math.max(0, p.personal.mood - 10);
            setPendingRomanceEvent(null);
            setPendingSimulationPhase(stateToPass);
            setPendingRomanceResult({ success: false, personName: event.personName });
            return;
          }
          break;
        }
        case "risky":
          p.personal.mood = Math.min(100, p.personal.mood + 10);
          p.personal.social = Math.max(0, p.personal.social - 15);
          p.personal.health = Math.max(0, p.personal.health - 5);

          if (p.relationships.girlfriend) {
            const exGirlfriendName = p.relationships.girlfriend.name;
            p.relationships = { ...p.relationships, girlfriend: null };
            if (p.history.length > 0) {
              p.history[0].pressMessage = `"Escândalo! ${p.name} é flagrado em um affair e o namoro com ${exGirlfriendName} chega ao fim."`;
            }
          } else if (p.history.length > 0) {
            p.history[0].pressMessage = `"Escândalo! ${p.name} é flagrado em um affair e vira manchete da imprensa marrom."`;
          }
          break;
        default:
          p.personal.mood = Math.min(100, p.personal.mood + 2);
          break;
      }
    }

    setPendingRomanceEvent(null);
    checkSponsorOrFinish(stateToPass);
  };

  const handleRomanceResultContinue = () => {
    if (!pendingSimulationPhase) return;
    const stateToPass = { ...pendingSimulationPhase };
    setPendingRomanceResult(null);
    checkSponsorOrFinish(stateToPass);
  };

  const MAINTENANCE_COSTS: Record<string, number> = {
    "Casa": 40000,
    "Mansão": 100000,
    "Carro de Luxo": 50000,
    "Jetski": 5000,
    "Iate": 600000,
    "Avião Particular": 1000000,
    "Ilha Privativa": 2000000,
    "Cavalo de Raça": 50000,
    "Helicóptero": 80000
  };

  const [pendingSocialEvent, setPendingSocialEvent] = useState<any>(null);

  const [pendingSponsorChoice, setPendingSponsorChoice] = useState<boolean>(false);

  const checkSponsorOrFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (p.isPro && !p.bootSponsor && !p.retired) {
      setPendingSponsorChoice(true);
      setPendingSimulationPhase(stateToPass);
      return;
    }
    applyMaintenanceAndFinish(stateToPass);
  };

  const handleSocialDecision = (accept: boolean) => {
    if (!pendingSimulationPhase || !pendingSocialEvent) return;

    const stateToPass = { ...pendingSimulationPhase };
    const p = stateToPass.baseUpdatedPlayer;

    if (accept) {
      p.money -= pendingSocialEvent.cost;
      p.personal.mood = Math.min(100, p.personal.mood + 20);
      p.personal.social = Math.min(100, p.personal.social + 5);
      if (p.history.length > 0) {
        p.history[0].pressMessage = `"${pendingSocialEvent.press}"`;
      }
    } else {
      p.personal.social = Math.max(0, p.personal.social - 10);
      p.personal.mood = Math.max(0, p.personal.mood - 10);
    }
    setPendingSocialEvent(null);
    checkSponsorOrFinish(stateToPass);
  };

  const BOOT_SPONSORS = [
    { name: "Penalty", minOvr: 60, pay: 100000 },
    { name: "Umbro", minOvr: 65, pay: 200000 },
    { name: "New Balance", minOvr: 70, pay: 500000 },
    { name: "Puma", minOvr: 75, pay: 1000000 },
    { name: "Adidas", minOvr: 85, pay: 4000000 },
    { name: "Nike", minOvr: 85, pay: 4000000 }
  ];

  const handleSponsorDecision = (sponsorName: string) => {
    if (!pendingSimulationPhase) return;
    const stateToPass = { ...pendingSimulationPhase };
    const p = stateToPass.baseUpdatedPlayer;
    p.bootSponsor = sponsorName;
    p.bootSponsorSeasonsLeft = 5;
    if (p.history.length > 0) {
        p.history[0].pressMessage = `"Novo patrocínio! ${p.name} fecha com a ${sponsorName}!"`;
    }
    setPendingSponsorChoice(false);
    applyMaintenanceAndFinish(stateToPass);
  };

  const applyMaintenanceAndFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    const maintenance = p.assets.reduce((sum: number, asset: string) => sum + (MAINTENANCE_COSTS[asset] || 0), 0);
    p.money -= maintenance;
    if (p.bootSponsor) {
        const sponsorObj = BOOT_SPONSORS.find(s => s.name === p.bootSponsor);
        if (sponsorObj) {
            p.money += sponsorObj.pay;
        }
        p.bootSponsorSeasonsLeft = (p.bootSponsorSeasonsLeft ?? 5) - 1;
        if (p.bootSponsorSeasonsLeft <= 0) {
            // Contrato de chuteira encerrado após 5 temporadas - na próxima
            // temporada o jogador volta a escolher um novo patrocinador.
            p.bootSponsor = null;
            p.bootSponsorSeasonsLeft = undefined;
            if (p.history.length > 0) {
                p.history[0].pressMessage = `"Fim de contrato! O acordo de ${p.name} com a chuteira chegou ao fim."`;
            }
        }
    }
    finishSeason(stateToPass);
  };

  const finishSeason = (stateToPass: any) => {
    let finalPlayer = stateToPass.baseUpdatedPlayer;
    if (finalPlayer.history && finalPlayer.history.length > 0) {
      const currentStat = finalPlayer.history[0];
      if (currentStat.individualAwards?.includes("Artilheiro")) {
        finalPlayer = addMessageToChat(finalPlayer, "treinador", "Parabéns pela artilharia na última temporada! Precisamos desse faro de gol de novo.");
      }
    }
    setPlayer(finalPlayer);

    if (finalPlayer.retired) {
      setScreen("CAREER_SUMMARY");
    }
  };

  const handleAcceptProContract = () => {
    setPendingProContract(false);
    if (pendingSimulationPhase) {
      setPendingContractNegotiation({
        type: "PRO",
        team: pendingSimulationPhase.baseUpdatedPlayer.currentTeam
      });
    }
  };

  const handleRejectProContract = () => {
    setPendingProContract(false);
    if (pendingSimulationPhase) {
      proceedToTransfer(pendingSimulationPhase);
    }
  };

  const handleContinueFromFinals = () => {
    setPendingFinals(null);
    if (pendingSimulationPhase) {
      proceedToProContract(pendingSimulationPhase);
    }
  };

  const handleAcceptTransfer = () => {
    if (pendingSimulationPhase && transferOffer) {
      setPendingContractNegotiation({
        type: "TRANSFER",
        team: transferOffer
      });
      setTransferOffer(null);
    }
  };

  const handleRejectTransfer = () => {
    setTransferOffer(null);
    if (pendingSimulationPhase) {
      checkRenewalOrFinish(pendingSimulationPhase);
    }
  };

  const handleContractSigned = (salary: number, years: number) => {
    if (!pendingSimulationPhase || !pendingContractNegotiation) return;

    const stateToPass = { ...pendingSimulationPhase };
    let p = stateToPass.baseUpdatedPlayer;

    p.salary = salary;
    p.contractYears = years;

    if (pendingContractNegotiation.type === "PRO") {
      p.isPro = true;
      p = addMessageToChat(p, "treinador", "Bem-vindo ao profissional, garoto! Agora o bicho vai pegar, conto com você.");
      stateToPass.baseUpdatedPlayer = p;
      setPendingContractNegotiation(null);
      proceedToTransfer(stateToPass);
    } else if (pendingContractNegotiation.type === "TRANSFER") {
      p.currentTeam = pendingContractNegotiation.team;
      if (p.history.length > 0) {
        p.history[0].pressMessage = `"Novo reforço! ${p.name} assina com o ${p.currentTeam.name}!"`;
      }
      if (p.chats && p.chats["treinador"]) {
        p.chats = { ...p.chats };
        delete p.chats["treinador"];
      }
      p = addMessageToChat(p, "treinador", `Seja bem-vindo ao ${p.currentTeam.name}! Estamos felizes com sua chegada, vamos trabalhar duro.`);
      stateToPass.baseUpdatedPlayer = p;
      setPendingContractNegotiation(null);
      checkRenewalOrFinish(stateToPass);
    } else if (pendingContractNegotiation.type === "RENEWAL") {
      setPendingContractNegotiation(null);
      checkPartyOrFinish(stateToPass);
    }
  };

  const handleRestart = () => {
    resetOpponentMemory();
    setPlayer(null);
    setDraftTeam(null);
    setPlayerName("Você");
    setTransferOffer(null);
    setPendingFinals(null);
    setPendingMentalHealthEvent(null);
    setPendingProContract(false);
    setPendingContractNegotiation(null);
    setPendingContractOffers(null);
    setPendingSimulationPhase(null);
    setShowTraining(false);
    setNationalTeamMsg(false);
    setPendingRomanceEvent(null);
    setScreen("START");
  };

  return (
    <>
      {screen === "START" && <StartScreen onStart={handleStart} />}
      {screen === "CHOOSE_NATIONALITY" && <ChooseNationality onSelect={handleNationalitySelected} />}
      {screen === "CHOOSE_APPEARANCE" && <ChooseAppearance onSelect={handleAppearanceSelected} playerName={playerName} />}
      {screen === "ROULETTE" && <Roulette nationality={playerNationality} onTeamSelected={handleTeamSelected} />}
      {screen === "CHOOSE_POSITION" && <ChoosePosition onPositionSelected={handlePositionSelected} />}
      {screen === "CAREER_SUMMARY" && player && <CareerSummary player={player} onRestart={handleRestart} />}
      {screen === "DASHBOARD" && player && !player.retired && (
        <div className="relative">
          {showTraining && <TrainingModal onTrain={handleTrain} />}

          {pendingMentalHealthEvent && (
            <MentalHealthModal 
              type={pendingMentalHealthEvent.type}
              onContinue={handleContinueFromMentalHealth}
            />
          )}


          
          {currentFinalType && (
            <InteractiveMatchModal 
              player={player} 
              finalType={currentFinalType} 
              onComplete={handleInteractiveFinalComplete} 
            />
          )}

          {pendingFinals && (
            <FinalsModal finals={pendingFinals} onContinue={handleContinueFromFinals} />
          )}

          {pendingProContract && (
            <ProContractModal onAccept={handleAcceptProContract} onReject={handleRejectProContract} />
          )}

          {nationalTeamMsg && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[70] bg-yellow-400 text-slate-950 px-6 py-3 rounded-full font-bold shadow-2xl animate-bounce">
              Você foi convocado para a Seleção Nacional!
            </div>
          )}

          {pendingContractOffers && pendingSimulationPhase && (
            <ContractOffersModal
              offers={pendingContractOffers}
              currentTeamId={pendingSimulationPhase.baseUpdatedPlayer.currentTeam.id}
              onSelect={handleSelectContractOffer}
            />
          )}

          {pendingContractNegotiation && pendingSimulationPhase && (
            <ContractNegotiationModal
              player={pendingSimulationPhase.baseUpdatedPlayer}
              team={pendingContractNegotiation.team}
              type={pendingContractNegotiation.type}
              onComplete={handleContractSigned}
            />
          )}

          {pendingParty && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-3xl font-black text-purple-400">Hora da Festa!</h3>
                <p className="text-slate-300">
                  Você quer dar uma festa épica na sua casa? Vai melhorar muito seu humor e popularidade, mas pode afetar um pouco sua saúde.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left">
                  <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Custo Estimado</span>
                  <span className="text-xl font-black text-emerald-400">€ {(pendingParty.cost / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => handlePartyDecision(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
                  >
                    Recusar
                  </button>
                  <button 
                    onClick={() => handlePartyDecision(true)}
                    className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all"
                  >
                    Dar a Festa!
                  </button>
                </div>
              </div>
            </div>
          )}

          {pendingFriendEvent && (
            <NewFriendModal 
              friend={pendingFriendEvent} 
              onAccept={() => handleFriendChoice(true)} 
              onDecline={() => handleFriendChoice(false)} 
            />
          )}

          {pendingRomanceEvent && (
            <RomanceEventModal event={pendingRomanceEvent} onChoice={handleRomanceChoice} />
          )}

          {pendingRomanceResult && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
                <div className={`w-16 h-16 mx-auto rounded-full ${pendingRomanceResult.success ? 'bg-pink-500/20' : 'bg-slate-800'} flex items-center justify-center`}>
                  {pendingRomanceResult.success ? <Heart className="w-8 h-8 text-pink-500" /> : <HeartCrack className="w-8 h-8 text-slate-500" />}
                </div>
                <div className="space-y-2">
                  <h3 className={`text-2xl font-black ${pendingRomanceResult.success ? 'text-pink-400' : 'text-slate-300'}`}>
                    {pendingRomanceResult.success ? "Novo Relacionamento!" : "Apenas Amigos"}
                  </h3>
                  <p className="text-slate-400">
                    {pendingRomanceResult.success
                      ? `Incrível! As coisas deram certo e você começou a namorar com ${pendingRomanceResult.personName}.`
                      : `Você tentou algo a mais com ${pendingRomanceResult.personName}, mas o sentimento não foi recíproco e vocês decidiram ser apenas amigos.`}
                  </p>
                </div>
                <button
                  onClick={handleRomanceResultContinue}
                  className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold rounded-xl transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {pendingSocialEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-3xl font-black text-blue-400">{pendingSocialEvent.title}</h3>
                <p className="text-slate-300">
                  {pendingSocialEvent.desc}
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left">
                  <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Custo Estimado</span>
                  <span className="text-xl font-black text-emerald-400">€ {(pendingSocialEvent.cost / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => handleSocialDecision(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
                  >
                    Não aceitar
                  </button>
                  <button 
                    onClick={() => handleSocialDecision(true)}
                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
                  >
                    Aceitar Convite!
                  </button>
                </div>
              </div>
            </div>
          )}

          {pendingSponsorChoice && pendingSimulationPhase && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-xl w-full text-center space-y-6">
                <div className="text-5xl mb-4">👟</div>
                <h3 className="text-3xl font-black text-blue-400">Patrocínio de Chuteira</h3>
                <p className="text-slate-300">
                  Você ainda não tem um patrocinador esportivo! Escolha uma marca para assinar. (Marcas maiores exigem maior OVR).
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {BOOT_SPONSORS.map(sponsor => {
                    const currentOvr = calculateOverall(pendingSimulationPhase.baseUpdatedPlayer.attributes, pendingSimulationPhase.baseUpdatedPlayer.position);
                    const canAfford = currentOvr >= sponsor.minOvr;
                    return (
                      <button
                        key={sponsor.name}
                        onClick={() => handleSponsorDecision(sponsor.name)}
                        disabled={!canAfford}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between items-start transition-all ${
                          canAfford ? 'bg-slate-800 border-slate-700 hover:border-blue-500 cursor-pointer hover:bg-slate-700' : 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="w-full flex justify-between">
                          <strong className="block text-slate-100">{sponsor.name}</strong>
                          <span className="text-emerald-400 font-bold text-sm">{formatCurrency(sponsor.pay)}/ano</span>
                        </div>
                        <span className="text-xs text-slate-400 mt-1">OVR Mínimo: {sponsor.minOvr}</span>
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => {
                    setPendingSponsorChoice(false);
                    applyMaintenanceAndFinish(pendingSimulationPhase);
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
                >
                  Continuar sem patrocínio
                </button>
              </div>
            </div>
          )}

          {transferOffer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
                <h3 className="text-3xl font-black text-emerald-400">Proposta Recebida!</h3>
                <p className="text-slate-300 text-lg">
                  O <strong>{transferOffer.name}</strong> ({transferOffer.country}) fez uma proposta oficial para te contratar.
                </p>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleRejectTransfer}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
                  >
                    Recusar
                  </button>
                  <button 
                    onClick={handleAcceptTransfer}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all"
                  >
                    Aceitar
                  </button>
                </div>
              </div>
            </div>
          )}
          <Dashboard player={player} onSimulate={handleSimulate} onUpdatePlayer={setPlayer} />
        </div>
      )}
    </>
  );
}
