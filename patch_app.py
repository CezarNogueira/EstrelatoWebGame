import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('onUpdatePlayer={setPlayer}', 'onUpdatePlayer={(p) => { setPlayer(p); if (p.retired) setScreen("CAREER_SUMMARY"); }}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
