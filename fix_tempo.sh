#!/bin/bash
sed -i '/if (action === "tempo") {/,/    }/c\
    } else if (action === "tempo") {\
      setShowTempoOptions(true);\
      return;\
    }' src/components/RelationshipsModal.tsx
