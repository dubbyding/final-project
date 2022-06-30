import { Bike } from './bike.js';

/**
 * This is player's class which gets the player's bike's assets and then defines which bike is player's.
 * This class also defines the tasks to be done by players such as movements
 */
class Player extends Bike {
	constructor() {
		super();
		this.z = 1;
	}

	/**
	 * @desc Get player's assets
	 * @returns Promise of list of player's bikes
	 */
	playerAsset = () => {
		return this.bikeAssets('player');
	};

	/**
	 *
	 * @param {string} color
	 * @returns {Boolean} promise that gives true or false on status of bike
	 */
	playerBike = (color) => {
		return this.checkBikeColor(color);
	};

	/**
	 * @desc A function that is used to change the state of the bike.
	 * @param {Number} velocity - current velocity of the bike
	 * @param {Object} keyPressed - Object of currently pressed keys
	 * */
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

		if (keyPressed['x']) {
			this.currentState = 'punchLeft';
		}
		if (keyPressed['c']) {
			this.currentState = 'punchRight';
		}
		if (keyPressed['z']) {
			this.currentState = 'kickLeft';
		}
		if (keyPressed['v']) {
			this.currentState = 'kickRight';
		}
	};
}

export { Player };
