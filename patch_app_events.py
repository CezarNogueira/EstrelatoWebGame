import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

party_old = """  const checkPartyOrFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if ((p.assets.includes("Casa") || p.assets.includes("Mansão")) && !p.retired && p.money >= 450000) {"""
party_new = """  const checkPartyOrFinish = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (p.mode === "QUICK") {
      checkSponsorOrFinish(stateToPass);
      return;
    }
    if ((p.assets.includes("Casa") || p.assets.includes("Mansão")) && !p.retired && p.money >= 450000) {"""
content = content.replace(party_old, party_new)

romance_old = """  const checkRomanceEventOrNext = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (!p.retired) {"""
romance_new = """  const checkRomanceEventOrNext = (stateToPass: any) => {
    const p = stateToPass.baseUpdatedPlayer;
    if (p.mode === "QUICK") {
      checkSponsorOrFinish(stateToPass);
      return;
    }
    if (!p.retired) {"""
content = content.replace(romance_old, romance_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
