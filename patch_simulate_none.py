import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

old_logic = """  if (player.currentTeam.id === "none") {
    const stat: SeasonStat = {
      age: player.age,
      team: { id: "none", name: "Sem Clube", level: 0, country: "BR" },
      matches: 0,
      goals: 0,
      assists: 0,
      tackles: 0,
      cleanSheets: 0,
      rating: calculateOverall(player.attributes, player.position),
      attributeChanges: {},
      finals: [],
      pressMessage: `"${player.name} ficou a temporada toda sem clube."`
    };
    return {
      baseUpdatedPlayer: player,
      seasonStat: stat,
      earnedPoints: 0,
    };
  }"""

new_logic = """  if (player.currentTeam.id === "none") {
    const stat: SeasonStat = {
      age: player.age,
      team: { id: "none", name: "Sem Clube", level: 0, country: "BR" },
      matches: 0,
      goals: 0,
      assists: 0,
      tackles: 0,
      cleanSheets: 0,
      rating: calculateOverall(player.attributes, player.position),
      attributeChanges: {},
      finals: [],
      pressMessage: `"${player.name} ficou a temporada toda sem clube."`
    };
    
    const healthDecline = getSeasonHealthDecline(player.age);
    const newHealth = Math.max(0, Math.min(100, player.personal.health - healthDecline));
    
    const baseUpdatedPlayer: Player = {
      ...player,
      age: player.age + 1,
      retired: player.age >= 56,
      contractYears: 0,
      personal: {
        ...player.personal,
        health: newHealth,
        mood: Math.max(0, player.personal.mood - 15),
      }
    };
    
    return {
      baseUpdatedPlayer,
      seasonStat: stat,
      earnedPoints: 0,
    };
  }"""

content = content.replace(old_logic, new_logic)

with open('src/utils.ts', 'w') as f:
    f.write(content)
