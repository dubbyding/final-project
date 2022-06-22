const fullScreenUtil = async (canvas) => {
	try {
		if (canvas.requestFullscreen) await canvas.requestFullscreen();
		else if (canvas.webkitRequestFullscreen)
			await canvas.webkitRequestFullscreen();
		else if (canvas.msRequestFullscreen) await canvas.msRequestFullscreen();
	} catch {
		console.log('Error Running Full Screen');
	}
};

export { fullScreenUtil };
