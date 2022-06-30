import { Bike } from './bike.js';
import { MathImplement } from '../math.js';

/**
 * @desc The Opponent class extends the Bike class and adds a few more properties and methods to it.
 */
class Opponent extends Bike {
	constructor() {
		super();
		this.math = new MathImplement();
		this.zIndex = 20;
		this.posChange = 1;
		this.directionDetermine = false;
		this.directionCar = false;
	}

	/**
	 * @desc Getting the opponent bike.
	 * @param {Array} bike - Array of bike objects
	 * @param {String} playerColor - Color of the player
	 * @returns {Array} Array of list of bikes except player Bike
	 * */
	getOpponentBike = (bike, playerColor) => {
		this.bike = bike;
		this.playerColor = playerColor;
		let remainingBike = [];
		for (let i in this.bike) {
			let currentList = this.bike[i].src.split('/');
			if (
				currentList[currentList.length - 1].split('.')[0] != this.playerColor
			) {
				remainingBike.push(this.bike[i]);
			}
		}
		let currentOpponentIndex = this.math.generateRandomNumber(
			0,
			remainingBike.length - 1
		);
		this.remainingBike = remainingBike[currentOpponentIndex];
		return this.remainingBike;
	};
}

export { Opponent };
