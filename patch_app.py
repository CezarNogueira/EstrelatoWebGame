import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add state
if "const [pendingBallonDor, setPendingBallonDor] = useState<any>(null);" not in content:
    content = content.replace(
        "const [pendingSocialEvent, setPendingSocialEvent] = useState<any>(null);",
        "const [pendingSocialEvent, setPendingSocialEvent] = useState<any>(null);\n  const [pendingBallonDor, setPendingBallonDor] = useState<any>(null);"
    )

# Update checkSponsorOrFinish and finishSeason
finish_season_old = """  const checkSponsorOrFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (p.isPro && !p.bootSponsor && !p.retired) {
      setPendingSponsorChoice(true);
      setPendingSimulationPhase(stateToPass);
      return;
    }
    applyMaintenanceAndFinish(stateToPass);
  };"""

finish_season_new = """  const checkSponsorOrFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (p.isPro && !p.bootSponsor && !p.retired) {
      setPendingSponsorChoice(true);
      setPendingSimulationPhase(stateToPass);
      return;
    }
    checkBallonDorOrFinish(stateToPass);
  };

  const checkBallonDorOrFinish = (stateToPass: any) => {
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

content = content.replace(finish_season_old, finish_season_new)

# Also update where the sponsor choice goes next
content = content.replace("applyMaintenanceAndFinish(pendingSimulationPhase);", "checkBallonDorOrFinish(pendingSimulationPhase);")

# Render BallonDorModal
modal_render = """
      {pendingBallonDor && (
        <BallonDorModal
          player={pendingBallonDor.baseUpdatedPlayer}
          seasonStat={pendingBallonDor.seasonStat}
          onClose={handleBallonDorClose}
        />
      )}
"""

content = content.replace("        </div>\n      )}\n\n      {pendingIdol", modal_render + "        </div>\n      )}\n\n      {pendingIdol")

with open('src/App.tsx', 'w') as f:
    f.write(content)
