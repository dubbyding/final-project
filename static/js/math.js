class Math {
	/**
	 * Calculate the perspective projection of the points given
	 * @param {Number} x - The x coordinate of the point.
	 * @param {Number} y - The y-coordinate of the point.
	 * @param {Number} z - The z-index of the object.
	 * @param {Number} aspectRatio - Aspect Ratio of the view window
	 * @param {Number} angleOfViewing - FOV angle of the game
	 * @param {Number} zmax - Maximum value to display
	 * @param {Number} zmin - Minimum value to display
	 * @returns Projected coordinates of the given points
	 */
	perspectiveProjection = (
		x,
		y,
		z,
		aspectRatio,
		angleOfViewing,
		zmax,
		zmin
	) => {
		const PI = 3.14159;
		let fov = 1 / Math.tan(angleOfViewing * (PI / 180));
		let w = z;
		let xnew = (aspectRatio * fov * x) / w;
		let ynew = (fov * y) / w;
		let znew = ((zmax / (zmax - zmin)) * z - (zmax / (zmax - zmin)) * zmin) / w;

		return { xnew, ynew, znew, w };
	};

	/**
	 * Calculates the beziers curve using the given control points
	 * @param {Array} p1 - Starting point of the curve
	 * @param {Array} p2 - Control point of the curve
	 * @param {Array} p3 - Control point of the curve
	 * @param {Array} p4 - Ending point of the curve
	 * @param {Number} u - Float value of increment number which increases the value of from 0-1
	 */
	beziersCurve = async (p1, p2, p3, p4, u) => {
		let curvePoints = [];
		for (let i = 0; i <= 1; i += u) {
			let newPoints = this.beziersCalculation(p1, p2, p3, p4, i);
			curvePoints.push(newPoints);
		}
		return curvePoints;
	};

	/**
	 * Calculating the beziers curve using the given control points.
	 * @param {Array} p1 - Starting point of the curve
	 * @param {Array} p2 - Control point of the curve
	 * @param {Array} p3 - Control point of the curve
	 * @param {Array} p4 - Ending point of the curve
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
	 * @param {Int8Array} p1 - Array of points of any shape
	 * @param {Int8Array} p2 - Array of points of same shape as p1
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
				newPoints.push((m * p2[index] + n * p1[index]) / (m + n));
			});
			return newPoints;
		}
	};
}

export { Math };
