import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"', 'className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] p-4"')

with open('src/App.tsx', 'w') as f:
    f.write(content)
