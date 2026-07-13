const fs = require('fs');
let code = fs.readFileSync('src/utils.ts', 'utf8');

const target = `  const goals = Math.round(randomInt(5, 25) * performanceRatio * (player.attributes.shooting / 50));
  const assists = Math.round(randomInt(2, 15) * performanceRatio * (player.attributes.passing / 50));`;

const replacement = `  const goals = Math.round(randomInt(2, 18) * performanceRatio * (player.attributes.shooting / 50));
  const assists = Math.round(randomInt(1, 10) * performanceRatio * (player.attributes.passing / 50));`;

code = code.split(target).join(replacement);
fs.writeFileSync('src/utils.ts', code);
