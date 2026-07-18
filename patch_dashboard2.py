import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('                  Mapa da Cidade\n                </button>\n              )}', '                  Mapa da Cidade\n                </button>\n                </>\n              )}')

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
