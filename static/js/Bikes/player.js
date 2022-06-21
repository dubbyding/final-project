import { Bike } from './bike.js';

/**
 * This is player's class which gets the player's bike's assets and then defines which bike is player's.
 * This class also defines the tasks to be done by players such as movements
 */
class Player extends Bike {
	constructor(playerColor) {
		super();
		this.playerColor = playerColor;
	}

	/**
	 * Get player's assets
	 * @returns Promise of list of player's bikes
	 */
	playerAsset = () => {
		return this.bikeAssets('player');
	};

	playerBike = (color) => {
		return this.checkBikeColor('color');
	};
}

export { Player };
