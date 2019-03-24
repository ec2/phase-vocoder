var WaveSurfer = require('wavesurfer')
var TimelinePlugin = require('./node_modules/wavesurfer/plugin/wavesurfer.timeline.js');

let wavesurfer = null
let numInputs = 1

const status = {
	playing: false,
}

function readFile(files) {
	var fileReader = new FileReader();

	wavesurfer = WaveSurfer.create({
	    container: '#waveform',
	});
	WaveSurfer.Timeline.init({
		wavesurfer: wavesurfer,
		container: "#wave-timeline"
	});
	// Testing!
	wavesurfer.load('violin-cut.wav');
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

	aInput.id = `inputs_a_${num}`
	bInput.id = `inputs_b_${num}`
	pitchInput.id = `inputs_pitch_${num}`

	var inputsTable = document.getElementById('inputs_table')
	var row = inputsTable.insertRow(num)
	var aCell = row.insertCell(0)
	var bCell = row.insertCell(1)
	var pitchCell = row.insertCell(2)

	aCell.appendChild(aInput)
	bCell.appendChild(bInput)
	pitchCell.appendChild(pitchInput)
	console.log('set table')
}

function removeInput(num) {
	// TODO
}

window.addEventListener("load", 
	function(){
		// Initialize everything!
		var uploadButton = document.getElementById('audioFileChooser')
		uploadButton.onchange = readFile

		var playPauseButton = document.getElementById('button_play_pause')
		playPauseButton.onclick = () => { wavesurfer.playPause() }

		var progress = document.getElementById('menu-bar_progress')
		setInterval(
			() => { 
				if (wavesurfer && wavesurfer.isPlaying()) {
					progress.innerHTML = `${wavesurfer.getCurrentTime()}` 
				}
			},
			100)

		var addInputButton = document.getElementById('inputs_add')
		addInputButton.onclick = () => { addInput(numInputs + 1)}
		console.log('done binding', addInputButton)
	}
)
