/**
 * It creates a path between two points
 * @param x1 - The x coordinate of the first point
 * @param y1 - The y coordinate of the start point.
 * @param x2 - The x-coordinate of the end of the line.
 * @param y2 - The y-coordinate of the end point of the line.
 * @param [color=#000000] - The color of the line.
 * @param [lineWidth=1] - The width of the line.
 * @param [dashed] - An array of numbers that specify the length of a dash and the length of a gap. For
 * example, [5, 10] would create a dashed line that has a dash of 5 pixels and a gap of 10 pixels.
 * @param ctx - The canvas context
 */
const createPath = (
	x1,
	y1,
	x2,
	y2,
	color = '#000000',
	lineWidth = 1,
	dashed = [],
	ctx
) => {
	ctx.beginPath();
	ctx.setLineDash(dashed);
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
};

/**
 * Get Current 10 coordinates
 * @param {Number} index - Index of current position
 * @param {Array} roadAssets - Array of all road assets
 * @returns
 */
const getCurrentCoords = (index, roadAssets) => {
	let leftCoordinates, rightCoordinates;
	let currentIndex = Math.round(index);
	[leftCoordinates, rightCoordinates] = roadAssets;
	let initialLeftCoordinates = [...leftCoordinates].slice(0, 10);
	let initialRightCoordinates = [...rightCoordinates].slice(0, 10);
	let newleftCoordinates = [...leftCoordinates].slice(
		currentIndex,
		currentIndex + 10
	);
	let newrightCoordinates = [...rightCoordinates].slice(
		currentIndex,
		currentIndex + 10
	);
	return [
		newleftCoordinates,
		newrightCoordinates,
		initialLeftCoordinates,
		initialRightCoordinates,
	];
};

/**
 * It creates text on the canvas
 * @param ctx - The context of the canvas.
 * @param [font=20px Ariel] - The font of the text.
 * @param [fill=#000000] - The color of the text.
 * @param x - The x coordinate where the text will be placed.
 * @param y - The y-coordinate of the text on the canvas.
 * @param text - The text to be drawn.
 */
const createText = (ctx, font = '20px Ariel', fill = '#000000', x, y, text) => {
	ctx.font = font;
	ctx.fillStyle = fill;
	ctx.fillText(text, x, y);
};

export { createPath, getCurrentCoords, createText };
