import { Player } from './Bikes/player.js';
import { Police } from './Bikes/police.js';
import { Cars } from './obstacles/cars.js';
import { Farms } from './obstacles/farms.js';
import { Trees } from './obstacles/tree.js';

import { fullScreenUtil } from './utils.js';
import { Projection } from './math.js';

class RoadRash {
	constructor(id, playerColor) {
		this.id = id;
		this.playerColor = playerColor;

		this.player = new Player();
		this.police = new Police();
		this.cars = new Cars();
		this.farms = new Farms();
		this.trees = new Trees();
	}
	/**
	 *  Loading all the assets of the game.
	 * @param {boolean}autoStartGame - Status that auto starts the game after loading if true
	 * */
	loadAssets = async (autoStartGame = true) => {
		let playerList, policeList, carsList, farmList, treeList;

		try {
			playerList = await this.player.playerAsset();
			policeList = await this.police.policeAsset();

			carsList = await this.cars.carAssets();
			farmList = await this.farms.farmAssets();
			treeList = await this.trees.treeAssets();
		} catch {
			console.log('Error Loading Assets');
		}

		try {
			this.playerAsset = await this.assetsLoad(playerList);
			this.policeAsset = await this.assetsLoad(policeList);

			this.carAsset = await this.assetsLoad(carsList);
			this.farmAsset = await this.assetsLoad(farmList);
			this.treeAsset = await this.assetsLoad(treeList);
		} catch {
			console.log('Error loading assets images');
		}

		try {
			let bikeColorConsist = await this.player.playerBike(this.playerColor);
			this.playerBike = await this.assetsLoad(bikeColorConsist, false);
			this.playerBike = this.playerBike[0];
		} catch {
			this.playerBike = this.playerAsset[0];
		}

		/**
		 * After fetching assets start the game
		 */
		if (autoStartGame) this.start();
	};

	/**
	 *
	 * @param {array} list
	 * @param {boolean} array
	 * @returns array of new elements created
	 */
	assetsLoad = async (list, array = true) => {
		let listOfElement = [];
		if (array) {
			for (let objectIndex in list) {
				for (let arrayIndex in list[objectIndex]) {
					listOfElement.push(
						await this.createElement(list[objectIndex][arrayIndex])
					);
				}
			}
		} else {
			for (let objectIndex in list) {
				listOfElement.push(await this.createElement(list[objectIndex]));
			}
		}
		return listOfElement;
	};

	/**
	 *
	 * @param {string} url
	 * @returns promise of new image object using that url
	 */
	createElement = (url) => {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.src = url;
			img.onload = () => {
				resolve(img);
			};
		});
	};

	createRoad = () => {};

	start = () => {
		const FRAMES = 60;
		const SECOND = 1000;
		const FPS = SECOND / FRAMES;
		this.canvas = document.getElementById(this.id);

		this.canvas.width = parseInt(window.innerWidth);
		this.canvas.height = parseInt(window.innerHeight);

		document.addEventListener('keypress', fullScreenUtil);

		this.context = this.canvas.getContext('2d');

		this.gameInterval = setInterval(this.updateGameArea(), FPS);
	};

	/**
	 * Clear canvas
	 */
	clear = () => {
		this.context.clearRect(
			0,
			0,
			this.canvas.clientWidth,
			this.canvas.clientHeight
		);
	};

	updateGameArea = () => {
		this.clear();
		this.player = this.player.renderBike(
			this.canvas,
			this.context,
			this.playerBike
		);
	};
}

let newGame = new RoadRash('root', 'red');
newGame.loadAssets();
