import { Bike } from './bike.js';
import { MathImplement } from '../math.js';

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
	 * @desc Setting the z value of the opponent bike.
	 * @param {Number} playerZIndex - Current Index of the player
	 * */
	setZValue = (playerZIndex) => {
		this.z = (this.zIndex - playerZIndex) / 10;
	};

	/**
	 * @desc Checking if opponent bike is near enough to be displayed
	 * @returns {Boolean} True, if bike is near to be displayed else false
	 * */
	conditionToDisplay = () => {
		if (this.z < 0 || this.z > 10) {
			return false;
		} else {
			return true;
		}
	};

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
