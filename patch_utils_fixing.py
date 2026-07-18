import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

content = content.replace("  let seasonStatObj: SeasonStat = {", "  let seasonStatObj: SeasonStat = {")
content = content.replace("  const seasonStat: SeasonStat = {", "  let seasonStatObj: SeasonStat = {")


with open('src/utils.ts', 'w') as f:
    f.write(content)

