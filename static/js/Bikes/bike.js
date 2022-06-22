/**
 * @desc Bike class gets the assets of bike and defines the behavior of the bike
 */
class Bike {
	constructor() {
		this.bikeStates = {
			wait: {
				top: -5,
				left: -8,
				width: 45,
				height: 70,
			},
			start: [
				{
					top: -42,
					left: -4,
					width: 31,
					height: 58,
				},
				{
					top: -76,
					left: -4,
					width: 31,
					height: 58,
				},
				{
					top: -133,
					left: -4,
					width: 30,
					height: 58,
				},
				{
					top: -146,
					left: -4,
					width: 30,
					height: 58,
				},
				{
					top: -183,
					left: -7,
					width: 30,
					height: 55,
				},
			],
		};
	}
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
