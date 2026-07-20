import re

with open('src/types.ts', 'r') as f:
    content = f.read()

if 'squadRole?:' not in content:
    content = content.replace('  contractYears: number;', '  contractYears: number;\n  squadRole?: "STARTER" | "COMPETING" | "ROTATION";')
    with open('src/types.ts', 'w') as f:
        f.write(content)
