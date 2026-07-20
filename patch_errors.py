import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace p.currentTeam = { id: "none", name: "Sem Clube", type: "mixed", level: 0 };
content = content.replace('p.currentTeam = { id: "none", name: "Sem Clube", type: "mixed", level: 0 };', 'p.currentTeam = { id: "none", name: "Sem Clube", level: 0, country: "BR" };')

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/utils.ts', 'r') as f:
    content = f.read()

old_stat = """    const stat: SeasonStat = {
      year: player.age,
      team: "Sem Clube",
      matches: 0,
      goals: 0,
      assists: 0,
      tackles: 0,
      cleanSheets: 0,
      ovr: calculateOverall(player.attributes, player.position),
      finals: [],
      leaguePosition: 0,
      leagueName: "",
      pressMessage: `"${player.name} ficou a temporada toda sem clube."`
    };"""

new_stat = """    const stat: SeasonStat = {
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
    };"""

content = content.replace(old_stat, new_stat)

with open('src/utils.ts', 'w') as f:
    f.write(content)
