import { ms_to_time } from "./Game"

export class RisingRowsGame extends Game {
	constructor() {
		super()
	}

	init() {
		super.init()
	}

	start(user_msg) {
		const { current_interval, current_time } = this.time_state
		const time = !current_interval && current_time
		? RISE_INTERVAL - current_time
		: RISE_INTERVAL
		this.time_state.interval = setInterval(function raise_rows() {
			if (!end_game()) {
				add_row()
				move_up_rows()
			}
			else {
				update_user(user_msg, true)
				clear_intervals()
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

	end_game() {
		const { cells } = this.game_state
		return cells.length >= ROWS - 1
	}
}
