/**
 * @desc Bike class gets the assets of bike and defines the behavior of the bike
 */
class Bike {
	constructor() {
		this.currentWidth = 2.5;

		this.bikeStates = {
			wait: {
				top: 5,
				left: 8,
				width: 32,
				height: 54,
			},
			wheely: {
				top: 42,
				left: 4,
				width: 31,
				height: 58,
			},
			ride: {
				top: 183,
				left: 7,
				width: 30,
				height: 55,
			},
			speed: {
				top: 257,
				left: 12,
				width: 30,
				height: 50,
			},
			right: {
				top: 184,
				left: 90,
				width: 30,
				height: 50,
			},
			left: {
				top: 9,
				left: 86,
				width: 34,
				height: 48,
			},
			punchLeft: {
				top: 231,
				left: 90,
				width: 44,
				height: 51,
			},
			punchRight: {
				top: 118,
				left: 164,
				width: 44,
				height: 51,
			},
			kickLeft: {
				top: 321,
				left: 88,
				width: 42,
				height: 53,
			},
			kickRight: {
				top: 350,
				left: 162,
				width: 42,
				height: 53,
			},
		};
		this.currentState = 'wait';
		this.width = this.bikeStates[this.currentState].width;
		this.bikeHeight = this.bikeStates[this.currentState].height;
	}
	/**
	 * Gets the assets of the bikes
	 * @param {string} type
	 * @returns {JSON} promise of json list of bike assets
	 */
	bikeAssets = async (type) => {
		try {
			const link = `http://localhost:3000/getAssets/bikes/${type}`;
			let value = await fetch(link);
			return value.json();
		} catch {
			const link = `https://roadrash-api.herokuapp.com/getAssets/bikes/${type}`;
			let value = await fetch(link);
			return value.json();
		}
	};

	/**
	 * @desc Checking the color of the bike.
	 * @param {String} color - Color of bike to be checked
	 * */
	checkBikeColor = async (color) => {
		try {
			const link = `http://localhost:3000/getAssets/bikes/player/${color}`;
			let value = await fetch(link);
			return value.json();
		} catch {
			const link = `https://roadrash-api.herokuapp.com/getAssets/bikes/player/${color}`;
			let value = await fetch(link);
			return value.json();
		}
	};

	/**
	 *  @desc Drawing the bike on the canvas.
	 */
	renderBike = (ctx, bike, top, left, width, height) => {
		ctx.drawImage(
			bike,
			this.bikeStates[this.currentState].top,
			this.bikeStates[this.currentState].left,
			this.bikeStates[this.currentState].width,
			this.bikeStates[this.currentState].height,
			top,
			left,
			width,
			height
		);
	};

	/**
	 * Gets current coordinates of the bike
	 * @param {Object} canvas - Object of the canvas
	 * @param {Object} road - Object of road
	 * @param {Number} transformingFactor - Transforming factor to move to screen. Default is canvas.width/2
	 * @returns {Array} Array of coordinates of the bike coordinates [top, left, height, width]
	 */
	bikeCoordinates = async (
		canvas,
		road,
		transformingFactor = canvas.width / 2,
		zAxisTranslate = 150
	) => {
		let newleftCoordinates, newrightCoordinates;

		if (!this.position) {
			this.position = 0;
			this.height = canvas.height;
		}

		let currentPlayerPosX = [
			[this.position, this.height, this.z],
			[this.position, this.height + this.bikeHeight, this.z],
		];
		let currentPlayerPosY = [
			[this.position + this.width, this.height, this.z],
			[this.position + this.width, this.height + this.bikeHeight, this.z],
		];

		[newleftCoordinates, newrightCoordinates] =
			await road.generateProjectedCoordinates([
				currentPlayerPosX,
				currentPlayerPosY,
			]);

		let top = Math.round(newleftCoordinates[0][1]) + zAxisTranslate;
		let left = newleftCoordinates[0][0] + transformingFactor;

		let height =
			Math.round(newleftCoordinates[1][1] - top + zAxisTranslate) * 4;
		let width =
			Math.round(newrightCoordinates[1][0] - left + transformingFactor) * 6;

		return [top, left, height, width];
	};

	/**
	 * Move the bike automatically
	 * @param {Array.<Number>} carPos - position of the current car
	 * @param {Array.<Number>} playerPos - position of the player
	 * @param {Array.<Number>} currentPos - position of the current bike
	 * @param {Array.<Number>} border - position of the external border
	 */
	moveBike = (carPos, playerPos, currentPos, border, maxSpeed = 6) => {
		let xTopCar,
			xLeftCar,
			xWidthCar,
			xHeightCar,
			xTopPlayer,
			xLeftPlayer,
			xWidthPlayer,
			xHeightPlayer,
			xLeft,
			xRight,
			top,
			left,
			width,
			height;

		[xTopCar, xLeftCar, xWidthCar, xHeightCar] = carPos;
		[xTopPlayer, xLeftPlayer, xWidthPlayer, xHeightPlayer] = playerPos;
		[xLeft, xRight] = border;
		[top, left, width, height] = currentPos;

		let velocity = this.math.generateRandomNumber(0, maxSpeed);
		if (velocity > 0 && this.velocity <= 1) {
			this.currentState = 'wheely';
		}
		if (velocity > 1) {
			this.currentState = 'ride';
		}

		let currentDistanceLeft = left - xLeft[Math.round(this.z)];
		let currentDistanceRight = xRight[Math.round(this.z)] - (left + width);

		/**
		 * For Collision with Car
		 */

		if (carPos[0]) {
			if (
				xLeftCar < left + width &&
				left < xLeftCar + xWidthCar &&
				xTopCar * 2 < top + height &&
				top < xTopCar * 2 + xHeightCar
			) {
				if (!this.directionCar) {
					this.directionCar = true;
					if (currentDistanceLeft > currentDistanceRight) {
						this.position -= 1;
						velocity = -40;
					} else {
						this.position += 1;
						velocity = -40;
					}
				}
			} else {
				this.directionCar = false;
				velocity = this.math.generateRandomNumber(0, maxSpeed);
			}
		}

		/**
		 * For collision with player
		 */
		if (
			xLeftPlayer < left + width &&
			left < xLeftPlayer + xWidthPlayer &&
			top < xTopPlayer + xHeightPlayer &&
			top + height > xTopPlayer
		) {
			let playerBottom = xTopPlayer + xHeightPlayer;
			let opponentBottom = top + height;
			let diff1 = Math.abs(playerBottom - top);
			let diff2 = Math.abs(opponentBottom - top);
			if (diff1 > diff2) {
				velocity *= 2;
			} else {
				velocity = 0;
				if (!this.directionDetermine) {
					this.directionDetermine = true;
					if (currentDistanceLeft > currentDistanceRight) {
						if (this.posChange > 0) this.posChange = -1;
					} else {
						if (this.posChange < 0) this.posChange = 1;
					}
				}
				this.position += this.posChange;
			}
		} else {
			this.directionDetermine = false;
		}

		/**
		 * Border Collision Check
		 */

		if (currentDistanceLeft < 0) {
			if (this.posChange < 0) this.posChange = 1;
		}
		if (currentDistanceRight < 0) {
			if (this.posChange > 0) this.posChange = -1;
		}

		if (this.z > 0) this.zIndex += velocity / 10;
		else this.zIndex += 1;
	};

	/**
	 * @desc Setting the z value of the opponent bike.
	 * @param {Number} playerZIndex - Current Index of the player
	 * */
	setZValue = (playerZIndex) => {
		this.z = (this.zIndex - playerZIndex) / 10;
	};

	/**
	 * @desc Checking if opponent bike is near enough to be displayed
	 * @returns {Boolean} True, if bike is near to be displayed else false
	 * */
	conditionToDisplay = () => {
		if (this.z < 0 || this.z > 10) {
			return false;
		} else {
			return true;
		}
	};

	/**
	 * Check if player has kicked and return transfroming factor
	 * @param {Array} otherBikeCords - Coordinates of bike to be kicked
	 * @param {Array} currentBikeCords - Coordinates of Current player Bike
	 * @param {Boolean} isPlayer - Check if it is player or not. Default: True
	 * @returns
	 */
	kickCheck = (otherBikeCords, currentBikeCords, isPlayer = true) => {
		let xTopOther,
			xLeftOther,
			xWidthOther,
			xHeightOther,
			xTopCurrent,
			xLeftCurrent,
			xWidthCurrent,
			xHeightCurrent;
		[xTopOther, xLeftOther, xWidthOther, xHeightOther] = otherBikeCords;
		[xTopCurrent, xLeftCurrent, xWidthCurrent, xHeightCurrent] =
			currentBikeCords;

		if (
			xLeftCurrent < xLeftOther + xWidthOther &&
			xLeftOther < xLeftCurrent + xWidthCurrent &&
			xTopOther < xTopCurrent + xHeightCurrent &&
			xTopOther + xHeightOther > xTopCurrent
		) {
			if (isPlayer) {
				let leftPlayerDistance = Math.abs(
					xLeftCurrent - (xLeftOther + xWidthOther)
				);
				let rightPlayerDistance = Math.abs(
					xLeftOther - (xLeftCurrent + xWidthCurrent)
				);

				if (
					rightPlayerDistance < leftPlayerDistance &&
					this.currentState == 'kickRight'
				) {
					return 100;
				}
				if (
					rightPlayerDistance > leftPlayerDistance &&
					this.currentState == 'kickLeft'
				) {
					return -100;
				}
			}
		} else {
			return false;
		}
	};
}

export { Bike };
