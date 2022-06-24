class MathImplement {
	/**
	 * Calculate the perspective projection of the points given
	 * @param {Number} x - The x coordinate of the point.
	 * @param {Number} y - The y-coordinate of the point.
	 * @param {Number} z - The z-index of the object.
	 * @param {Number} aspectRatio - Aspect Ratio of the view window
	 * @param {Number} angleOfViewing - FOV angle of the game
	 * @param {Number} zmax - Maximum value to display
	 * @param {Number} zmin - Minimum value to display
	 * @param {Boolean} requireZ - Check if Boolean value is needed to be displayed. Default value:- True
	 * @returns Projected coordinates of the given points
	 */
	perspectiveProjection = (
		x,
		y,
		z,
		aspectRatio,
		angleOfViewing,
		zmax,
		zmin,
		requireZ = true
	) => {
		const PI = 3.14159;
		let fov = 1 / Math.tan(angleOfViewing * (PI / 180));
		let xnew = aspectRatio * fov * x;
		let ynew = fov * y;
		let znew = (zmax / (zmax - zmin)) * z - (zmax / (zmax - zmin)) * zmin;
		let w = z;
		if (w != 0) {
			xnew /= w;
			ynew /= w;
			znew /= w;
		}
		if (requireZ) return [xnew, ynew, znew];
		else return [xnew, ynew];
	};

	/**
	 * Calculates the beziers curve using the given control points
	 * @param {Array<Number>} p1 - Starting point of the curve
	 * @param {Array<Number>} p2 - Control point of the curve
	 * @param {Array<Number>} p3 - Control point of the curve
	 * @param {Array<Number>} p4 - Ending point of the curve
	 * @param {Number} partitions - Number of partition and points to get
	 * @returns Array of new points
	 */
	beziersCurve = async (p1, p2, p3, p4, partitions) => {
		let curvePoints = [];
		for (let i = partitions; i >= 0; i--) {
			let newPoints = this.beziersCalculation(p1, p2, p3, p4, i / partitions);
			curvePoints.push(newPoints);
		}
		return curvePoints;
	};

	/**
	 * Calculating the beziers curve using the given control points.
	 * @param {Array<Number>} p1 - Starting point of the curve
	 * @param {Array<Number>} p2 - Control point of the curve
	 * @param {Array<Number>} p3 - Control point of the curve
	 * @param {Array<Number>} p4 - Ending point of the curve
	 * @param {Number} u - Float value of increment number which increases the value of from 0-1
	 * @returns Calculation point of bezier point of value `u`
	 * */
	beziersCalculation = (p1, p2, p3, p4, u) => {
		let newPoints = [];
		newPoints.push(
			p1[0] * u * u * u +
				3 * p2[0] * u * u * (1 - u) +
				3 * p3[0] * u * (1 - u) * (1 - u) +
				p4[0] * (1 - u) * (1 - u) * (1 - u)
		);

		newPoints.push(
			p1[1] * u * u * u +
				3 * p2[1] * u * u * (1 - u) +
				3 * p3[1] * u * (1 - u) * (1 - u) +
				p4[1] * (1 - u) * (1 - u) * (1 - u)
		);
		newPoints.push(
			p1[2] * u * u * u +
				3 * p2[2] * u * u * (1 - u) +
				3 * p3[2] * u * (1 - u) * (1 - u) +
				p4[2] * (1 - u) * (1 - u) * (1 - u)
		);
		return newPoints;
	};

	/**
	 *  This is a function which is used to calculate the section formula.
	 *
	 *	Note:- Shape of p1 and p2 must be the same.
	 * @param {Array<Number>} p1 - Array of points of any shape
	 * @param {Array<Number>} p2 - Array of points of same shape as p1
	 * @param {Number} m - Left section of the line
	 * @param {Number} n - Right Section of the line
	 * @returns New points divide by section formula
	 * */
	sectionFormula = (p1, p2, m, n) => {
		if (p1.length != p2.length) {
			throw new Error({
				SizeError: 'The shape of two array must be same',
			});
		} else {
			let newPoints = [];
			p1.forEach((value, index) => {
				let currentValue = (m * p2[index] + n * p1[index]) / (m + n);
				newPoints.push(currentValue);
			});
			return newPoints;
		}
	};

	/**
	 *  Generating a random number between the given range.
	 * @param {Number} min - Minimum value of the range
	 * @param {Number} max - Maximum value of the range
	 * @returns Random Number between given minimum and maximum range
	 * */
	generateRandomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
}

export { MathImplement };
