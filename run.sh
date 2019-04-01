#! /bin/sh
docker run -d -p 3000:3000 -v $PWD:/root/phase-vocoder tueric/phase-vocoder  
cd src/client/
npm start 
cd -