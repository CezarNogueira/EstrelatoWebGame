import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

handle_party_code = """
  const handleParty = () => {
    if (player.money >= 15000 && player.personal.health > 15) {
      let updatedPlayer = {
        ...player,
        money: player.money - 15000,
        personal: {
          ...player.personal,
          mood: Math.min(100, player.personal.mood + 20),
          social: Math.min(100, player.personal.social + 20),
          health: Math.max(0, player.personal.health - 15)
        }
      };

      if (updatedPlayer.relationships.girlfriend) {
        updatedPlayer.relationships = {
          ...updatedPlayer.relationships,
          girlfriend: {
            ...updatedPlayer.relationships.girlfriend,
            affinity: 0
          }
        };
        alert(`Sua namorada descobriu que você foi para a balada e discutiu feio com você! A afinidade dela caiu para 0%.`);
      }

      onUpdatePlayer(updatedPlayer);
      setShowNightclub(false);

      if (Math.random() < 0.99) {
          const names = ["Camila", "Sofia", "Isabella", "Giovanna", "Beatriz"];
          const name = names[Math.floor(Math.random() * names.length)];
          const event: RomanceEvent = {
             id: `balada_${Date.now()}`,
             personName: name,
             relationTag: "Conhecida da Balada",
             title: "Noitada Forte!",
             description: `Na área VIP da balada, ${name} se aproximou de você com muito interesse e deixou claro que quer ficar com você.`,
             attraction: 80,
             age: 20,
             choices: [
                { id: "beijar", label: "Beijar", tone: "positive" },
                { id: "fazer-amor", label: "Fazer amor", tone: "positive" },
                { id: "ignorar", label: "Ignorar", tone: "neutral" }
             ]
          };
          onTriggerRomanceEvent?.(event);
      } else {
        if (Math.random() > 0.5) {
          setPendingFriendEvent(generateFriend(player.nationality, player.age));
        }
      }
    }
  };
"""

content = re.sub(r'const handleParty = \(\) => \{[\s\S]*?setShowNightclub\(false\);\n    \}\n  \};', handle_party_code.strip(), content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
