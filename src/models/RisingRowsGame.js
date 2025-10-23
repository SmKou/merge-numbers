import { ROWS, RISE_INTERVAL } from "./Game"
import { ms_to_time } from "./TimerGame"

export class RisingRowsGame extends Game {
	constructor() {
		super()
	}

	init() {
		super.init()
		this.game_state.cells[0].forEach(tile => this.activate_tile(tile))
	}

	start(user_msg) {
		const { current_interval, current_time } = this.time_state
		const time = !current_interval && current_time
		? RISE_INTERVAL - current_time
		: RISE_INTERVAL
		this.time_state.interval = setInterval(function raise_rows() {
			if (this.game_state.cells.length >= ROWS - 1) {
				this.add_row()
				this.move_rows()
			}
			else {
				this.update_user(user_msg)
				this.clear_intervals()
			}
		}, time)
		this.time_state.current_interval = setInterval(function keep_current_time() {
			this.time_state.current_time++
		}, 1000)
	}

	update_user(msg) {
		const time_played = msg.querySelector("span#time-played")
		time_played.textContent = ms_to_time(this.time_state.current_time)
	}
}
