/**
 * @desc Bike class gets the assets of bike and defines the behavior of the bike
 */
class Bike {
	constructor() {
		this.currentWidth = 2;
		this.bikeStates = {
			wait: {
				top: -5,
				left: -8,
				width: 45,
				height: 70,
			},
			wheely: {
				top: 42,
				left: 4,
				width: 31,
				height: 58,
			},
			ride: {
				top: 183,
				left: 7,
				width: 30,
				height: 55,
			},
			speed: {
				top: 257,
				left: 12,
				width: 30,
				height: 50,
			},
			right: {
				top: 184,
				left: 90,
				width: 30,
				height: 50,
			},
			left: {
				top: 9,
				left: 86,
				width: 34,
				height: 48,
			},
		};
	}
	/**
	 * Gets the assets of the bikes
	 * @param {string} type
	 * @returns promise of json list of bike assets
	 */
	bikeAssets = async (type) => {
		try {
			const link = `http://localhost:3000/getAssets/bikes/${type}`;
			let value = await fetch(link);
			return value.json();
		} catch {
			const link = `https://roadrash-api.herokuapp.com/getAssets/bikes/${type}`;
			let value = await fetch(link);
			return value.json();
		}
	};

	checkBikeColor = async (color) => {
		try {
			const link = `http://localhost:3000/getAssets/bikes/player/${color}`;
			let value = await fetch(link);
			return value.json();
		} catch {
			const link = `https://roadrash-api.herokuapp.com/getAssets/bikes/player/${color}`;
			let value = await fetch(link);
			return value.json();
		}
	};

	transitionAnimation = (velocity, keyPressed) => {
		if (velocity == 0) {
			this.currentState = 'wait';
		} else if (velocity > 0 && velocity < 10) {
			this.currentState = 'wheely';
		} else if (velocity > 10 && velocity < 20) {
			this.currentState = 'ride';
		} else if (velocity > 20) {
			this.currentState = 'speed';
		}

		if (velocity > 10) {
			if (keyPressed['d'] || keyPressed['ArrowRight'])
				this.currentState = 'right';
			if (keyPressed['a'] || keyPressed['ArrowLeft']) {
				this.currentState = 'left';
			}
		}
	};
}

export { Bike };
