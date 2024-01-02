#!/bin/bash

# File upload location
mkdir uploads
# GCP Google Vision key location
mkdir key

if [[ "$NODE_ENV" == "development" ]]; then
  npm run dev
else
  npm run build && npm run start
fi
