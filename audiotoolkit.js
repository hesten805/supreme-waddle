/*
Made By Augusto Frade
Audio Toolkit JS Repository:
https://github.com/augustofrade/audiotoolkitjs
*/


function AudioKit(songs, options = {}) {
	console.log(">> Audio Tool Kit JS made by https://github.com/augustofrade");
	return {
		_songList: songs,
		_currentSong: songs[0],
		_currentTime: 0,
		_player: new Audio(),
		playing: false,
		options: options,
		onload: options.onload !== undefined ? options.onload : function() {},
		init() {
			this._player.volume = this.options.volume || 1;
			this._player.onended = _=> this._handleAudioEnd();
			this._player.src = this._currentSong;
			this._player.onloadedmetadata = _=> this.onload();
		},
		_handleAudioEnd() {
			switch(this.options.loop) {
				case"all":
					this.next();
					break;
				case "self":
					this._currentTime = 0;
					this.play();
					break;
				default:
					this._currentTime = 0;
					let currentIndex = this._songList.indexOf(this._currentSong)
					if(currentIndex < this._songList.length-1) {
						this.currentTrack = this.options.randomize ? this._songList[this._randomAudio()] : this._songList[currentIndex+1];
						this._player.src = this._currentSong;
						this.play();
					} else
						this.playing = false
					break;
			}
		},
		_randomAudio() {
			let randomIndex = Math.floor(Math.random() * this.tracks.length);
			while(randomIndex == this.tracks.indexOf(this._currentSong))
				randomIndex = Math.floor(Math.random() * this.tracks.length);
			return randomIndex;

		},

		play() {
			this._player.play();
			this._player.currentTime = this._currentTime
			this._currentTime = 0;
			this.playing = true;
		},
		pause() {
			this._player.pause();
			this._currentTime = this._player.currentTime;
			this.playing = false;
		},
		get tracks() {
			return this._songList;
		},
		get currentTrack() {
			return this._currentSong;
		},
		set currentTrack(song) {
			if(this._songList.indexOf(song) !== -1) {
				this._currentSong = song;
				this._player.src = song;
				this._currentTime = 0;
			} else
				throw "Audio track not found in track list"
		},
		get duration() {
			return this._player.duration;
		},
		get currentTime() {
			return this._player.currentTime;
		},
		set currentTime(time) {
			if(time <= this._player.duration) {
				this._player.currentTime = time;
				this._currentTime = time
			}
		},
		get loop() {
			if(typeof this.options.loop !== "undefined")
				return this.options.loop;
			else
				return "none";
		},
		setLoop(type) {
			if(type == "self" || type == "all" || type === undefined)
				this.options.loop = type;
		},
		get randomize() {
			return this.options.randomize;
		},
		set randomize(value) {
			if(typeof value === "boolean")
				this.options.randomize = value;
			else throw "The Audio Player randomization option value must be boolean type";
		},
		get volume() {
			return this._player.volume;
		},
		set volume(amount) {
			this._player.volume = amount;
		},
		get muted() {
			return this._player.muted;
		},
		set muted(mute) {
			if(typeof mute === "boolean")
				this._player.muted = mute;
			else throw "The Audio Player muted value must be boolean type";
		},
		get trackInfo() {
			return {track: this._currentSong, currentTime: this.currentTime, duration: this.duration}
		},
		_switchAudioTo(inRange, recoverAudio, toAudio) {
			this._currentTime = 0;
			if(inRange) {
				this._currentSong = this.options.randomize ? this.tracks[this._randomAudio()] : toAudio;
			} else {
				this._currentSong = this.options.randomize ? this.tracks[this._randomAudio()] : recoverAudio;
			}
			this._player.src = this._currentSong;
			this.onload();
			if(this.playing)
				this.play();
		},
		next() {
			this._switchAudioTo(
				this._songList.indexOf(this._currentSong) < this._songList.length-1,
				this._songList[0],
				this._songList[this._songList.indexOf(this._currentSong)+1]
			)
		},
		previous() {
			this._switchAudioTo(
				this._songList.indexOf(this._currentSong) > 0,
				this._songList[this._songList.length-1],
				this._songList[this._songList.indexOf(this._currentSong)-1]
			)
		},
		addTracks(...tracks) {
			this._songList.push(...tracks);
		},
	}
}
