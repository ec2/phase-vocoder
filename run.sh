#! /bin/sh
docker run -d -p 3000:3000 -v $PWD:/root/phase-vocoder --cidfile="dockercid" tueric/phase-vocoder  
cd src/client/
npm start 

cd -

CID=$(cat dockercid)
docker stop $CID
rm dockercid