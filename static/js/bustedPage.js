class BustedPage {
	constructor() {
		this.localLink = 'http://localhost:3000/getAssets/bustedImage';
		this.globalLink =
			'https://roadrash-api.herokuapp.com/getAssets/bustedImage';
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

	createBustedAsset = async () => {
		this.bustedImage = new Image();
		this.bustedImage.src = this.startImage;
		this.bustedImage.style.width = window.innerWidth;
		this.bustedImage.style.height = window.innerHeight;

		this.bustedImage.onload = () => {
			return this.bustedImage;
		};
	};

	drawImageBackground = (ctx) => {
		ctx.drawImage(
			this.bustedImage,
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

export { BustedPage };
