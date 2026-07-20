import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_func = """  const handleContractCanceled = () => {
    if (!pendingSimulationPhase || !pendingContractNegotiation) return;

    const stateToPass = { ...pendingSimulationPhase };
    let p = stateToPass.baseUpdatedPlayer;

    p.currentTeam = { id: "none", name: "Sem Clube", level: 0, country: "BR" };
    p.contractYears = 0;
    p.salary = 0;
    p.squadRole = "ROTATION";
    if (p.history.length > 0) {
      p.history[0].pressMessage = `"${p.name} não chega a um acordo e fica sem clube!"`;
    }
    
    if (pendingContractNegotiation.type === "PRO") {
      p.isPro = true;
    }

    stateToPass.baseUpdatedPlayer = p;
    
    const type = pendingContractNegotiation.type;
    setPendingContractNegotiation(null);

    if (type === "PRO") {
      proceedToTransfer(stateToPass);
    } else if (type === "TRANSFER") {
      checkPartyOrFinish(stateToPass);
    } else if (type === "RENEWAL") {
      checkPartyOrFinish(stateToPass);
    }
  };"""

new_func = """  const handleContractCanceled = () => {
    if (!pendingSimulationPhase || !pendingContractNegotiation) return;

    const stateToPass = { ...pendingSimulationPhase };
    let p = stateToPass.baseUpdatedPlayer;
    const type = pendingContractNegotiation.type;
    let wasMidSeasonTransfer = false;

    if (type === "TRANSFER" && p.contractYears > 0 && p.currentTeam.id !== "none") {
      wasMidSeasonTransfer = true;
      if (p.history.length > 0) {
        p.history[0].pressMessage = `"${p.name} recusa proposta e decide permanecer no ${p.currentTeam.name}!"`;
      }
    } else {
      p.currentTeam = { id: "none", name: "Sem Clube", level: 0, country: "BR" };
      p.contractYears = 0;
      p.salary = 0;
      p.squadRole = "ROTATION";
      if (p.history.length > 0) {
        p.history[0].pressMessage = `"${p.name} não chega a um acordo e fica sem clube!"`;
      }
    }
    
    if (type === "PRO") {
      p.isPro = true;
    }

    stateToPass.baseUpdatedPlayer = p;
    setPendingContractNegotiation(null);

    if (type === "PRO") {
      proceedToTransfer(stateToPass);
    } else if (wasMidSeasonTransfer) {
      checkRenewalOrFinish(stateToPass);
    } else {
      checkPartyOrFinish(stateToPass);
    }
  };"""

content = content.replace(old_func, new_func)

with open('src/App.tsx', 'w') as f:
    f.write(content)
