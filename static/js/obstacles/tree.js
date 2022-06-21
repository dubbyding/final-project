import { Obstacle } from './obstacles.js';

class Trees extends Obstacle {
	constructor() {
		super();
	}
	treeAssets = () => {
		return this.obstacleAssets('tree');
	};
}

export { Trees };
