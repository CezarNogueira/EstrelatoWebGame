import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add imports
imports = """import { BallonDorModal } from "./components/BallonDorModal";
import { ChuteiraModal } from "./components/ChuteiraModal";
import { MuralhaModal } from "./components/MuralhaModal";"""

content = content.replace('import { BallonDorModal } from "./components/BallonDorModal";', imports)

# Add states
states = """  const [pendingBallonDor, setPendingBallonDor] = useState<any>(null);
  const [pendingChuteira, setPendingChuteira] = useState<any>(null);
  const [pendingMuralha, setPendingMuralha] = useState<any>(null);"""

content = content.replace('  const [pendingBallonDor, setPendingBallonDor] = useState<any>(null);', states)

# Update checkBallonDorOrFinish and add new checks
checks = """  const checkBallonDorOrFinish = (stateToPass: any) => {
    const stat = stateToPass.seasonStat;
    if (stat && stat.ballonDorCandidates && stat.ballonDorCandidates.length > 0) {
      setPendingBallonDor(stateToPass);
      return;
    }
    checkChuteiraOrFinish(stateToPass);
  };

  const handleBallonDorClose = () => {
    if (pendingBallonDor) {
      const stateToPass = { ...pendingBallonDor };
      setPendingBallonDor(null);
      checkChuteiraOrFinish(stateToPass);
    }
  };

  const checkChuteiraOrFinish = (stateToPass: any) => {
    const stat = stateToPass.seasonStat;
    // Chuteira de Ouro check
    if (stat && stat.individualAwards && stat.individualAwards.includes("Chuteira de Ouro")) {
      setPendingChuteira(stateToPass);
      return;
    }
    checkMuralhaOrFinish(stateToPass);
  };

  const handleChuteiraClose = () => {
    if (pendingChuteira) {
      const stateToPass = { ...pendingChuteira };
      setPendingChuteira(null);
      checkMuralhaOrFinish(stateToPass);
    }
  };

  const checkMuralhaOrFinish = (stateToPass: any) => {
    const stat = stateToPass.seasonStat;
    // Muralha da Temporada check
    if (stat && stat.individualAwards && (stat.individualAwards.includes("Muralha da Temporada") || stat.individualAwards.includes("Muralha da Base"))) {
      setPendingMuralha(stateToPass);
      return;
    }
    applyMaintenanceAndFinish(stateToPass);
  };

  const handleMuralhaClose = () => {
    if (pendingMuralha) {
      const stateToPass = { ...pendingMuralha };
      setPendingMuralha(null);
      applyMaintenanceAndFinish(stateToPass);
    }
  };"""

old_checks = """  const checkBallonDorOrFinish = (stateToPass: any) => {
    const stat = stateToPass.seasonStat;
    if (stat && stat.ballonDorCandidates && stat.ballonDorCandidates.length > 0) {
      setPendingBallonDor(stateToPass);
      return;
    }
    applyMaintenanceAndFinish(stateToPass);
  };
  
  const handleBallonDorClose = () => {
    if (pendingBallonDor) {
      applyMaintenanceAndFinish(pendingBallonDor);
      setPendingBallonDor(null);
    }
  };"""

content = content.replace(old_checks, checks)

# Render Modals
modals = """      {pendingBallonDor && (
        <BallonDorModal
          player={pendingBallonDor.baseUpdatedPlayer}
          seasonStat={pendingBallonDor.seasonStat}
          onClose={handleBallonDorClose}
        />
      )}
      
      {pendingChuteira && (
        <ChuteiraModal
          player={pendingChuteira.baseUpdatedPlayer}
          seasonStat={pendingChuteira.seasonStat}
          onClose={handleChuteiraClose}
        />
      )}

      {pendingMuralha && (
        <MuralhaModal
          player={pendingMuralha.baseUpdatedPlayer}
          seasonStat={pendingMuralha.seasonStat}
          onClose={handleMuralhaClose}
        />
      )}"""

old_modals = """      {pendingBallonDor && (
        <BallonDorModal
          player={pendingBallonDor.baseUpdatedPlayer}
          seasonStat={pendingBallonDor.seasonStat}
          onClose={handleBallonDorClose}
        />
      )}"""

content = content.replace(old_modals, modals)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("App.tsx patched")
