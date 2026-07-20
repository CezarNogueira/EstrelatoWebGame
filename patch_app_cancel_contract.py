import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

func_pattern = """  const handleContractSigned = (salary: number, years: number, extras?: { signingBonus: number; releaseClause: number; role: "STARTER" | "COMPETING" | "ROTATION" }) => {"""
new_cancel_func = """  const handleContractCanceled = () => {
    if (!pendingSimulationPhase || !pendingContractNegotiation) return;

    const stateToPass = { ...pendingSimulationPhase };
    let p = stateToPass.baseUpdatedPlayer;

    p.currentTeam = { id: "none", name: "Sem Clube", type: "mixed", level: 0 };
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
      checkRenewalOrFinish(stateToPass);
    } else if (type === "RENEWAL") {
      checkPartyOrFinish(stateToPass);
    }
  };

"""

content = content.replace(func_pattern, new_cancel_func + func_pattern)

modal_pattern = """          {pendingContractNegotiation && pendingSimulationPhase && (
            <ContractNegotiationModal
              player={pendingSimulationPhase.baseUpdatedPlayer}
              team={pendingContractNegotiation.team}
              type={pendingContractNegotiation.type}
              onComplete={handleContractSigned}
            />
          )}"""

new_modal = """          {pendingContractNegotiation && pendingSimulationPhase && (
            <ContractNegotiationModal
              player={pendingSimulationPhase.baseUpdatedPlayer}
              team={pendingContractNegotiation.team}
              type={pendingContractNegotiation.type}
              onComplete={handleContractSigned}
              onCancel={handleContractCanceled}
            />
          )}"""

content = content.replace(modal_pattern, new_modal)

with open('src/App.tsx', 'w') as f:
    f.write(content)
