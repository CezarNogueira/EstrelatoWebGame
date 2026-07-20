import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_func = "const handleContractSigned = (salary: number, years: number) => {"
new_func = "const handleContractSigned = (salary: number, years: number, extras?: { signingBonus: number; releaseClause: number; role: \"STARTER\" | \"COMPETING\" | \"ROTATION\" }) => {"

content = content.replace(old_func, new_func)

old_assignments = """    p.salary = salary;
    p.contractYears = years;"""
new_assignments = """    p.salary = salary;
    p.contractYears = years;
    if (extras) {
      p.squadRole = extras.role;
      p.money += extras.signingBonus;
    }"""

content = content.replace(old_assignments, new_assignments)

with open('src/App.tsx', 'w') as f:
    f.write(content)
