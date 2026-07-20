import json

with open('tsconfig.json', 'r') as f:
    config = json.load(f)

if 'exclude' not in config:
    config['exclude'] = []

if 'dist' not in config['exclude']:
    config['exclude'].append('dist')

with open('tsconfig.json', 'w') as f:
    json.dump(config, f, indent=2)
