import { Obstacle } from './obstacles.js';

class Cars extends Obstacle {
	constructor() {
		super();
	}
	carAssets = () => {
		return this.obstacleAssets('cars');
	};
}

export { Cars };
