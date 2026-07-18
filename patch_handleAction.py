import re

with open('src/components/InteractiveMatchModal.tsx', 'r') as f:
    content = f.read()

handle_action_orig = """  const handleAction = (actionId: string) => {
    if (!currentScenario) return;
    setChancesHad(c => c + 1);

    const config = SCENARIOS[currentScenario];
    const difficultyMod = player.currentTeam.level * 5;

    let chance = config.computeChance(actionId, player, difficultyMod);
    chance = Math.max(10, Math.min(90, chance));
    const isSuccess = (Math.random() * 100) <= chance;

    const isDefensiveScenario = DEFENSIVE_SCENARIO_SET.has(currentScenario);

    if (isSuccess) {
      if (isDefensiveScenario) {
        // Sucesso defensivo: evita o gol do adversário, ninguém marca.
        addEvent(config.successText(actionId, player.name, opponentName), "chance");
      } else {
        setScoreUs(s => s + 1);
        const action = config.actions.find(a => a.id === actionId);
        if (action?.resultType === "goal") {
          setMatchGoals(g => g + 1);
        } else if (action?.resultType === "assist") {
          setMatchAssists(a => a + 1);
        }
        addEvent(config.successText(actionId, player.name, opponentName), "goal_us");
      }
    } else {
      if (isDefensiveScenario) {
        // Falha defensiva: o adversário marca o gol.
        setScoreThem(s => s + 1);
        addEvent(config.failText(actionId, player.name, opponentName), "goal_them");
      } else {
        addEvent(config.failText(actionId, player.name, opponentName), "miss");
      }
    }

    setCurrentScenario(null);
    setStatus("SIMULATING");
  };"""

handle_action_new = """  const handleAction = (actionId: string) => {
    if (!currentScenario) return;

    const config = SCENARIOS[currentScenario];
    const difficultyMod = player.currentTeam.level * 5;

    let chance = config.computeChance(actionId, player, difficultyMod);
    chance = Math.max(10, Math.min(90, Math.round(chance)));
    
    // Rola de 1 a 100
    const rollValue = Math.floor(Math.random() * 100) + 1;
    const isSuccess = rollValue <= chance;

    setDiceRollInfo({ actionId, chance, isSuccess, rollValue });
    setStatus("ROLLING_DICE");
    
    // Apply result after animation (e.g. 1.8s)
    setTimeout(() => {
      setChancesHad(c => c + 1);
      const isDefensiveScenario = DEFENSIVE_SCENARIO_SET.has(currentScenario);

      if (isSuccess) {
        if (isDefensiveScenario) {
          addEvent(config.successText(actionId, player.name, opponentName), "chance");
        } else {
          setScoreUs(s => s + 1);
          const action = config.actions.find(a => a.id === actionId);
          if (action?.resultType === "goal") {
            setMatchGoals(g => g + 1);
          } else if (action?.resultType === "assist") {
            setMatchAssists(a => a + 1);
          }
          addEvent(config.successText(actionId, player.name, opponentName), "goal_us");
        }
      } else {
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
    }, 1800);
  };"""

if handle_action_orig in content:
    content = content.replace(handle_action_orig, handle_action_new)
    with open('src/components/InteractiveMatchModal.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")

