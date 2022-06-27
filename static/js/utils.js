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
export { createPath, getCurrentCoords };
