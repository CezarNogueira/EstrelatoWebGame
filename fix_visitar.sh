#!/bin/bash
sed -i 's/{(player.assets.includes("Casa") || player.assets.includes("Mansão")) && (/{ (selectedPerson.type === "friend" || player.assets.includes("Casa") || player.assets.includes("Mansão")) \&\& (/g' src/components/RelationshipsModal.tsx
