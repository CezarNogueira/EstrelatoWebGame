#!/bin/bash
sed -i 's/const handleTempoAction = (tipo: "amor" | "cinema" | "jantar" | "sogra") => {/const handleTempoAction = (tipo: "amor" | "cinema" | "jantar" | "sogra" | "visitar" | "jogar" | "role") => {/g' src/components/RelationshipsModal.tsx

sed -i '/} else if (tipo === "sogra") {/i \
    } else if (tipo === "visitar") {\
      newAffinity += 10;\
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 5);\
      meMessage = "Aparece lá em casa pra gente trocar uma ideia!";\
      response = "Massa! Chego aí mais tarde. 🏠";\
    } else if (tipo === "jogar") {\
      newAffinity += 15;\
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 15);\
      meMessage = "Bora umas partidas online hoje?";\
      response = "Bora! Só não vale chorar quando perder! 🎮";\
    } else if (tipo === "role") {\
      newAffinity += 20;\
      updatedPlayer.personal.mood = Math.min(100, updatedPlayer.personal.mood + 20);\
      updatedPlayer.money -= 500;\
      meMessage = "Vamos dar um rolê hoje? Tô precisando sair um pouco.";\
      response = "Fechado! Vai ser top. 😎";' src/components/RelationshipsModal.tsx
