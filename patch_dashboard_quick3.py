import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# I want to replace the sequence of Phone button and CityMap button with the wrapped version.
pattern = r'(<button[^>]*onClick=\{\(\) => setShowPhone\(true\)\}[^>]*>.*?Celular\s*</button>)\s*\{player\.mode !== "QUICK" && \(\s*(<button[^>]*onClick=\{\(\) => setShowCityMap\(true\)\}[^>]*>.*?Mapa da Cidade\s*</button>)\s*\)\}'

def repl(m):
    return f'{{player.mode !== "QUICK" && (\n                <>\n                  {m.group(1)}\n                  {m.group(2)}\n                </>\n              )}}'

new_content = re.sub(pattern, repl, content, flags=re.DOTALL)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(new_content)
