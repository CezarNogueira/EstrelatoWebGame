import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Remove the existing {player.mode !== "QUICK" && ( ... )} around MapPin
# Then wrap both Phone and MapPin in one {player.mode !== "QUICK" && ( <> ... </> )}

start_idx = content.find('<button\n                onClick={() => setShowPhone(true)}')
if start_idx != -1:
    end_idx = content.find('Mapa da Cidade\n                </button>\n              )}', start_idx)
    if end_idx != -1:
        end_idx += len('Mapa da Cidade\n                </button>\n              )}')
        
        block = content[start_idx:end_idx]
        
        new_block = block.replace('{player.mode !== "QUICK" && (\n', '')
        new_block = new_block.replace('              )}', '')
        
        new_block = '{player.mode !== "QUICK" && (\n                <>\n                  ' + new_block.replace('\n', '\n  ') + '\n                </>\n              )}'
        
        content = content[:start_idx] + new_block + content[end_idx:]

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
