class Projection {
	/**
	 * The constructor function is a function that is called when an object is created.
	 * @param {Number} x - The x coordinate of the point.
	 * @param {Number} y - The y-coordinate of the point.
	 * @param {Number} z - The z-index of the object.
	 */
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Calculate the perspective projection of the points given
	 * @param {Number} aspectRatio - Aspect Ratio of the view window
	 * @param {Number} angleOfViewing - FOV angle of the game
	 * @param {Number} zmax - Maximum value to display
	 * @param {Number} zmin - Minimum value to display
	 */
	perspectiveProjection = (aspectRatio, angleOfViewing, zmax, zmin) => {
		const PI = 3.14159;
		let fov = 1 / Math.tan(angleOfViewing * (PI / 180));
		let x = aspectRatio * fov * this.x;
		let y = fov * this.y;
		let z = (zmax / (zmax - zmin)) * this.z - (zmax / (zmax - zmin)) * zmin;
		let w = this.z;

		return { x, y, z, w };
	};
}

export { Projection };
