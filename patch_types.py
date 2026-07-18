import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace("export type Player = {\n  name: string;", "export type Player = {\n  name: string;\n  mode?: \"STORY\" | \"QUICK\";")

with open('src/types.ts', 'w') as f:
    f.write(content)
