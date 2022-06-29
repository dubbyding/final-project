class Score {
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
