import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

mental_old = """  let isolated = false;
  let depressed = false;

  if (player.personal.mood === 0) {
    depressed = true;
    matches = 0;
    performanceRatio = 0;
  } else if (player.personal.mood < 50) {
    isolated = true;
    const moodFactor = player.personal.mood / 50;
    matches = Math.round(matches * moodFactor);
    performanceRatio = performanceRatio * (0.6 + moodFactor * 0.4);
  }"""

mental_new = """  let isolated = false;
  let depressed = false;

  if (player.mode !== "QUICK") {
    if (player.personal.mood === 0) {
      depressed = true;
      matches = 0;
      performanceRatio = 0;
    } else if (player.personal.mood < 50) {
      isolated = true;
      const moodFactor = player.personal.mood / 50;
      matches = Math.round(matches * moodFactor);
      performanceRatio = performanceRatio * (0.6 + moodFactor * 0.4);
    }
  }"""

content = content.replace(mental_old, mental_new)

with open('src/utils.ts', 'w') as f:
    f.write(content)
