#! /bin/sh
cd ./src/server/
npm install 
cd -

cd ./src/client/
npm install 
cd -

docker build -t tueric/phase-vocoder .