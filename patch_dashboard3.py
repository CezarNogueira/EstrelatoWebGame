import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

old_logic = """  let pendingDiscussionEvent: { id: string; name: string; type: "family" | "friend" | "girlfriend" } | null = null;
  const zeroFamily = player.relationships.family.find(f => f.affinity <= 0);
  if (zeroFamily) pendingDiscussionEvent = { id: zeroFamily.id, name: zeroFamily.name, type: "family" };
  else {
    const zeroFriend = player.relationships.friends.find(f => f.affinity <= 0);
    if (zeroFriend) pendingDiscussionEvent = { id: zeroFriend.id, name: zeroFriend.name, type: "friend" };
    else if (player.relationships.girlfriend && player.relationships.girlfriend.affinity <= 0) {
      pendingDiscussionEvent = { id: player.relationships.girlfriend.id, name: player.relationships.girlfriend.name, type: "girlfriend" };
    }
  }"""

new_logic = """  let pendingDiscussionEvent: { id: string; name: string; type: "family" | "friend" | "girlfriend" } | null = null;
  if (player.mode !== "QUICK") {
    const zeroFamily = player.relationships.family.find(f => f.affinity <= 0);
    if (zeroFamily) pendingDiscussionEvent = { id: zeroFamily.id, name: zeroFamily.name, type: "family" };
    else {
      const zeroFriend = player.relationships.friends.find(f => f.affinity <= 0);
      if (zeroFriend) pendingDiscussionEvent = { id: zeroFriend.id, name: zeroFriend.name, type: "friend" };
      else if (player.relationships.girlfriend && player.relationships.girlfriend.affinity <= 0) {
        pendingDiscussionEvent = { id: player.relationships.girlfriend.id, name: player.relationships.girlfriend.name, type: "girlfriend" };
      }
    }
  }"""

content = content.replace(old_logic, new_logic)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
