import { Bike } from './bike.js';

/**
 * This is player's class which gets the player's bike's assets and then defines which bike is player's.
 * This class also defines the tasks to be done by players such as movements
 */
class Player extends Bike {
	constructor() {
		super();
		this.currentState = 'wait';
		this.width = this.bikeStates[this.currentState].width;
		this.bikeHeight = this.bikeStates[this.currentState].height;
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
	 * @returns promise that gives true or false on status of bike
	 */
	playerBike = (color) => {
		return this.checkBikeColor(color);
	};
}

export { Player };
