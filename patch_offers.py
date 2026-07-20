import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

# Find getContractEndOffers
pattern = r'(export const getContractEndOffers = \(player: Player, currentOvr: number\): Team\[\] => \{[\s\S]*?)// O próprio clube sempre aparece na lista - é a opção de renovação\.\s*const offers: Team\[\] = \[player\.currentTeam\];'

def repl(m):
    return m.group(1) + """// O próprio clube sempre aparece na lista - é a opção de renovação.
  // Exceto se o jogador estiver Sem Clube!
  const offers: Team[] = player.currentTeam.id === "none" ? [] : [player.currentTeam];"""

content = re.sub(pattern, repl, content)

with open('src/utils.ts', 'w') as f:
    f.write(content)
