/**
 * It fetches an image from an API, and then draws it to the canvas
 * */
class StartingPage {
	constructor() {
		this.localLink = 'http://localhost:3000/getAssets/startingImage';
		this.globalLink =
			'https://roadrash-api.herokuapp.com/getAssets/startingImage';
	}

	/**
	 * @desc get Image from API
	 */
	getImage = async () => {
		let value;
		try {
			value = await fetch(this.localLink);
			value = await value.json();
		} catch {
			value = await fetch(this.globalLink);
			value = await value.json();
		}

		this.startImage = value['img'];
	};

	/**
	 * @desc Create starting image asset as new image
	 * @returns {Object} New DOM Starting image object
	 */
	createStartingAsset = async () => {
		this.startingImage = new Image();
		this.startingImage.src = this.startImage;
		this.startingImage.style.width = window.innerWidth;
		this.startingImage.style.height = window.innerHeight;

		this.startingImage.onload = () => {
			return this.startingImage;
		};
	};

	/**
	 * Draw the starting image
	 * @param {Object} ctx - Context of the canvas
	 */
	drawImageBackground = (ctx) => {
		ctx.drawImage(
			this.startingImage,
			0,
			0,
			window.innerWidth,
			window.innerHeight,
			250,
			0,
			window.innerWidth,
			window.innerHeight
		);
	};
}

export { StartingPage };
