class Audio {
	getAudios = async () => {
		let value;
		try {
			const link = 'http://localhost:3000/getAssets/bikeAudio';
			value = await fetch(link);
			value = await value.json();
		} catch {
			value = await fetch(
				`https://roadrash-api.herokuapp.com/getAssets/bikeAudio`
			);
			value = await value.json();
		}
		this.idle = value['list'][0];
		this.ride = value['list'][1];
		return value;
	};

	/**
	 * @desc Create New element of audio idle and return its element
	 * @returns Object of audio Idle sound
	 */
	createIdleSound = async () => {
		this.audioIdle = document.createElement('audio');
		this.audioIdle.src = this.idle;
		this.audioIdle.setAttribute('preload', 'auto');
		this.audioIdle.setAttribute('control', 'none');
		this.audioIdle.loop = true;
		this.audioIdle.style.display = 'none';

		document.body.appendChild(this.audioIdle);
		return this.audioIdle;
	};

	/**
	 * @desc Creating a new audio element and appending it to the body. */
	createRideSound = async () => {
		this.audioRide = document.createElement('audio');
		this.audioRide.src = this.ride;
		this.audioRide.setAttribute('preload', 'auto');
		this.audioRide.setAttribute('control', 'none');
		this.audioRide.loop = true;
		this.audioRide.style.display = 'none';

		document.body.appendChild(this.audioRide);
		return this.audioRide;
	};

	/**
	 * @desc Pausing the ride sound and playing the idle sound.
	 * */
	playIdleSound = async () => {
		try {
			this.audioRide.pause();
		} catch {
			console.log('Play Start');
		}
		this.audioIdle.play();
	};

	/**
	 * @desc Pausing the idle sound and playing the ride sound.
	 */
	playRideSound = () => {
		this.audioIdle.pause();
		this.audioRide.play();
	};

	/**
	 * @desc Stop all the playing sound
	 */
	stopSound = () => {
		this.audioIdle.pause();
		this.audioRide.pause();
	};
}

export { Audio };
