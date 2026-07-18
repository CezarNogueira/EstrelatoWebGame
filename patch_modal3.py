import re

with open('src/components/InteractiveMatchModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(">{current}</span>;\n}", "")

with open('src/components/InteractiveMatchModal.tsx', 'w') as f:
    f.write(content)
