var WaveSurfer = require('wavesurfer')
var TimelinePlugin = require('./node_modules/wavesurfer/plugin/wavesurfer.timeline.js');
var { SHA3 } = require('sha3')

let wavesurfer = null
let numInputs = 0

// detect_pitch (POST) -> uploads file, returns a csv file

// correct_pitch (GET) -> uuid, intervals, pitches, returns audio file b64

function readFile(event) {
	/*
	Handler for the "Choose file" button.
	It reads the file into base64 encoding and sends this to the ??? endpoint.
	It also loads the file for WaveSurfer for playing and seeking.
	*/
	var fileReader = new FileReader();
	const path = event.target.files[0].path
	fileReader.readAsDataURL(event.target.files[0])
	// TODO: send fileReader.result to the backend
	fileReader.onload = () => {
		/*
		var req = new XMLHttpRequest();
		const postUrl = 'http://127.0.0.1' // TODO
		req.open("POST", postUrl);
		req.send({ 'b64_audio': fileReader.result });
		xhr.onload = function (e) {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					// DO SOMETHING
					console.log(xhr.responseText);
				} else {
					console.error(xhr.statusText);
				}
			}
		};
		*/
		const url = "http://127.0.0.1";
		const fileData = fileReader.result
			
		const hash = new SHA3(256);
 
		hash.update(fileData);
		
		const payload = {
			'file': fileData,
			'id:': hash.digest('hex'),
		}
		fetch(url, {
		    method : "POST",
		    body: JSON.stringify(payload),
		    // -- or --
		    // body : JSON.stringify({
		        // user : document.getElementById('user').value,
		        // ...
		    // })
		}).then(
			// DO SOMETHING
		    response => response.text() // .json(), etc.
		    // same as function(response) {return response.text();}
		).then(
		    html => console.log(html)
		);
	}

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
	var row = inputsTable.insertRow(num)
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
	Gets the form data and sends it to the ??? endpoint
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
		'id': uuidv4(),
		pitch_shifts,
	}

	const url = "http://127.0.0.1";
	fetch(url, {
	    method : "GET",
	    body: JSON.stringify(payload),
	    // -- or --
	    // body : JSON.stringify({
	        // user : document.getElementById('user').value,
	        // ...
	    // })
	}).then(
		// DO SOMETHING
	    response => response.text() // .json(), etc.
	    // same as function(response) {return response.text();}
	).then(
	    html => console.log(html)
	);

	// don't submit for now TODO
	event.preventDefault()
}

window.addEventListener("load", 
	function(){
		// Initialize everything!

		// Upload button
		var uploadButton = document.getElementById('audioFileChooser')
		uploadButton.onchange = readFile

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
