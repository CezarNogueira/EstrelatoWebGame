import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

pattern = r'\{player\.mode !== "QUICK" && \(\s*<>\s*(<button[^>]*onClick=\{\(\) => setShowPhone\(true\)\}.*?Celular\s*</button>)\s*(<button[^>]*onClick=\{\(\) => setShowCityMap\(true\)\}.*?Mapa da Cidade\s*</button>)\s*</>\s*\)\}'

def repl(m):
    # Keep Celular button outside
    # Keep CityMap button inside the mode check
    # Also fix the red badge to check player.mode
    celular = m.group(1).replace('{hasUnreadMessages && (', '{hasUnreadMessages && player.mode !== "QUICK" && (')
    citymap = f'{{player.mode !== "QUICK" && (\n                  {m.group(2)}\n              )}}'
    return celular + '\n              ' + citymap

new_content = re.sub(pattern, repl, content, flags=re.DOTALL)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(new_content)
