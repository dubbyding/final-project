import { MathImplement } from './math.js';
import { createPath } from './utils.js';

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

		/**
		 * Background Image Positions
		 */
		this.backgroundImagePositions = {
			sky: {
				top: 22,
				left: 4,
				width: 1024,
				height: 64,
			},
			mountain: {
				top: 22,
				left: 76,
				width: 1024,
				height: 64,
			},
		};
	}

	/**
	 * Function that fetches background assets from backend
	 * @returns {JSON} Object of background asset
	 */
	getBackgroundImage = async () => {
		try {
			const link = `http://localhost:3000/getAssets/backgroundImage`;
			let value = await fetch(link);
			return value.json();
		} catch {
			const link = `https://roadrash-api.herokuapp.com/getAssets/backgroundImage`;
			let value = await fetch(link);
			return value.json();
		}
	};

	/**
	 * @desc Function that generates points using fixed endpoints in three dimensions
	 * @param {Number} numberOfPartition - Number of partition that can be used to generate the points for the plots
	 * @param {Array<String>} transfromingDimensions - gets the dimensions of the coordinates to be transformed. Default value ['x']
	 * @returns {Array} Points that can be plotted directly and can also be used to detect collisions as a promise
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
	 * @desc Transfrom coordinates of given points of given dimensions
	 * @param {Array<Number>} points - Points to be transformed
	 * @param {Array<String|Number>} dimFact - List of dimensions to be transformed or Factors to be translated if random is given false
	 * @param {Boolean} random - Condition that translates in random manner if it is true. Default value is true.
	 * @returns {Array} Transformed Coordinates in random manner
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
	 * @desc Generate the rightside boundary of the the road
	 * @param {Array<Number>} leftCoordinates - Array of left coordinates generated
	 * @returns {Array} Array of rightside boundary coordinates
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
	 * @desc Generate `N` number of Roads
	 * @param {Number} n - Number of variety of roads to be formed
	 * @param {Number} numberOfPartition - Number of points to be generated in said coordinates
	 * @returns {Array} Array of both left and right side boundary of roads
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
	 * @desc Translate left or right section of the road area
	 * @param {Array<Array<Number>>} cords - Current Chords to be transformed
	 * @param {Array<Number>} prev - Last element of previous element to be transformed
	 * @returns {Array<Number>}Traslated coordinate of the given cords section
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

	/**
	 * @desc Generate Projected coordinates from original Coordinates
	 * @param {Array} cords - 3d Coordinates
	 * @param {Boolean} zaxis - This is true if zaxis is required in projected coordinates. This is true on default
	 * @returns {Array} Projected coordinates
	 */
	generateProjectedCoordinates = async (cords, zaxis = false) => {
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
						zaxis
					)
				);
			});
			newCords.push(newSectionCoords);
		});
		return newCords;
	};

	/**
	 * Display Background Image
	 * @param {Object} ctx - Context of the canvas
	 * @param {Array} newleftCoordinates - Newly generated projected left side of the road
	 * @param {Number} leftDiffX - Factor by which left-side of the road should be translated
	 * @param {Object} backgroundImage - Image object of background image
	 */
	backgroundImageAdd = (
		ctx,
		newleftCoordinates,
		leftDiffX,
		backgroundImage
	) => {
		let transfromFactor =
			newleftCoordinates[newleftCoordinates.length - 1][0] + leftDiffX;

		ctx.drawImage(
			backgroundImage[0],
			this.backgroundImagePositions['sky'].top,
			this.backgroundImagePositions['sky'].left,
			this.backgroundImagePositions['sky'].width - transfromFactor,
			this.backgroundImagePositions['sky'].height,
			0,
			0,
			window.innerWidth,
			this.backgroundImagePositions['sky'].height
		);
		ctx.drawImage(
			backgroundImage[0],
			this.backgroundImagePositions['mountain'].top,
			this.backgroundImagePositions['mountain'].left,
			this.backgroundImagePositions['mountain'].width - transfromFactor,
			this.backgroundImagePositions['mountain'].height,
			0,
			this.backgroundImagePositions['sky'].height,
			window.innerWidth,
			this.backgroundImagePositions['mountain'].height * 2
		);
	};

	/**
	 * @desc Generates Roads
	 * @param {Object} ctx - Context of the canvas
	 * @param {Array} newleftCoordinates - Newly generated projected left side of the road
	 * @param {Array} newrightCoordinates - Newly generated Projected rightside of the road
	 * @param {Number} rightDiffX - Factor by which right-side of the road should be translated
	 * @param {Number} rightDiffY - Factor by which road should be scaled
	 * @param {Number} leftDiffX - Factor by which left-side of the road should be translated
	 * @param {Number} index - Current index
	
	 * @returns {Array} Array of x-coordinates of both left and right side
	 */
	roadGenerate = (
		ctx,
		newleftCoordinates,
		newrightCoordinates,
		rightDiffX,
		rightDiffY,
		leftDiffX,
		index
	) => {
		let xleft = [];
		let xright = [];

		for (let i = 0; i < 9; i++) {
			let xleft1, yleft1, xleft2, yleft2, xright1, yright1, xright2, yright2;

			[xright1, yright1] = newrightCoordinates[i];
			[xright2, yright2] = newrightCoordinates[i + 1];

			xright.push(xright1 + rightDiffX);

			createPath(
				xright1 + rightDiffX,
				yright1 * rightDiffY,
				xright2 + rightDiffX,
				yright2 * rightDiffY,
				'#000000',
				10,
				[Math.round(index) % 100],
				ctx
			);

			[xleft1, yleft1] = newleftCoordinates[i];
			[xleft2, yleft2] = newleftCoordinates[i + 1];

			xleft.push(xleft1 + leftDiffX);

			createPath(
				xleft1 + leftDiffX,
				yleft1 * rightDiffY,
				xleft2 + leftDiffX,
				yleft2 * rightDiffY,
				'#000000',
				10,
				[Math.round(index) % 100],
				ctx
			);
		}
		return [xleft, xright];
	};

	/**
	 * @desc This function colors the road
	 * @param {Object} ctx - Context of the canvas
	 * @param {Array} newleftCoordinates - Newly generated projected left side of the road
	 * @param {Array} newrightCoordinates - Newly generated Projected rightside of the road
	 * @param {Number} rightDiffX - Factor by which right-side of the road should be translated
	 * @param {Number} rightDiffY - Factor by which road should be scaled
	 * @param {Number} leftDiffX - Factor by which left-side of the road should be translate
	 */
	colorRoad = (
		ctx,
		newrightCoordinates,
		newleftCoordinates,
		rightDiffX,
		rightDiffY,
		leftDiffX
	) => {
		let x1, y1, x2, y2;
		ctx.beginPath();
		ctx.lineWidth = 0;
		ctx.setLineDash([]);
		ctx.fillStyle = '#47484c';

		[x1, y1] = newrightCoordinates[0];
		[x2, y2] = newrightCoordinates[newrightCoordinates.length - 1];

		ctx.moveTo(x1 + rightDiffX, y1 * rightDiffY);
		ctx.lineTo(x2 + rightDiffX, y2 * rightDiffY);

		[x2, y2] = newleftCoordinates[newleftCoordinates.length - 1];

		ctx.lineTo(x2 + leftDiffX, y2 * rightDiffY);

		[x2, y2] = newleftCoordinates[0];
		ctx.lineTo(x2 + leftDiffX, y2 * rightDiffY);
		ctx.lineTo(x1 + rightDiffX, y1 * rightDiffY);

		ctx.fill();
		ctx.closePath();
	};

	/**
	 * @desc This function creates the side lines of the road
	 * @param {Object} ctx - Context of the canvas
	 * @param {Array} newleftCoordinates - Newly generated projected left side of the road
	 * @param {Array} newrightCoordinates - Newly generated Projected rightside of the road
	 * @param {Number} rightDiffX - Factor by which right-side of the road should be translated
	 * @param {Number} rightDiffY - Factor by which road should be scaled
	 * @param {Number} leftDiffX - Factor by which left-side of the road should be translated
	 * @param {Number} index - Current index
	 */
	sideRoadLines = (
		ctx,
		newleftCoordinates,
		newrightCoordinates,
		rightDiffX,
		rightDiffY,
		leftDiffX,
		index
	) => {
		let x1, y1, x2, y2, startingX, startingY, endingX, endingY;

		[x1, y1] = newleftCoordinates[0];
		[x2, y2] = newrightCoordinates[0];

		[startingX, startingY] = this.math.sectionFormula(
			[x1 + leftDiffX, y1 * rightDiffY],
			[x2 + rightDiffX, y2 * rightDiffY],
			2,
			1
		);

		[x1, y1] = newleftCoordinates[newleftCoordinates.length - 1];
		[x2, y2] = newrightCoordinates[newrightCoordinates.length - 1];

		[endingX, endingY] = this.math.sectionFormula(
			[x1 + leftDiffX, y1 * rightDiffY],
			[x2 + rightDiffX, y2 * rightDiffY],
			2,
			1
		);

		createPath(
			startingX,
			startingY,
			endingX,
			endingY,
			'#000000',
			10,
			[Math.round(index) % 100],
			ctx
		);

		[x1, y1] = newleftCoordinates[0];
		[x2, y2] = newrightCoordinates[0];

		[startingX, startingY] = this.math.sectionFormula(
			[x1 + leftDiffX, y1 * rightDiffY],
			[x2 + rightDiffX, y2 * rightDiffY],
			1,
			2
		);

		[x1, y1] = newleftCoordinates[newleftCoordinates.length - 1];
		[x2, y2] = newrightCoordinates[newrightCoordinates.length - 1];

		[endingX, endingY] = this.math.sectionFormula(
			[x1 + leftDiffX, y1 * rightDiffY],
			[x2 + rightDiffX, y2 * rightDiffY],
			1,
			2
		);

		createPath(
			startingX,
			startingY,
			endingX,
			endingY,
			'#000000',
			10,
			[Math.round(index) % 100],
			ctx
		);
	};
	createFinishLine = (
		ctx,
		newleftCoordinates,
		newrightCoordinates,
		rightDiffX,
		rightDiffY,
		leftDiffX
	) => {
		if (!this.lineIndex) {
			this.lineIndex = 9;
		}
		if (this.lineIndex >= 0) {
			let x1, y1, x2, y2;

			[x1, y1] = newleftCoordinates[Math.round(this.lineIndex)];
			[x2, y2] = newrightCoordinates[Math.round(this.lineIndex)];

			createPath(
				x1 + leftDiffX,
				y1 * rightDiffY,
				x2 + rightDiffX,
				y2 * rightDiffY,
				'#FF0000',
				10,
				[20],
				ctx
			);
			this.lineIndex -= 0.1;
		}
	};
}

export { Road };
