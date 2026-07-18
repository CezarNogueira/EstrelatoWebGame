import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r'retired: player\.age >= 38 \|\| \(player\.age >= 34 && Math\.random\(\) > 0\.7\),',
    r'retired: player.age >= 56,',
    content
)

with open('src/utils.ts', 'w') as f:
    f.write(content)

