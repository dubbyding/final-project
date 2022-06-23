import { MathImplement } from './math.js';

class Road {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.math = new MathImplement();

		/**
		 * Initial viewpoints representing the 4 corner of the roads
		 */
		this.p1 = [0, this.height, 0];
		this.p2 = [this.width, this.height, 0];
		this.p3 = [0, 20, 10];
		this.p4 = [this.width, 20, 10];
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
				let translate = this.math.generateRandomNumber(-200, 200);
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
		for (let i = 0; i < n; i++) {
			let leftCoordinates = await this.threeDimensionalPoints(
				numberOfPartition
			);
			let rightCoordinates = this.generateRightBoundary(leftCoordinates);
			arrayOfRoads.push([leftCoordinates, rightCoordinates]);
		}
		return arrayOfRoads;
	};
}

export { Road };
