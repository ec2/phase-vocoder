

const express = require('express');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const path = require('path');

const app = express();

const exec = require('child_process').exec;

app.use((request, response, next) => {
    console.log(request.headers)
    next()
})

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.get('/', (request, response) => {
    response.json({
        error: 500
    })
})



app.post('/detect_pitch', (req, res) =>{
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    let sampleFile = req.files.sampleFile;
    const uid = req.uid;
    console.log('UID: ', uid)
    sampleFile.mv(`/tmp/${uid}.jpg`, function(err) {
        if (err)
          return res.status(500).send(err);
        dir = exec(`ls`, function (err, stdout, stderr) {
            if (err) {
                return res.status(666).send(err);
            }
            fs.readFile(`/tmp/${uid}.csv`, (err, data) => {
                if(err){
                    return res.send(667).send(err);
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        }); 
    });
});



app.get('/correct_pitch', (req, res) => {
    const uid = req.uid;
    const correction = req.corrections;

    
});



app.post('/upload', (req, res) => {

});

app.get('/download', (req, res) => {
    const file = __dirname + '/../octave-src/pvoc.m';
    res.download(file);
});

app.get('/process', (req, res) => {
    dir = exec("octave --eval ", function (err, stdout, stderr) {
        if (err) {
            // should have err.code here?  
        }
        console.log(stdout);
        res.send(stdout);
    });

});

app.listen(3000);