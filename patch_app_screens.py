import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

screens_old = 'type Screen = "START" | "CHOOSE_NATIONALITY" | "CHOOSE_APPEARANCE" | "ROULETTE" | "CHOOSE_POSITION" | "DASHBOARD" | "CAREER_SUMMARY";'
screens_new = 'type Screen = "START" | "CHOOSE_MODE" | "CHOOSE_NATIONALITY" | "CHOOSE_APPEARANCE" | "ROULETTE" | "CHOOSE_POSITION" | "DASHBOARD" | "CAREER_SUMMARY";'
content = content.replace(screens_old, screens_new)

start_old = """  const handleStart = (name: string) => {
    setPlayerName(name);
    setScreen("CHOOSE_NATIONALITY");
  };"""
start_new = """  const [gameMode, setGameMode] = useState<"STORY" | "QUICK">("STORY");

  const handleStart = (name: string) => {
    setPlayerName(name);
    setScreen("CHOOSE_MODE");
  };"""
content = content.replace(start_old, start_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
