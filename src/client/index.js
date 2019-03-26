var WaveSurfer = require('wavesurfer')
var TimelinePlugin = require('./node_modules/wavesurfer/plugin/wavesurfer.timeline.js');
var { SHA3 } = require('sha3')

let wavesurfer = null
let numInputs = 0
let currentUid = null

// detect_pitch (POST) -> uploads file, returns a csv file

// correct_pitch (GET) -> uuid, intervals, pitches, returns audio file b64

function readFile(event) {
	/*
	Handler for the "Choose file" button.
	It reads the file into base64 encoding and sends this to the detect_pitch endpoint.
	It also loads the file for WaveSurfer for playing and seeking.
	*/
	event.preventDefault()
	var fileReader = new FileReader();

	var selectForm = document.forms[0];
	const path = selectForm.sampleFile.files[0].path

	wavesurfer = WaveSurfer.create({
	    container: '#waveform',
	});

	WaveSurfer.Timeline.init({
		wavesurfer: wavesurfer,
		container: "#wave-timeline"
	});

	// Load the uploaded file
	wavesurfer.load(path);
	wavesurfer.on('ready', function () {
		console.log('yes!')
	})

	const url = "http://127.0.0.1:3000/detect_pitch"
	const formData = new FormData(selectForm)

	fetch(url, {
	    method : "POST",
	    body: formData,
	}).then(
	    function(response) {
	    	currentUid = response.uid
	    	// Do something with response.pitch [0,0,0,...]
	    }
	)
	event.preventDefault()
}

function addInput(num) {
	/*
	Adds a row of input [a, b, pitch]
	*/
	var inputLine = document.createElement("tr");
	var cell = document.createElement("td");

	var aInput = document.createElement("input")
	var bInput = document.createElement("input")
	var pitchInput = document.createElement("input")

	// set some field restrictions
	// TODO: reflect these restrictions on the frontend
	const timePattern = "[0-9]+\.?[0-9]*"
	aInput.pattern = timePattern
	bInput.pattern = timePattern
	pitchInput.pattern= "[A-Ga-g][1-9](#|B|b)?"

	var removeButton = document.createElement('button')
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
	for (var i = 0; i < len; i++) {
		i += 1
		if (i + 2 >= len) break // lmao
		var shift = {
			'start_time': event.target[i].value,
			'end_time': event.target[i+1].value,
			'desired_note': event.target[i+2].value,
		}
		pitch_shifts.push(shift)
		i += 2
	}
	const payload = {
		uid: currentUid,
		pitch_shifts,
	}
	console.log(payload)

	const url = "http://0.0.0.0:3000/correct_pitch";
	fetch(url, {
	    method : "POST",
	    body: JSON.stringify(payload),
	    headers: {
            "Content-Type": "application/json",
        },
	}).then(
	
	    response => response.text() // .json(), etc.
	    // same as function(response) {return response.text();}
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
			100)

		// Add inputs listener
		var addInputButton = document.getElementById('inputs_add')
		addInputButton.onclick = () => { addInput(numInputs + 1)}

		// Set up the form submission
		const form = document.getElementById('form');
		form.onsubmit = submit;
	}
)
