class Obstacle {
	obstacleAssets = async (obstacleName) => {
		const link = `http://localhost:3000/getAssets/${obstacleName}`;
		let value = await fetch(link);
		return value.json();
	};
}

export { Obstacle };
