import { Bike } from './bike.js';
import { MathImplement } from '../math.js';

class Opponent extends Bike {
	constructor() {
		super();
		this.math = new MathImplement();
	}

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
	};
}

export { Opponent };
