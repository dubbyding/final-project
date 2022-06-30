import { Bike } from './bike.js';
import { MathImplement } from '../math.js';

class Police extends Bike {
	constructor() {
		super();
		this.math = new MathImplement();
		this.zIndex = 20;
		this.posChange = 1;
		this.directionDetermine = false;
		this.directionCar = false;
	}
	policeAsset = () => {
		return this.bikeAssets('police');
	};

	bustedStatus = (velocity) => {
		if (velocity <= 10) {
			return true;
		} else {
			return false;
		}
	};
}

export { Police };
