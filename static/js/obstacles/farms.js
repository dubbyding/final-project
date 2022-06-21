import { Obstacle } from './obstacles.js';

class Farms extends Obstacle {
	constructor() {
		super();
	}
	farmAssets = () => {
		return this.obstacleAssets('farm');
	};
}

export { Farms };
