import re

with open('src/components/InteractiveMatchModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "return <span className={`inline-block ${colorClass}`}",
    "return <span className={`inline-block ${colorClass}`}>{current}</span>;\n}"
)

with open('src/components/InteractiveMatchModal.tsx', 'w') as f:
    f.write(content)
