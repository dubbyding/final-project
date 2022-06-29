import { Bike } from './bike.js';
import { MathImplement } from '../math.js';

class Opponent extends Bike {
	constructor() {
		super();
		this.math = new MathImplement();
		this.zIndex = 20;
	}

	setZValue = (playerZIndex) => {
		this.z = (this.zIndex - playerZIndex) / 10;
	};

	conditionToDisplay = () => {
		if (this.z < 0 || this.z > 10) {
			return false;
		} else {
			return true;
		}
	};

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

	moveBike = (carPos, playerPos) => {
		let velocity = this.math.generateRandomNumber(0, 6);
		if (velocity > 0 && this.velocity <= 1) {
			this.currentState = 'wheely';
		}
		if (velocity > 1) {
			this.currentState = 'ride';
		}
		if (this.z > 0) this.zIndex += velocity / 10;
		else this.zIndex += 1;
	};
}

export { Opponent };
