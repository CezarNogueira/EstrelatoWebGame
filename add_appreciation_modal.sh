#!/bin/bash
sed -i '/const \[showGiftOptions, setShowGiftOptions\] = useState(false);/a \
  const [appreciationModal, setAppreciationModal] = useState<{message: string; affinity: number} | null>(null);' src/components/RelationshipsModal.tsx
