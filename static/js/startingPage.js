class StartingPage {
	constructor() {
		this.localLink = 'http://localhost:3000/getAssets/startingImage';
		this.globalLink =
			'https://roadrash-api.herokuapp.com/getAssets/startingImage';
	}

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

	createStartingAsset = () => {
		this.startingImage = new Image();
		this.startingImage.src = this.startImage;
		this.startingImage.style.width = window.innerWidth;
		this.startingImage.style.height = window.innerHeight;

		this.startingImage.onload = () => {
			return this.startingImage;
		};
	};

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
