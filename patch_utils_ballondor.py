import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

# Add candidates to SeasonStat in types if not there
with open('src/types.ts', 'r') as f:
    types_content = f.read()
if "ballonDorCandidates?: any[];" not in types_content:
    types_content = types_content.replace(
        "individualAwards?: string[];",
        "individualAwards?: string[];\n  ballonDorCandidates?: any[];"
    )
    with open('src/types.ts', 'w') as f:
        f.write(types_content)

# Update simulateSeason
simulate_func = """
    if (wonBallonDor) {
      individualAwards.push("Bola de Ouro");
    }
"""

replacement = """
    // Gerar ranking da Bola de Ouro se o jogador for candidato (top 5 ou se ganhou)
    // OVR alto, gols, assistências, prêmios, etc.
    let isCandidate = wonBallonDor;
    if (!wonBallonDor && currentOvr >= 85) {
        if (goals + assists >= 25 || cleanSheetRateThisSeason >= 0.4) {
            isCandidate = Math.random() > 0.4; // 60% chance de ser candidato
        }
    }

    if (isCandidate) {
        const competitors = [
            { name: "Vinícius Júnior", club: "Real Madrid", country: "Brasil", ovr: 92, score: 95 },
            { name: "Kylian Mbappé", club: "Real Madrid", country: "França", ovr: 93, score: 94 },
            { name: "Erling Haaland", club: "Manchester City", country: "Noruega", ovr: 92, score: 93 },
            { name: "Jude Bellingham", club: "Real Madrid", country: "Inglaterra", ovr: 91, score: 90 },
            { name: "Harry Kane", club: "Bayern München", country: "Inglaterra", ovr: 91, score: 88 },
            { name: "Phil Foden", club: "Manchester City", country: "Inglaterra", ovr: 89, score: 86 },
            { name: "Rodri", club: "Manchester City", country: "Espanha", ovr: 90, score: 87 },
            { name: "Bukayo Saka", club: "Arsenal", country: "Inglaterra", ovr: 88, score: 84 },
            { name: "Lamine Yamal", club: "Barcelona", country: "Espanha", ovr: 86, score: 82 },
            { name: "Florian Wirtz", club: "Bayer Leverkusen", country: "Alemanha", ovr: 88, score: 85 }
        ];
        
        // Shuffle and pick 4
        let shuffled = competitors.sort(() => 0.5 - Math.random());
        let top4 = shuffled.slice(0, 4).map(c => ({...c, chance: Math.floor(Math.random() * 20) + 10}));
        
        // Calcular score do player
        let playerScore = (currentOvr) + (goals * 0.5) + (assists * 0.3) + (wonWC ? 20 : 0) + (wonCL ? 15 : 0) + (wonLeague ? 10 : 0);
        if (player.position === "ZAG" && cleanSheetRateThisSeason >= 0.4) playerScore += (tackles * 0.1);
        
        const myCandidate = {
            name: player.name,
            club: player.currentTeam.name,
            country: player.nationality,
            isMe: true,
            score: playerScore,
            chance: wonBallonDor ? (Math.floor(Math.random() * 30) + 40) : (Math.floor(Math.random() * 20) + 5)
        };
        
        let allCandidates = [...top4, myCandidate];
        
        // Ajustar chances para somar 100% ou perto disso e fazer sentido
        allCandidates.sort((a, b) => b.chance - a.chance);
        
        // Se wonBallonDor, garantir que o player é o #1
        if (wonBallonDor) {
            allCandidates = allCandidates.filter(c => c.name !== player.name);
            allCandidates.unshift(myCandidate);
        } else {
            // Se não ganhou, garantir que o player não está em #1 (ou pelo menos chance menor que o primeiro)
            allCandidates.sort((a, b) => b.chance - a.chance);
            if (allCandidates[0].name === player.name) {
                let temp = allCandidates[0];
                allCandidates[0] = allCandidates[1];
                allCandidates[1] = temp;
                
                // swap chances
                let tempC = allCandidates[0].chance;
                allCandidates[0].chance = allCandidates[1].chance + 10;
                allCandidates[1].chance = tempC;
            }
        }
        
        // recalcular total de chances para ser relativo se quiser, ou só deixar fixo.
        const totalChance = allCandidates.reduce((sum, c) => sum + c.chance, 0);
        allCandidates.forEach(c => {
            c.chance = Math.round((c.chance / totalChance) * 100);
        });

        if (wonBallonDor) {
          individualAwards.push("Bola de Ouro");
        }
        
        seasonStatObj.ballonDorCandidates = allCandidates;
    }
"""

content = content.replace("    if (wonBallonDor) {\n      individualAwards.push(\"Bola de Ouro\");\n    }", replacement)
content = content.replace("  const seasonStat: SeasonStat = {", "  const seasonStatObj: SeasonStat = {")
content = content.replace("  const seasonStat: SeasonStat = {", "  let seasonStatObj: SeasonStat = {")
content = content.replace("    attributeChanges: {}", "    attributeChanges: {}")

# Now change returning seasonStat to seasonStatObj
content = content.replace("return { baseUpdatedPlayer: updatedBase, seasonStat, transfer: null, earnedPoints: 0 };", "return { baseUpdatedPlayer: updatedBase, seasonStat: seasonStatObj, transfer: null, earnedPoints: 0 };")
content = content.replace("return { baseUpdatedPlayer, seasonStat, transfer, earnedPoints, proContractOffer };", "return { baseUpdatedPlayer, seasonStat: seasonStatObj, transfer, earnedPoints, proContractOffer };")


with open('src/utils.ts', 'w') as f:
    f.write(content)

