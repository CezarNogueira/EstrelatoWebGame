const fs = require('fs');
let code = fs.readFileSync('src/utils.ts', 'utf8');

// I will manually replace the `if (player.isPro)` logic blocks using string replacement
// Find the exact text from `  let continentalName = "Copa Continental";` to `  if (Math.random() * 100 < teamPower * 0.15) {`

const blockToReplace1 = `  let continentalName = "Copa Continental";
  let clubWCName = "Mundial de Clubes";

  if (player.isPro) {
    const country = player.currentTeam.country;
    if (country === "BR") {
      cupName = "Copa do Brasil";
      leagueName = "Brasileirão";
      continentalName = "Copa Libertadores";
    } else if (country === "EN") {
      cupName = "FA Cup";
      leagueName = "Premier League";
      continentalName = "Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = "La Liga";
      continentalName = "Champions League";
    } else if (country === "DE") {
      cupName = "DFB-Pokal";
      leagueName = "Bundesliga";
      continentalName = "Champions League";
    } else if (country === "FR") {
      cupName = "Coupe de France";
      leagueName = "Ligue 1";
      continentalName = "Champions League";
    } else if (country === "PT") {
      cupName = "Taça de Portugal";
      leagueName = "Primeira Liga";
      continentalName = "Champions League";
    } else if (country === "NL") {
      cupName = "KNVB Cup";
      leagueName = "Eredivisie";
      continentalName = "Champions League";
    } else if (country === "US") {
      cupName = "US Open Cup";
      leagueName = "MLS";
      continentalName = "Copa Libertadores"; // user requested americas
    } else if (country === "SA") {
      cupName = "King\\'s Cup";
      leagueName = "Saudi Pro League";
      continentalName = "AFC Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = "La Liga";
      continentalName = "Champions League";
    } else if (["PT", "NL", "DE"].includes(country)) {
      continentalName = "Champions League";
    }

    if (Math.random() * 100 < teamPower * 0.15) {`;

const newBlock1 = `  let continentalName = "Copa Continental";
  let clubWCName = "Mundial de Clubes";

  if (player.isPro) {
    const country = player.currentTeam.country;
    if (country === "BR") {
      cupName = "Copa do Brasil";
      leagueName = "Brasileirão";
      continentalName = "Copa Libertadores";
    } else if (country === "EN") {
      cupName = "FA Cup";
      leagueName = "Premier League";
      continentalName = "Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = "La Liga";
      continentalName = "Champions League";
    } else if (country === "DE") {
      cupName = "DFB-Pokal";
      leagueName = "Bundesliga";
      continentalName = "Champions League";
    } else if (country === "FR") {
      cupName = "Coupe de France";
      leagueName = "Ligue 1";
      continentalName = "Champions League";
    } else if (country === "PT") {
      cupName = "Taça de Portugal";
      leagueName = "Primeira Liga";
      continentalName = "Champions League";
    } else if (country === "NL") {
      cupName = "KNVB Cup";
      leagueName = "Eredivisie";
      continentalName = "Champions League";
    } else if (country === "US") {
      cupName = "US Open Cup";
      leagueName = "MLS";
      continentalName = "Copa Libertadores";
    } else if (country === "SA") {
      cupName = "King\\'s Cup";
      leagueName = "Saudi Pro League";
      continentalName = "AFC Champions League";
    }

    if (Math.random() * 100 < teamPower * 0.15) {`;

code = code.replace(blockToReplace1, newBlock1);

// Same for the other block which lacked the teamPower line
const blockToReplace2 = `  if (player.isPro) {
    const country = player.currentTeam.country;
    if (country === "BR") {
      cupName = "Copa do Brasil";
      leagueName = "Brasileirão";
      continentalName = "Copa Libertadores";
    } else if (country === "EN") {
      cupName = "FA Cup";
      leagueName = "Premier League";
      continentalName = "Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = "La Liga";
      continentalName = "Champions League";
    } else if (country === "DE") {
      cupName = "DFB-Pokal";
      leagueName = "Bundesliga";
      continentalName = "Champions League";
    } else if (country === "FR") {
      cupName = "Coupe de France";
      leagueName = "Ligue 1";
      continentalName = "Champions League";
    } else if (country === "PT") {
      cupName = "Taça de Portugal";
      leagueName = "Primeira Liga";
      continentalName = "Champions League";
    } else if (country === "NL") {
      cupName = "KNVB Cup";
      leagueName = "Eredivisie";
      continentalName = "Champions League";
    } else if (country === "US") {
      cupName = "US Open Cup";
      leagueName = "MLS";
      continentalName = "Copa Libertadores"; // user requested americas
    } else if (country === "SA") {
      cupName = "King\\'s Cup";
      leagueName = "Saudi Pro League";
      continentalName = "AFC Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = "La Liga";
      continentalName = "Champions League";
    } else if (["PT", "NL", "DE"].includes(country)) {
      continentalName = "Champions League";
    }
  }`;

const newBlock2 = `  if (player.isPro) {
    const country = player.currentTeam.country;
    if (country === "BR") {
      cupName = "Copa do Brasil";
      leagueName = "Brasileirão";
      continentalName = "Copa Libertadores";
    } else if (country === "EN") {
      cupName = "FA Cup";
      leagueName = "Premier League";
      continentalName = "Champions League";
    } else if (country === "IT") {
      cupName = "Coppa Italia";
      leagueName = "Serie A";
      continentalName = "Champions League";
    } else if (country === "ES") {
      cupName = "Copa del Rey";
      leagueName = "La Liga";
      continentalName = "Champions League";
    } else if (country === "DE") {
      cupName = "DFB-Pokal";
      leagueName = "Bundesliga";
      continentalName = "Champions League";
    } else if (country === "FR") {
      cupName = "Coupe de France";
      leagueName = "Ligue 1";
      continentalName = "Champions League";
    } else if (country === "PT") {
      cupName = "Taça de Portugal";
      leagueName = "Primeira Liga";
      continentalName = "Champions League";
    } else if (country === "NL") {
      cupName = "KNVB Cup";
      leagueName = "Eredivisie";
      continentalName = "Champions League";
    } else if (country === "US") {
      cupName = "US Open Cup";
      leagueName = "MLS";
      continentalName = "Copa Libertadores";
    } else if (country === "SA") {
      cupName = "King\\'s Cup";
      leagueName = "Saudi Pro League";
      continentalName = "AFC Champions League";
    }
  }`;

code = code.replace(blockToReplace2, newBlock2);
fs.writeFileSync('src/utils.ts', code);
