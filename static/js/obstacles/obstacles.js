class Obstacle {
	obstacleAssets = async (obstacleName) => {
		try {
			const link = `http://localhost:3000/getAssets/${obstacleName}`;
			let value = await fetch(link);
			return value.json();
		} catch {
			const link = `https://roadrash-api.herokuapp.com/getAssets/${obstacleName}`;
			let value = await fetch(link);
			return value.json();
		}
	};
}

export { Obstacle };
