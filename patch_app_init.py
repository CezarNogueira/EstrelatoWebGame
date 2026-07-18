import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

init_old = """    setPlayer({
      name: playerName,
      avatarUrl: playerAvatar,"""
init_new = """    setPlayer({
      name: playerName,
      mode: gameMode,
      avatarUrl: playerAvatar,"""

content = content.replace(init_old, init_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
