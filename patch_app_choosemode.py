import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

import_old = 'import { ChoosePosition } from "./components/ChoosePosition";'
import_new = 'import { ChoosePosition } from "./components/ChoosePosition";\nimport { ChooseMode } from "./components/ChooseMode";'
content = content.replace(import_old, import_new)

render_old = '{screen === "START" && <StartScreen onStart={handleStart} />}\n      {screen === "CHOOSE_NATIONALITY"'
render_new = '{screen === "START" && <StartScreen onStart={handleStart} />}\n      {screen === "CHOOSE_MODE" && <ChooseMode onSelect={handleModeSelected} />}\n      {screen === "CHOOSE_NATIONALITY"'
content = content.replace(render_old, render_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
