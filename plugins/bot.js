class bot {
	constructor() {
		this.ID = 0;
		this.name = 'Bingo'
	}

	generateBot() {
		let colors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
		let randColor = Math.floor(Math.random() * colors.length);

		var playerArr = [
			this.ID,
			this.name,
			45,
			randColor,
			413,
			0,
			0,
			240,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			1,
			2 * 146
		];
		return playerArr.join('|');
	}
	
	sendmsg(msg, client) {
		client.sendXt('sm', -1, this.ID, msg);
	}
}

module.exports = bot;
