import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { BallonDorModal }" not in content:
    content = content.replace(
        "import { RomanceEventModal }",
        "import { BallonDorModal } from \"./components/BallonDorModal\";\nimport { RomanceEventModal }"
    )

# Add state
if "const [showBallonDor, setShowBallonDor]" not in content:
    content = content.replace(
        "const [pendingProContract, setPendingProContract] = useState<{offer: boolean, team: Team} | null>(null);",
        "const [pendingProContract, setPendingProContract] = useState<{offer: boolean, team: Team} | null>(null);\n  const [showBallonDor, setShowBallonDor] = useState(false);"
    )

# Modify checkSponsorOrFinish to show Ballon Dor if candidate
logic = """
  const checkSponsorOrFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (stateToPass.seasonStat && stateToPass.seasonStat.ballonDorCandidates && stateToPass.seasonStat.ballonDorCandidates.length > 0) {
       setShowBallonDor(true);
    } else {
       if (p.bootSponsor && p.bootSponsorSeasonsLeft !== undefined) {
         if (p.bootSponsorSeasonsLeft <= 0) {
           p.bootSponsor = null;
         }
       }
       finishSimulation(stateToPass);
    }
  };
  
  const handleBallonDorClose = () => {
     setShowBallonDor(false);
     if (pendingSimulationPhase) {
        const p = pendingSimulationPhase.baseUpdatedPlayer;
        if (p.bootSponsor && p.bootSponsorSeasonsLeft !== undefined) {
          if (p.bootSponsorSeasonsLeft <= 0) {
            p.bootSponsor = null;
          }
        }
        finishSimulation(pendingSimulationPhase);
     }
  };
"""

content = re.sub(r'const checkSponsorOrFinish = \(stateToPass: any\) => \{[\s\S]*?finishSimulation\(stateToPass\);\n  \};', logic.strip(), content)

# Add component UI
ui = """
          )}
          
          {showBallonDor && pendingSimulationPhase && (
            <BallonDorModal
              player={pendingSimulationPhase.baseUpdatedPlayer}
              seasonStat={pendingSimulationPhase.seasonStat}
              onClose={handleBallonDorClose}
            />
          )}

          {pendingMentalHealthEvent && (
"""
content = content.replace("          )}\n\n          {pendingMentalHealthEvent && (", ui)

with open('src/App.tsx', 'w') as f:
    f.write(content)

