import { Game } from "./Game";
import { Timer } from "./Timer";

export class TimerGame extends Game {
	constructor(timer) {
		super()
		this.timer = timer
	}

	init() {
		for (let x_idx = 0; x_idx < ROWS; ++x_idx)
			super.init()
	}

	start(user_msg) {
		this.update_user(user_msg)
		this.time_state.current_interval = setInterval(function keep_current_nrem_time() {
			this.time_state.current_time++
			this.timer.update_display(this.time_state.current_time)
			if (end_game()) {
				this.update_user(user_msg, true)
				this.clear_intervals()
			}
		})
	}

	update_user(msg, is_ended = false) {
		super.update_user(msg)
		const time_played = msg.querySelector("span#time-played")
		if (is_ended)
			time_played.textContent = this.timer.end()
		else
			time_played.textContent = Timer.ms_to_time(this.time_state.current_time)

	}

	end_game() {
		return this.time_state.current_time == this.timer.end_ms()
	}
}
