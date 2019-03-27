

const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const fs = require('fs');
const timeout = require('connect-timeout'); //express v4

const app = express();

const exec = require('child_process').exec;

app.use((request, response, next) => {
    //console.log(request.headers)
    next()
})

app.use(timeout(1200000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}



app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (request, response) => {
    response.json({
        error: 500
    })
})

console.log(__dirname)

app.post('/detect_pitch', (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log("REQ FILES ", req.files)
    let sampleFile = req.files.sampleFile;
    let uid = sampleFile.md5
    let dirPath = `/tmp/${uid}`;
    let filePath = dirPath + `/${uid}.wav`;

    let dirPathExists = fs.existsSync(dirPath);
    let filePathExists = fs.existsSync(filePath);

    // Saves uploaded file into /tmp/<UID>/
    if (!dirPathExists) {
        fs.mkdirSync(dirPath)
    }
    if (filePathExists) {
        fs.readFile(`/tmp/${uid}/${uid}.csv`, (err, data) => {
            if (err) {
                console.log(err)
                return res.send(667).send(err);
            }
            const returnObj = {
                code: 200,
                pitch: data.toString(),
                uid: uid
            }
            console.log("response!")
            res.send(JSON.stringify(returnObj))
        });
    } else {

        sampleFile.mv(filePath, function (err) {
            if (err) {
                console.log(err)
                return res.status(500).send(err);
            }
            // run the octave script in a shell
            dir = exec(`cd /root/phase-vocoder/src/octave-src/ && /root/phase-vocoder/src/octave-src/run_pitch_detection.m ${uid}`, function (err, stdout, stderr) {
                if (err) {
                    console.log(err)
                    return res.status(666).send(err);
                }
                // reads the csv file to be returned. 
                fs.readFile(`/tmp/${uid}/${uid}.csv`, (err, data) => {
                    if (err) {
                        console.log(err)
                        return res.send(667).send(err);
                    }
                    const returnObj = {
                        code: 200,
                        pitch: data.toString(),
                        uid: uid
                    }
                    console.log("response!")
                    res.send(JSON.stringify(returnObj))
                });
            });
        });
    }
});

/*
{
"id": something,
"pitch_shifts":[{"start_time":"0.2","end_time":"0.25","desired_note":"c4"},{"start_time":"0.3","end_time":"0.35","desired_note":"d4#"}]}
*/

app.post('/correct_pitch', (req, res) => {
    const body = req.body;
    const uid = body.uid;
    //type array
    const pitch_shifts = body.pitch_shifts;
    let paramStr = "";

    console.log(pitch_shifts)

    for (let i = 0; i < pitch_shifts.length; i++) {
        const start = pitch_shifts[i].start_time;
        const end = pitch_shifts[i].end_time;
        const note = pitch_shifts[i].desired_note;

        paramStr += ` ${start} ${end} ${note} `
    }

    console.log(paramStr)

    dir = exec(`cd /root/phase-vocoder/src/octave-src/ && /root/phase-vocoder/src/octave-src/run_pitch_shift.m ${uid} ${paramStr}`, function (err, stdout, stderr) {
        if (err) {
            console.log("Error: ", err)
            return res.status(666).send(err);
        }
        console.log('Done Shifting')
        res.download(`/tmp/${uid}/${uid}_shifted.wav`)
    });
});

app.listen(3000);