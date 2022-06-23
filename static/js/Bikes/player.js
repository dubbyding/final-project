import { Bike } from './bike.js';

/**
 * This is player's class which gets the player's bike's assets and then defines which bike is player's.
 * This class also defines the tasks to be done by players such as movements
 */
class Player extends Bike {
	constructor(playerColor) {
		super();
		this.playerColor = playerColor;

		this.currentState = 'wait';
	}

	/**
	 * Get player's assets
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

	/* Drawing the bike on the canvas. */
	renderBike = (canvas, ctx, bike) => {
		ctx.drawImage(
			bike,
			this.bikeStates[this.currentState].top,
			this.bikeStates[this.currentState].left,
			this.bikeStates[this.currentState].width,
			this.bikeStates[this.currentState].height,
			canvas.width / 2.25,
			canvas.height / 2,
			this.bikeStates[this.currentState].width * 2,
			this.bikeStates[this.currentState].height * 2
		);
	};
}

export { Player };
