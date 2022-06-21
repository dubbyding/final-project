import { Bike } from './bike.js';

class Police extends Bike {
	constructor() {
		super();
	}
	policeAsset = () => {
		return this.bikeAssets('police');
	};
}

export { Police };
