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

export { createPath };
