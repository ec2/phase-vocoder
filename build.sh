#! /bin/sh
cd ./src/server/
npm install 
cd -

cd ./src/client/
yarn install 
cd -

docker build -t tueric/phase-vocoder .