var WaveSurfer = require('wavesurfer')
var TimelinePlugin = require('./node_modules/wavesurfer/plugin/wavesurfer.timeline.js');

var uuidv4 = require('uuid/v4')

let wavesurfer = null
let numInputs = 0

const status = {
	playing: false,
}

function readFile(event) {
	var fileReader = new FileReader();
	console.log(event)
	test = fileReader.readAsDataURL(event.target.files[0])
	// TODO: send fileReader.result to the backend
	fileReader.onload = () => { console.log(fileReader.result) } 
	const path = event.target.files[0].path
	wavesurfer = WaveSurfer.create({
	    container: '#waveform',
	});
	WaveSurfer.Timeline.init({
		wavesurfer: wavesurfer,
		container: "#wave-timeline"
	});
	// Testing!
	wavesurfer.load(path);
	wavesurfer.on('ready', function () {
		console.log('yes!')
	})
}

function addInput(num) {
	console.log('hi', num)
	var inputLine = document.createElement("tr");
	var cell = document.createElement("td");

	var aInput = document.createElement("input")
	var bInput = document.createElement("input")
	var pitchInput = document.createElement("input")

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
	console.log('set table')
	numInputs += 1
}

function removeInput(event) {
	var rowNum = event.target.id.split('_')[2]
	var toRemove = document.getElementById(`inputs_row_${rowNum}`)
	toRemove.remove()
}

function submit(event) {
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
