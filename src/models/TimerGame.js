import { Game } from "./Game";

export class TimerGame extends Game {
	constructor(timer) {
		super()
		this.time_state.timer = time_to_ms(timer)
	}

	init() {
		for (let x_idx = 0; x_idx < ROWS; ++x_idx)
			super.init()
	}

	start(user_msg, e_timer) {
		update_user(user_msg)
		this.time_state.current_interval = setInterval(function keep_current_nrem_time() {
			this.time_state.current_time++
			const rem_time = this.time_state.timer - this.time_state.current_time
			e_timer.set_value(ms_to_time(rem_time))
		})
	}

	update_user(msg, is_ended = false) {
		super.update_user(msg)
		const time_played = msg.querySelector("span#time-played")
		if (is_ended)
			time_played.textContent = ms_to_time(this.time_state.timer)
		else
			time_played.textContent = ms_to_time(this.time_state.current_time)

	}

	end_game() {
		const { current_time, timer } = this.time_state
		return timer > 0 && timer == current_time
	}
}
