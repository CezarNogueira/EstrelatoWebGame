import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

mode_new = """  const handleStart = (name: string) => {
    setPlayerName(name);
    setScreen("CHOOSE_MODE");
  };

  const handleModeSelected = (mode: "STORY" | "QUICK") => {
    setGameMode(mode);
    setScreen("CHOOSE_NATIONALITY");
  };"""

content = content.replace('  const handleStart = (name: string) => {\n    setPlayerName(name);\n    setScreen("CHOOSE_MODE");\n  };', mode_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
