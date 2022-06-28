class Obstacle {
	/**
	 * @desc Get Obstacle data
	 * @param {String} obstacleName
	 * @returns Object of list of requested obstacles
	 */
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
