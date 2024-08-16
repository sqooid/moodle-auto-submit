#!/bin/bash
npx playwright install-deps
npx playwright install chromium
su node -c "node index.js"