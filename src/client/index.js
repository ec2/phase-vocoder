var WaveSurfer = require('wavesurfer')
var TimelinePlugin = require('./node_modules/wavesurfer/plugin/wavesurfer.timeline.js');

let wavesurfer = null

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
				if (wavesurfer.isPlaying()) {
					progress.innerHTML = `${wavesurfer.getCurrentTime()}` 
				}
			},
			100)

	}
)
