import { MathImplement } from './math.js';

class Road {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.math = new MathImplement();

		/**
		 * Initial viewpoints representing the 4 corner of the roads
		 */
		this.p1 = [-this.width / 2, this.height, 0];
		this.p2 = [this.width, this.height, 0];
		this.p3 = [-this.width / 2, 20, 50];
		this.p4 = [this.width, 20, 50];
	}

	/**
	 * Function that generates points using fixed endpoints in three dimensions
	 * @param {Number} numberOfPartition - Number of partition that can be used to generate the points for the plots
	 * @param {Array<String>} transfromingDimensions - gets the dimensions of the coordinates to be transformed. Default value ['x']
	 * @returns Points that can be plotted directly and can also be used to detect collisions as a promise
	 */
	threeDimensionalPoints = async (
		numberOfPartition,
		transfromingDimensions = ['x']
	) => {
		let controlPoint1 = this.transformingCoordinates(
			this.math.sectionFormula(this.p1, this.p3, 1, 2),
			transfromingDimensions
		);
		let controlPoint2 = this.transformingCoordinates(
			this.math.sectionFormula(this.p1, this.p3, 2, 1),
			transfromingDimensions
		);

		let points = await this.math.beziersCurve(
			this.p1,
			controlPoint1,
			controlPoint2,
			this.p3,
			numberOfPartition
		);
		return points;
	};

	/**
	 * Transfrom coordinates of given points of given dimensions
	 * @param {Array<Number>} points - Points to be transformed
	 * @param {Array<String|Number>} dimFact - List of dimensions to be transformed or Factors to be translated if random is given false
	 * @param {Boolean} random - Condition that translates in random manner if it is true. Default value is true.
	 * @returns Transformed Coordinates in random manner
	 */
	transformingCoordinates = (points, dimFact, random = true) => {
		const dimension = {
			x: 0,
			y: 1,
			z: 2,
		};
		let pointsCopy = [...points];
		if (random) {
			// Randomly translate
			dimFact.forEach((value) => {
				let translate = this.math.generateRandomNumber(-this.width, this.width);
				pointsCopy[dimension[value]] = pointsCopy[dimension[value]] + translate;
			});
		} else {
			// Translate using certain factors
			dimFact.forEach((value, index) => {
				pointsCopy[index] = pointsCopy[index] + value;
			});
		}
		return pointsCopy;
	};

	/**
	 * Generate the rightside boundary of the the road
	 * @param {Array<Number>} leftCoordinates - Array of left coordinates generated
	 * @returns Array of rightside boundary coordinates
	 */
	generateRightBoundary = (leftCoordinates) => {
		let rightCoordinates = [];

		leftCoordinates.forEach((value) => {
			let x, remaining;

			[x, ...remaining] = value;
			rightCoordinates.push([x + this.width, ...remaining]);
		});

		return rightCoordinates;
	};

	/**
	 * Generate `N` number of Roads
	 * @param {Number} n - Number of variety of roads to be formed
	 * @param {Number} numberOfPartition - Number of points to be generated in said coordinates
	 * @returns Array of both left and right side boundary of roads
	 */
	generateNVarietyOfRoads = async (n, numberOfPartition) => {
		let arrayOfRoads = [];
		let lCords = [];
		let rCords = [];
		for (let i = 0; i < n; i++) {
			let leftCoordinates = await this.threeDimensionalPoints(
				numberOfPartition
			);
			let rightCoordinates = this.generateRightBoundary(leftCoordinates);

			if (lCords != 0) {
				leftCoordinates = this.translateSectionCoordinates(
					leftCoordinates,
					lCords[lCords.length - 1]
				);
			}
			if (rCords != 0) {
				rightCoordinates = this.translateSectionCoordinates(
					rightCoordinates,
					rCords[rCords.length - 1]
				);
			}

			lCords = [...lCords, ...leftCoordinates];
			rCords = [...rCords, ...rightCoordinates];
		}
		arrayOfRoads = [lCords, rCords];
		return arrayOfRoads;
	};

	/**
	 * Translate left or right section of the road area
	 * @param {Array<Array<Number>>} cords - Current Chords to be transformed
	 * @param {Array<Number>} prev - Last element of previous element to be transformed
	 * @returns Traslated coordinate of the given cords section
	 */
	translateSectionCoordinates = (cords, prev) => {
		let diffCords = [
			prev[0] - cords[0][0],
			prev[1] - cords[0][1],
			prev[2] - cords[0][2],
		];
		let newCords = [];
		cords.forEach((value, index) => {
			if (index != 0) {
				newCords.push(
					this.transformingCoordinates([...value], diffCords, false)
				);
			}
		});
		return newCords;
	};

	generateProjectedCoordinates = async (cords) => {
		let newCords = [];
		cords.forEach((section) => {
			let newSectionCoords = [];
			section.forEach((cordinates) => {
				let x, y, z;
				[x, y, z] = cordinates;
				newSectionCoords.push(
					this.math.perspectiveProjection(
						x,
						y,
						z,
						this.height / this.width,
						60,
						1,
						-1,
						false
					)
				);
			});
			newCords.push(newSectionCoords);
		});
		return newCords;
	};
}

export { Road };
