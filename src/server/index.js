

const express = require('express')
const app = express()

const exec = require('child_process').exec;

app.use((request, response, next) => {
    console.log(request.headers)
    next()
})


app.get('/', (request, response) => {
    response.json({
        error: 500
    })
})


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