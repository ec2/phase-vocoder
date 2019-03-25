

const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require ('body-parser')

const fs = require('fs');
const path = require('path');

const app = express();

const exec = require('child_process').exec;

app.use((request, response, next) => {
    //console.log(request.headers)
    next()
})




app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (request, response) => {
    response.json({
        error: 500
    })
})

console.log(__dirname)

app.post('/detect_pitch', (req, res) =>{        
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log("REQ FILES ", req.files)
    let sampleFile = req.files.sampleFile;
    let uid = sampleFile.md5

    // Saves uploaded file into /tmp/<UID>/
    fs.mkdirSync(`/tmp/${uid}`)
    sampleFile.mv(`/tmp/${uid}/${uid}.wav`, function(err) {
        if (err){
            console.log(err)
            return res.status(500).send(err);
        }
        // run the octave script in a shell
        dir = exec(`cd /root/phase-vocoder/src/octave-src/ && /root/phase-vocoder/src/octave-src/run_pitch_detection.m ${uid}`, function (err, stdout, stderr) {
            if (err) {
                console.log (err)
                return res.status(666).send(err);
            }
            // reads the csv file to be returned. 
            fs.readFile(`/tmp/${uid}/${uid}.csv`, (err, data) => {
                if(err){
                    console.log(err)
                    return res.send(667).send(err);
                }
                const returnObj = {
                    code: 200,
                    pitch: data.toString(),
                    uid: uid
                }
                console.log("response!")
                res.send (JSON.stringify(returnObj))
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