#!/bin/bash
sed -i '/import { RomanceEvent } from "..\/types";/d' src/components/Dashboard.tsx
sed -i '1i import { RomanceEvent } from "../types";' src/components/Dashboard.tsx
