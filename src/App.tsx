import { useState } from "react";
import { Attributes, FinalResult, Player, Position, SeasonStat, Team } from "./types";
import { StartScreen } from "./components/StartScreen";
import { ChooseNationality } from "./components/ChooseNationality";
import { Roulette } from "./components/Roulette";
import { ChoosePosition } from "./components/ChoosePosition";
import { Dashboard } from "./components/Dashboard";
import { TrainingModal } from "./components/TrainingModal";
import { FinalsModal } from "./components/FinalsModal";
import { ProContractModal } from "./components/ProContractModal";
import { CareerSummary } from "./components/CareerSummary";
import { ContractNegotiationModal } from "./components/ContractNegotiationModal";
import { InteractiveMatchModal, resetOpponentMemory } from "./components/InteractiveMatchModal";
import { simulateSeason, applyGrowth, autoDistributePoints, generatePressMessage, calculateMarketValue, calculateOverall, formatCurrency, getReachedFinals } from "./utils";

type Screen = "START" | "CHOOSE_NATIONALITY" | "ROULETTE" | "CHOOSE_POSITION" | "DASHBOARD" | "CAREER_SUMMARY";

export default function App() {
  const [screen, setScreen] = useState<Screen>("START");
  const [player, setPlayer] = useState<Player | null>(null);
  const [draftTeam, setDraftTeam] = useState<Team | null>(null);
  const [playerName, setPlayerName] = useState<string>("Você");
  const [playerNationality, setPlayerNationality] = useState<string>("");

  const handleStart = (name: string) => {
    setPlayerName(name);
    setScreen("CHOOSE_NATIONALITY");
  };

  const handleNationalitySelected = (nationality: string) => {
    setPlayerNationality(nationality);
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
      bootSponsor: null,
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
      setCurrentFinalType(reached[0]);
    } else {
      executeSimulation(trainingBuff, []);
    }
  };

  const handleInteractiveFinalComplete = (won: boolean) => {
    const updatedPlayed = [...playedFinals, { type: currentFinalType!, won }];
    setPlayedFinals(updatedPlayed);

    if (reachedFinalsQueue.length > 1) {
      const newQueue = reachedFinalsQueue.slice(1);
      setReachedFinalsQueue(newQueue);
      setCurrentFinalType(newQueue[0]);
    } else {
      setReachedFinalsQueue([]);
      setCurrentFinalType(null);
      executeSimulation(pendingTrainingBuff, updatedPlayed);
    }
  };

  const executeSimulation = (trainingBuff?: Partial<Attributes>, prePlayedFinals?: {type: string; won: boolean}[]) => {
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

    if (finalStat.finals && finalStat.finals.length > 0) {
      setPendingFinals(finalStat.finals);
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
      setPendingContractNegotiation({
        type: "RENEWAL",
        team: p.currentTeam,
      });
      setPendingSimulationPhase(stateToPass);
    } else {
      checkPartyOrFinish(stateToPass);
    }
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
    checkSocialEventOrFinish(stateToPass);
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
    checkSocialEventOrFinish(stateToPass);
  };

  const MAINTENANCE_COSTS: Record<string, number> = {
    "Casa": 40000,
    "Mansão": 100000,
    "Carro de Luxo": 50000,
    "Jetski": 5000,
    "Iate": 600000,
    "Avião Particular": 1000000,
    "Ilha Privativa": 20000000,
    "Cavalo de Raça": 50000,
    "Helicóptero": 80000
  };

  const SOCIAL_EVENTS = [
    {
      title: "Encontro Romântico!",
      desc: "Uma super modelo te chamou para jantar no restaurante mais caro de Paris. O que você faz?",
      cost: 50000,
      press: "Romance no ar! Jogador é visto com estrela em Paris!"
    },
    {
      title: "Viagem com Amigos",
      desc: "Seus amigos antigos da cidade natal querem ir pra Ibiza. Vai bancar tudo?",
      cost: 150000,
      press: "O rei de Ibiza! Jogador e amigos esbanjam nas férias."
    },
    {
      title: "Evento Beneficente VIP",
      desc: "Você foi convidado para um gala de caridade com as maiores celebridades do mundo, pedem uma grande doação.",
      cost: 100000,
      press: "Coração de ouro! Jogador doa fortuna em evento VIP."
    }
  ];

  const [pendingSocialEvent, setPendingSocialEvent] = useState<any>(null);

  const [pendingSponsorChoice, setPendingSponsorChoice] = useState<boolean>(false);

  const checkSocialEventOrFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (p.personal.social >= 70 && !p.retired) {
      if (Math.random() <= 0.4) { // 40% chance of a social event
        const evt = SOCIAL_EVENTS[Math.floor(Math.random() * SOCIAL_EVENTS.length)];
        if (p.money >= evt.cost) {
          setPendingSocialEvent(evt);
          setPendingSimulationPhase(stateToPass);
          return;
        }
      }
    }
    checkSponsorOrFinish(stateToPass);
  };

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
    { name: "Adidas", minOvr: 85, pay: 2000000 },
    { name: "Nike", minOvr: 85, pay: 3000000 }
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
    const finalPlayer = stateToPass.baseUpdatedPlayer;
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
    const p = stateToPass.baseUpdatedPlayer;

    p.salary = salary;
    p.contractYears = years;

    if (pendingContractNegotiation.type === "PRO") {
      p.isPro = true;
      setPendingContractNegotiation(null);
      proceedToTransfer(stateToPass);
    } else if (pendingContractNegotiation.type === "TRANSFER") {
      p.currentTeam = pendingContractNegotiation.team;
      if (p.history.length > 0) {
        p.history[0].pressMessage = `"Novo reforço! ${p.name} assina com o ${p.currentTeam.name}!"`;
      }
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
    setPendingProContract(false);
    setPendingContractNegotiation(null);
    setPendingSimulationPhase(null);
    setShowTraining(false);
    setNationalTeamMsg(false);
    setScreen("START");
  };

  return (
    <>
      {screen === "START" && <StartScreen onStart={handleStart} />}
      {screen === "CHOOSE_NATIONALITY" && <ChooseNationality onSelect={handleNationalitySelected} />}
      {screen === "ROULETTE" && <Roulette nationality={playerNationality} onTeamSelected={handleTeamSelected} />}
      {screen === "CHOOSE_POSITION" && <ChoosePosition onPositionSelected={handlePositionSelected} />}
      {screen === "CAREER_SUMMARY" && player && <CareerSummary player={player} onRestart={handleRestart} />}
      {screen === "DASHBOARD" && player && !player.retired && (
        <div className="relative">
          {showTraining && <TrainingModal onTrain={handleTrain} />}
          
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
