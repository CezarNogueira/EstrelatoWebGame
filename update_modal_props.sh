#!/bin/bash
sed -i 's/import { Player } from "..\/types";/import { Player, RomanceEvent } from "..\/types";/' src/components/RelationshipsModal.tsx
sed -i 's/export function RelationshipsModal({ player, onClose, onUpdatePlayer }: { player: Player; onClose: () => void; onUpdatePlayer: (player: Player) => void }) {/export function RelationshipsModal({ player, onClose, onUpdatePlayer, onTriggerRomanceEvent }: { player: Player; onClose: () => void; onUpdatePlayer: (player: Player) => void; onTriggerRomanceEvent?: (event: RomanceEvent) => void }) {/' src/components/RelationshipsModal.tsx
