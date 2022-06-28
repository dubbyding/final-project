import { Obstacle } from './obstacles.js';

class Cars extends Obstacle {
	constructor() {
		super();
		this.carsPerRoad = 20;
		this.carStatus = false;
		this.multiplyFactor = 1;

		this.carPosition = {
			top: 439,
			left: 224,
			width: 92,
			height: 79,
		};
	}
	carAssets = () => {
		return this.obstacleAssets('cars');
	};

	getCarAssets = (cars, roadAssets, index) => {
		this.cars = cars;
		this.roadAssets = roadAssets;
		this.index = Math.round(index);

		this.totalLength = this.roadAssets[0].length;

		this.totalNumberOfCarsPerRoad = Math.round(
			this.totalLength / this.carsPerRoad
		);

		if (this.index % this.totalNumberOfCarsPerRoad == 0 && this.index != 0) {
			if (!this.carStatus) {
				this.carStatus = true;
				this.multiplyFactor = 1;
				return true;
			}
		} else {
			this.carStatus = false;
		}
		return false;
	};

	setCurrentXAndY = (currentX, currentY, index) => {
		this.currentX = currentX;
		this.currentY = currentY;
		this.carDisplay = this.cars[index];
	};

	displayCar = (ctx, left, top, width, height) => {
		this.multiplyFactor += 0.01;
		ctx.drawImage(
			this.carDisplay,
			this.carPosition.top,
			this.carPosition.left,
			this.carPosition.width,
			this.carPosition.height,
			left,
			top * 2,
			width * this.multiplyFactor,
			height * this.multiplyFactor
		);
	};
}

export { Cars };
