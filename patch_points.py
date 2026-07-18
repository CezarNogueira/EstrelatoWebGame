import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

points_logic_old = """  // Growth & Decline
  let { points: basePoints, decline } = generateGrowthPoints(player.age);
  
  if (getPlayerTitle(player.age, currentOvr) === "Jovem Promessa") {
    basePoints *= 2;
  }
  
  let finalPoints = 0;
  finals.forEach(f => {
    if (f.won) finalPoints += 4;
  });

  const points = basePoints + finalPoints;"""

points_logic_new = """  // Growth & Decline
  let { points: basePoints, decline } = generateGrowthPoints(player.age);
  
  if (getPlayerTitle(player.age, currentOvr) === "Jovem Promessa") {
    basePoints *= 2;
  }
  
  let finalPoints = 0;
  
  const artilheiroCount = individualAwards.filter(a => a.includes("Artilheiro")).length;
  finalPoints += artilheiroCount * 10;
  
  const muralhaCount = individualAwards.filter(a => a.includes("Muralha")).length;
  finalPoints += muralhaCount * 5;
  
  const chuteiraCount = individualAwards.filter(a => a.includes("Chuteira de Ouro")).length;
  finalPoints += chuteiraCount * 5;

  let wonWC = false;
  let wonCL = false;

  finals.forEach(f => {
    if (f.won) {
      finalPoints += 8; // Campeão
      if (f.type === "Copa do Mundo") wonWC = true;
      if (f.type === "Champions League") wonCL = true;
    }
  });

  if (player.isPro && leaguePosition === 1) {
    finalPoints += 8; // Campeão da liga
  }

  let points = basePoints + finalPoints;

  if (wonWC) {
    points = Math.round(points * 1.5);
  }
  if (wonCL) {
    points = Math.round(points * 1.4);
  }"""

if points_logic_old in content:
    content = content.replace(points_logic_old, points_logic_new)
    with open('src/utils.ts', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find the old block to patch.")
