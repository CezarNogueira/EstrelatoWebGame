import re

with open('src/components/InteractiveMatchModal.tsx', 'r') as f:
    content = f.read()

# Add ROLLING_DICE to MatchStatus
content = content.replace(
    'type MatchStatus = "INTRO" | "SIMULATING" | "WAITING_ACTION" | "FINISHED";',
    'type MatchStatus = "INTRO" | "SIMULATING" | "WAITING_ACTION" | "ROLLING_DICE" | "FINISHED";'
)

# We need state for the dice roll
state_to_add = """
  const [resolvingPenalties, setResolvingPenalties] = useState(false);
  const [diceRollInfo, setDiceRollInfo] = useState<{ actionId: string; chance: number; isSuccess: boolean; rollValue: number } | null>(null);
"""
content = content.replace("const [resolvingPenalties, setResolvingPenalties] = useState(false);", state_to_add)

# In handleAction, we shouldn't apply results immediately, but start the dice roll
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
        // Falha defensiva: adversário faz gol.
        setScoreThem(s => s + 1);
        addEvent(config.failText(actionId, player.name, opponentName), "goal_them");
      } else {
        addEvent(config.failText(actionId, player.name, opponentName), "chance");
      }
    }

    if (chancesHad + 1 >= totalChances) {
      // Avança o tempo até o fim da partida se já acabaram as chances
      setMinute(90);
      setStatus("FINISHED");
    } else {
      setStatus("SIMULATING");
    }
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
    
    // Apply result after animation (e.g. 2.5s)
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
          addEvent(config.failText(actionId, player.name, opponentName), "chance");
        }
      }

      setDiceRollInfo(null);
      setChancesHad(currentChancesHad => {
        if (currentChancesHad >= totalChances) {
          setMinute(90);
          setStatus("FINISHED");
        } else {
          setStatus("SIMULATING");
        }
        return currentChancesHad;
      });
    }, 2500);
  };"""
content = content.replace(handle_action_orig, handle_action_new)

# Update buttons to show percentage
buttons_orig = """                {currentActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      className={`p-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${action.classes}`}
                    >
                      <Icon className="w-6 h-6" /> {action.label}
                    </button>
                  );
                })}"""

buttons_new = """                {currentActions.map((action) => {
                  const Icon = action.icon;
                  const difficultyMod = player.currentTeam.level * 5;
                  let chance = SCENARIOS[currentScenario].computeChance(action.id, player, difficultyMod);
                  chance = Math.max(10, Math.min(90, Math.round(chance)));
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      className={`p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${action.classes}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-6 h-6" /> {action.label}
                      </div>
                      <div className="text-sm opacity-90 px-2 py-1 bg-black/30 rounded-lg">
                        {chance}% de Sucesso
                      </div>
                    </button>
                  );
                })}"""
content = content.replace(buttons_orig, buttons_new)

# Add Dice Roller Component UI in ROLLING_DICE state
dice_ui = """
          {status === "ROLLING_DICE" && diceRollInfo && (
            <div className="flex flex-col items-center justify-center p-6 space-y-6 animate-in fade-in duration-300">
              <div className="text-xl font-bold text-slate-300">Sorteando a jogada...</div>
              
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                  style={{ animationDuration: '0.8s' }}
                ></div>
                
                <div className="text-4xl font-black z-10 flex flex-col items-center">
                  <span className="text-slate-200">
                     <span className="text-xs text-slate-400 absolute -top-8 -ml-8">Roll</span>
                     <AnimatedNumber target={diceRollInfo.rollValue} />
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-800/80 border border-slate-700 px-6 py-4 rounded-2xl text-center w-full max-w-sm">
                <div className="text-sm text-slate-400 mb-1">Chance de Sucesso</div>
                <div className="text-2xl font-bold text-emerald-400">{diceRollInfo.chance}%</div>
                <div className="text-xs text-slate-500 mt-2">Valores {diceRollInfo.chance} ou menores têm sucesso.</div>
              </div>
            </div>
          )}
"""
content = content.replace('{status === "SIMULATING" && (', dice_ui + '\n          {status === "SIMULATING" && (')

with open('src/components/InteractiveMatchModal.tsx', 'w') as f:
    f.write(content)

