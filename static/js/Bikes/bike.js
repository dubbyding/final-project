/**
 * @desc Bike class gets the assets of bike and defines the behavior of the bike
 */
class Bike {
	/**
	 * Gets the assets of the bikes
	 * @param {string} type
	 * @returns promise of json list of bike assets
	 */
	bikeAssets = async (type) => {
		const link = `http://localhost:3000/getAssets/bikes/${type}`;
		let value = await fetch(link);
		return value.json();
	};

	checkBikeColor = async (color) => {
		const link = `http://localhost:3000/getAssets/bikes/player/${color}`;
		let value = await fetch(link);
		return value.json();
	};
}

export { Bike };
