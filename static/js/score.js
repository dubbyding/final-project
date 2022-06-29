class Score {
	/**
	 * Get Score from API
	 * @returns {Array.<JSON.<Number>>>} JSON file of list of score
	 */
	getScore = async () => {
		try {
			const link = 'http://localhost:3000/score/getScore';
			let value = await fetch(link);
			return value.json();
		} catch {
			const link = 'https://roadrash-api.herokuapp.com/score/getScore';
			let value = await fetch(link);
			return value.json();
		}
	};

	/**
	 * Set Score to backend using API FETCH
	 * @param {Number} score
	 * @returns {Boolean} True, if posting score was successful else False
	 */

	setScore = async (score) => {
		try {
			const response = await fetch('http://localhost:3000/score/setScore', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					score: score,
				}),
			});
			if (response.status == 200) {
				return true;
			} else {
				return false;
			}
		} catch {
			const response = await fetch(
				'https://roadrash-api.herokuapp.com/score/setScore',
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						score: score,
					}),
				}
			);
			if (response.status == 200) {
				return true;
			} else {
				return false;
			}
		}
	};

	/**
	 * @desc Getting the high score from the score list. It also sorts array.
	 * @param {Array} scoreList - List of scores
	 * @returns {Number} Current HighScore
	 * */
	getHighScore = async (scoreList) => {
		this.currentHighScore = parseInt(scoreList[0]['score']);
		let counter = 0;
		this.scoreArray = [];
		for (let scoreObjectIndex in scoreList) {
			this.scoreArray.push(parseInt(scoreList[scoreObjectIndex]['score']));
			if (
				parseInt(scoreList[scoreObjectIndex]['score']) < this.currentHighScore
			) {
				this.currentHighScore = parseInt(scoreList[scoreObjectIndex]['score']);
			}
			counter++;
		}
		this.scoreArray = this.scoreArray.sort((a, b) => a - b);
		if (counter == scoreList.length) {
			return this.currentHighScore;
		}
	};
}

export { Score };
