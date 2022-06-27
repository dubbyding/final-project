import { Obstacle } from './obstacles.js';
import { MathImplement } from '../math.js';

class Cars extends Obstacle {
	constructor() {
		super();
	}
	carAssets = () => {
		return this.obstacleAssets('cars');
	};

	getCarAssets = (cars) => {
		this.cars = cars;
	};
}

export { Cars };
