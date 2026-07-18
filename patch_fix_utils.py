import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

# Declare ballonDorCandidates
content = content.replace(
    "const individualAwards: string[] = [];",
    "const individualAwards: string[] = [];\n  let ballonDorCandidates: any[] = [];"
)

# Assign to ballonDorCandidates
content = content.replace(
    "seasonStatObj.ballonDorCandidates = allCandidates;",
    "ballonDorCandidates = allCandidates;"
)

# Assign to object
content = content.replace(
    "individualAwards,",
    "individualAwards,\n    ballonDorCandidates,"
)

with open('src/utils.ts', 'w') as f:
    f.write(content)
