export class RisingRowsGame extends Game {
	constructor() {
		super()
	}

	start() {}

	end_game() {
		const { cells } = this.game_state
		return cells.length >= ROWS - 1
	}
}
