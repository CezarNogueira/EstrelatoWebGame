const fs = require('fs');
let code = fs.readFileSync('src/utils.ts', 'utf8');

const replaceBlock = (str) => {
    return str.replace(/if \(country === "BR"\) \{[\s\S]*?continentalName = "Champions League";\n    \}/g, `if (country === "BR") {
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
    }`);
};

code = replaceBlock(code);
fs.writeFileSync('src/utils.ts', code);
