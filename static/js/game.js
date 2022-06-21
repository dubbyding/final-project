import { Player } from './Bikes/player.js';
import { Police } from './Bikes/police.js';
import { Cars } from './obstacles/cars.js';
import { Farms } from './obstacles/farms.js';
import { Trees } from './obstacles/tree.js';

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
	loadAssets = async () => {
		let playerList, policeList, carsList, farmList, treeList;

		let playerAsset, policeAsset, carAsset, farmAsset, treeAsset;

		let playerBike;

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
			playerAsset = await this.assetsLoad(playerList);
			policeAsset = await this.assetsLoad(policeList);

			carAsset = await this.assetsLoad(carsList);
			farmAsset = await this.assetsLoad(farmList);
			treeAsset = await this.assetsLoad(treeList);
		} catch {
			console.log('Error loading assets images');
		}

		try {
			let bikeColorConsist = await this.player.checkBikeColor(this.playerColor);
			playerBike = await this.assetsLoad(bikeColorConsist, false);
			playerBike = playerBike[0];
		} catch {
			playerBike = playerAsset[0];
		}
		return;
	};
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
	createElement = (url) => {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.src = url;
			img.onload = () => {
				resolve(img);
			};
		});
	};
	start = () => {
		this.canvas = document.getElementById(this.id);
		this.context = this.canvas.getContext('2d');
	};
	clear = () => {
		this.context.clearRect(
			0,
			0,
			this.canvas.clientWidth,
			this.canvas.clientHeight
		);
	};
}

let newGame = new RoadRash('root', 'red');
newGame.loadAssets();
