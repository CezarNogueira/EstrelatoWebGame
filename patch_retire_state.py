import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add state
old_str = "const [showRelationships, setShowRelationships] = useState(false);"
new_str = "const [showRelationships, setShowRelationships] = useState(false);\n  const [showRetireConfirm, setShowRetireConfirm] = useState(false);"
content = content.replace(old_str, new_str)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
