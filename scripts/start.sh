#!/bin/bash

if [ ! -f done ]; then
  npx playwright install-deps chromium
  su node -c "npx playwright install chromium"
fi

touch done
su node -c "node index.js"