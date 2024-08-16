#!/bin/bash
npx playwright install-deps chromium
su node -c "npx playwright install chromium"
su node -c "node index.js"