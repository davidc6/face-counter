#!/bin/sh

if [ -d "./api/node_modules" ]
then
  echo "API node_modules already exists"
else
  # install api dependencies
  cd api
  npm i
  cd ..
fi

if [ -d "./spa/node_modules" ]
then
  echo "SPA node_modules already exists"
else
  # install spa dependencies
  cd spa
  npm i
  cd ..
fi

# run docker compose in detached mode
docker compose up