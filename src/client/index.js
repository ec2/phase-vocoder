const {Howl, Howler} = require('howler')



function readFile(files) {
  
  var fileReader = new FileReader();
  console.log(files, files.target.baseURI)
  // fileReader.readAsArrayBuffer(files[0]);
  // fileReader.onload = function(e) {
    // console.log(("Filename: '" + files[0].name + "'"), ( "(" + ((Math.floor(files[0].size/1024/1024*100))/100) + " MB)" ));
  // }
  var sound = new Howl({
	  src: ["violin-cut.wav"],
	  autoplay: true,
  loop: true,
  volume: 0.5,
  onend: function() {
    console.log('Finished!');
  }
	});

	sound.play();
  
  console.log('hi')
}

window.addEventListener("load", 
	function(){
		var button = document.getElementById('audioFileChooser')
		console.log(button)
		console.log('wowooowowo')
		button.onchange = readFile
	}
)
