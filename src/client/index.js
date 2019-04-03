var WaveSurfer = require('wavesurfer')
var TimelinePlugin = require('./node_modules/wavesurfer/plugin/wavesurfer.timeline.js'); 
var { SHA3 } = require('sha3')
var FileSaver = require('file-saver');

var Chart = require('chart.js')

let wavesurfer = null
let numInputs = 0
let currentUid = null
let currentName = null

function generatePitchGraph(pitchData, gc=25) {
	const dataLength = pitchData.length
    var data = [];
    for (var x = 0; x < dataLength; x+=gc) {
        data.push({x: x/4410, y: pitchData[x]})
    }
    var options = {
        title: {
            display: true,
            text: 'Pitch Over Time (Hz, s)'
        },
        responsive: true,
        maintainAspectRatio: false, 
    }
    // delete existing canvases
    var previousCanvas = document.getElementById('pitchChart')
    if (previousCanvas) {
       previousCanvas.remove()
    }

    var pitchContainer = document.getElementById('pitchGraphContainer')
    var canvasElement = document.createElement('canvas')
    canvasElement.id = 'pitchChart'
    canvasElement.height = 600
    canvasElement.width = 700
    var ctx = canvasElement.getContext('2d')
    pitchContainer.appendChild(canvasElement)

    const chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
				label: 'Pitch',
				data: data,
				borderColor: '#2196f3',
				backgroundColor: '#2196f3',
            }]
        },
        options: options,
    });
}

function clearChildren(elementId) {
    const element = document.getElementById(elementId)
    if (element.children.length) {
        for (var x = 0; x < element.children.length; ++x) {
            element.children[x].remove()
        }
    }
}

function readFile(event) {
    /*
    Handler for the "Choose file" button.
   	Sends the selected file to the detect_pitch endpoint.
    It also loads the file for WaveSurfer for playing and seeking.
    */
    event.preventDefault()
    const resultDiv = document.getElementById('result')
    resultDiv.style = "display: none"

    var fileForm = document.forms[0];
    const path = fileForm.sampleFile.files[0].path
    currentName = fileForm.sampleFile.files[0].name.split('.')[0]

    // Clear any existing waveforms
    clearChildren('waveform')

    wavesurfer = WaveSurfer.create({
        container: '#waveform',
    });

    // Load the uploaded file so it can be played
    wavesurfer.load(path);
    wavesurfer.on('ready', function () {
    	console.log('DEBUG: ready to play file')
    })

    WaveSurfer.Timeline.init({
        wavesurfer: wavesurfer,
        container: "#wave-timeline",
        primaryLabelInterval: 1,
    });

    const url = "http://0.0.0.0:3000/detect_pitch"
    const formData = new FormData(fileForm)

    // Send the data and graph stuff
    fetch(url, {
        method : "POST",
        body: formData,
    })
	.then(
		function(response) {
			return response.json();
		})
	.then(
        function(responseBody) {
        	var pitchValues = responseBody.pitch
        	currentUid = responseBody.uid
     		pitchValues = pitchValues.split(',').map(el => parseInt(el))
     		generatePitchGraph(pitchValues)
            const loadingTextElement = document.getElementById('loadingText')
            loadingTextElement.style="display: none"
        })
}

function addInput(num) {
    /*
    Adds a row of input [a, b, pitch]
    */
    var removeButton = document.createElement('button')

    var aInput = document.createElement("input")
    var bInput = document.createElement("input")
    var pitchInput = document.createElement("input")

    // set some field restrictions
    // TODO: reflect these restrictions on the frontend
    const timePattern = "[0-9]+.?[0-9]*"
    aInput.pattern = timePattern
    bInput.pattern = timePattern
    pitchInput.pattern= "[A-Ga-g](s|S|b|B)?[0-8]"

    removeButton.onclick = removeInput
    removeButton.id = `inputs_remove_${num}`
    removeButton.innerHTML = "Remove"
    removeButton.type = "button"

    aInput.id = `inputs_a_${num}`
    bInput.id = `inputs_b_${num}`
    pitchInput.id = `inputs_pitch_${num}`

    var inputsTable = document.getElementById('inputs_table')

    // children[0].children.length
    var numRows = inputsTable.children[0].children.length
    var row = inputsTable.insertRow(numRows)
    row.id = `inputs_row_${num}`
    var aCell = row.insertCell(0)
    var bCell = row.insertCell(1)
    var pitchCell = row.insertCell(2)
    var removeButtonCell = row.insertCell(3)

    aCell.appendChild(aInput)
    bCell.appendChild(bInput)
    pitchCell.appendChild(pitchInput)
    removeButtonCell.appendChild(removeButton)
    numInputs += 1
}

function removeInput(event) {
    /*
    Removes a particular row of input
    */
    var rowNum = event.target.id.split('_')[2]
    var toRemove = document.getElementById(`inputs_row_${rowNum}`)
    toRemove.remove()
}

function submit(event) {
    /*
    Gets the form data and sends it to the correct_pitch endpoint
    */
    const len = event.target.length
    var pitch_shifts = []

    // sanitize for backend
    function sanitizeNote(note) {
        return note[0].toUpperCase() + note[1].toLowerCase() + (note.length > 2 ? note[2] : '')
    }
    for (var i = 0; i < len; i++) {
        i += 1
        if (i + 2 >= len) break // lmao
        var shift = {
            'start_time': event.target[i].value,
            'end_time': event.target[i+1].value,
            'desired_note': sanitizeNote(event.target[i+2].value),
        }
        pitch_shifts.push(shift)
        i += 2
    }
    const payload = {
        uid: currentUid,
        pitch_shifts,
    }

    const url = "http://0.0.0.0:3000/correct_pitch";
    fetch(url, {
        method : "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(
    	function(response) {
			return response.blob();
			// return response.json()
		})
    .then(
        function(blob) {
            const resultDiv = document.getElementById('result')
                // Clear any existing waveforms
            const waveformElement = document.getElementById('result_waveform')
            if (waveformElement.children.length) {
                for (var x = 0; x < waveformElement.children.length; ++x) {
                    waveformElement.children[x].remove()
                }
            }
            resultDiv.style = "display: block"
            wavesurfer2 = WaveSurfer.create({
                container: '#result_waveform',
            });

            WaveSurfer.Timeline.init({
                wavesurfer: wavesurfer2,
                container: "#result_wave-timeline",
                primaryLabelInterval: 1,
            });

            // Load the uploaded file so it can be played
            wavesurfer2.loadBlob(blob);
            wavesurfer2.on('ready', function () {
                console.log('DEBUG: ready to play file')
                const playPauseButton = document.getElementById('result_button_play_pause')
                playPauseButton.onclick = () => { wavesurfer2.playPause() }
            })

            const downloadButton = document.getElementById('result_download')
            downloadButton.onclick = () => {
                saveAs(blob, currentName + "_shifted.wav");
            }
        }
    )

    event.preventDefault()
}

window.addEventListener("load", 
    function(){
        // Initialize everything!

        // Upload button
        var uploadButton = document.getElementById('audioFileChooser')
        uploadButton.onclick = readFile

        // Play/Pause
        var playPauseButton = document.getElementById('button_play_pause')
        playPauseButton.onclick = () => { wavesurfer.playPause() }

        // Initialize progress time
        var progress = document.getElementById('menu-bar_progress')
        setInterval(
            () => { 
                if (wavesurfer) {
                    progress.innerHTML = `${wavesurfer.getCurrentTime()}` 
                }
            },
            100
        )

        // Add inputs listener
        var addInputButton = document.getElementById('inputs_add')
        addInputButton.onclick = () => { addInput(numInputs + 1)}

        // Set up the form submission
        const form = document.getElementById('form');
        form.onsubmit = submit;
    })



