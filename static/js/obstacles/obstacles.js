class Obstacle {
	obstacleAssets = async (obstacleName) => {
		const link = `https://roadrash-api.herokuapp.com/getAssets/${obstacleName}`;
		let value = await fetch(link);
		return value.json();
	};
}

export { Obstacle };
