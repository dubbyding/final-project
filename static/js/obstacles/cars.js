import { Obstacle } from './obstacles.js';

class Cars extends Obstacle {
	constructor() {
		super();

		this.carPosition = {
			top: 439,
			left: 224,
			width: 92,
			height: 79,
		};
	}
	/**
	 * Get CarAssets
	 * @returns Object of cars
	 */
	carAssets = () => {
		return this.obstacleAssets('cars');
	};

	/**
	 * @desc This function checks if car should be sent or not
	 * @param {Array<Number>} cars - Array of Cars
	 * @param {Array<Number>} roadAssets - Array of road coordinates
	 * @param {Number} index - current index to be displayed
	 * @returns Boolean if car should be sent or not
	 */
	getCarAssets = (cars, roadAssets, index) => {
		this.cars = cars;
		this.roadAssets = roadAssets;
		this.index = Math.round(index);

		this.totalLength = this.roadAssets[0].length;

		this.totalNumberOfCarsPerRoad = Math.round(
			this.totalLength / this.carsPerRoad
		);

		if ((this.index != 0 && !this.carZAxis) || this.carZAxis < 2) {
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

	/**
	 * @desc Setting the current X and Y coordinates of the car.
	 * @param {Array} currentX - Current X coordinate
	 * @param {Array} currentY - Current Y coordinate
	 * @param {Number} index - Current Index
	 */
	setCurrentXAndY = (currentX, currentY, index) => {
		this.currentX = currentX;
		this.currentY = currentY;
		this.carDisplay = this.cars[index];
	};

	/**
	 * @desc Drawing the car on the canvas.
	 * @param {Object} ctx - Context of the canvas
	 * @param {Number} left - Distance from left of window
	 * @param {Number} top - Distance from top of window
	 * @param {Number} width - Width of the car
	 * @param {Number} height - Height of the car
	 */
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
