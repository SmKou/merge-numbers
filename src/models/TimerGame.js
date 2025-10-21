import { Game, ms_to_time } from "./Game";

export class TimerGame extends Game {
	constructor(timer) {
		super()
		this.time_state.timer = timer
	}

	init() {
		for (let x_idx = 0; x_idx < ROWS; ++x_idx)
			super.init()
	}

	update_user(msg, is_ended = false) {
		super.update_user(msg)
		const time_played = msg.querySelector("span#time-played")
		const time = ms_to_time(this.time_state.current_time)
		if (is_ended)
			time_played.textContent = ms_to_time(this.time_state.timer)

	}

	end_game() {
		const { current_time, timer } = this.time_state
		return timer > 0 && timer == current_time
	}
}
