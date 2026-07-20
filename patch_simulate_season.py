import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

# I want to add a check for "none" team ID at the beginning of simulateSeason.
pattern = r'(export const simulateSeason = \([\s\S]*?\): \{ baseUpdatedPlayer: Player; seasonStat: SeasonStat; transfer\?: Team; earnedPoints: number; proContractOffer\?: boolean \} => \{)'
def repl(m):
    return m.group(1) + """
  if (player.currentTeam.id === "none") {
    const stat: SeasonStat = {
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
    };
    return {
      baseUpdatedPlayer: player,
      seasonStat: stat,
      earnedPoints: 0,
    };
  }
"""

content = re.sub(pattern, repl, content)

# Now, we should also fix the logic for STARTER playing all games regardless of OVR
# Find the isBenched logic
isBenchedOld = """  let isBenched = false;
  if (player.isPro) {
    const minOvrForStarter: Record<number, number> = {
      1: 64,
      2: 71,
      3: 78,
      4: 83,
      5: 88
    };
    const teamLvl = player.currentTeam.level;
    const requiredOvr = minOvrForStarter[teamLvl] || 64;

    if (currentOvr < requiredOvr) {
      isBenched = true;
      matches = Math.round(matches * 0.25);
      performanceRatio = performanceRatio * 0.8;
    }
  }"""

isBenchedNew = """  let isBenched = false;
  if (player.isPro) {
    const minOvrForStarter: Record<number, number> = {
      1: 64,
      2: 71,
      3: 78,
      4: 83,
      5: 88
    };
    const teamLvl = player.currentTeam.level;
    const requiredOvr = minOvrForStarter[teamLvl] || 64;

    if (player.squadRole === "STARTER") {
      isBenched = false; // Always plays
    } else if (currentOvr < requiredOvr) {
      isBenched = true;
      matches = Math.round(matches * 0.25);
      performanceRatio = performanceRatio * 0.8;
    }
  }"""

content = content.replace(isBenchedOld, isBenchedNew)

with open('src/utils.ts', 'w') as f:
    f.write(content)
