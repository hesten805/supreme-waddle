{
	String.prototype.fixTime = function() {
	var sec_num = parseInt(this, 10);
	var hours   = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours   < 10) {hours   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	return hours > 0 ? hours+':'+minutes+':'+seconds : minutes+':'+seconds || "00:00";
}


const slider = document.querySelector("#slider");
const toggleBtn = document.querySelector("#toggleMusicButton");
const duration = document.querySelector("#musicDuration");
const currentTime = document.querySelector("#currentTime");
const replayBtn = document.querySelector("#replayButton");
document.addEventListener("keyup", e => {
	switch(e.key) {
		case " ":
			toggleMusic();
			break;
		case "ArrowUp":
			if(audio.volume < 1)
				audio.volume += 0.1;
			break;
		case "ArrowDown":
			if(audio.volume > 0)
				audio.volume -= 0.1;
			break;
		case "ArrowRight":
			audio.currentTime += 5;
			break;
		case "ArrowLeft":
			audio.currentTime -= 5;
			break;
		case "m":
			audio.muted = !audio.muted;
			break;
		case "r":
			toggleLoop();
			break;
		case "t":
			let newTrack = prompt("Adding new audio...\nDisclaimer: the name of the music will be the supplied URL, not it's title / author");
			if(newTrack)
				audio.addTracks(newTrack);
			break;
	}
})


const audio = new AudioKit(["music/Kevin Macleod - Werq.mp3", "music/Kevin MacLeod - Second Coming.mp3"], {onload: loadMusicInfo});
audio.init();

toggleBtn.onclick = _ => toggleMusic();
slider.oninput = _ => audio.currentTime = slider.value;
document.querySelector("#previousMusicButton").onclick = _ => audio.previous();
document.querySelector("#nextMusicButton").onclick = _ => audio.next();
replayBtn.onclick =_ => toggleLoop();

function toggleMusic() {
	if(!audio.playing) {
		audio.play();
		toggleBtn.src = "img/pause.png";
	} else {
		audio.pause();
		toggleBtn.src = "img/play.png";
	}
};

function toggleLoop() {
	let loopType = audio.loop;
	audio.setLoop(loopType == "self" ? "all" : "self");
	replayBtn.src = `img/replay_${audio.loop}.png`;
};

function loadMusicInfo() {
	let durationtime = audio.duration.toString().fixTime();
	let track = audio.currentTrack;
	track = track.substring(track.lastIndexOf("/")+1, track.lastIndexOf(".")).substring(0, 25);
	duration.innerHTML = durationtime;
	slider.max = audio.duration;
	document.querySelector("#track-lbl").innerHTML = track;
}

function moveSlider() {
	slider.value = audio.currentTime;
	let timeFixed = audio.duration.toString().fixTime();
	currentTime.innerHTML = audio.currentTime.toString().fixTime();
	if(!audio.playing)
		toggleBtn.src = "img/play.png";
};

setInterval(moveSlider, 100);
alert("Spacebar - pause / play video\nM - Mute\nT - Add new audio\nR - Toggle replay\n\
\ARROWS:\nLeft / Right - rewind / fast forward\nUp / Down - Volume up / down")
}
