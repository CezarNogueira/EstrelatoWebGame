const fs = require('fs');
let code = fs.readFileSync('src/components/InteractiveMatchModal.tsx', 'utf8');

code = code.replace(/INITIAL_TEAMS/g, 'TEAMS');
fs.writeFileSync('src/components/InteractiveMatchModal.tsx', code);
