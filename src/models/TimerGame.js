import { Game } from "./Game";

export const time_to_ms = ([min, sec]) => {
	const int_min = Number(min) || 0
	const int_sec = Number(sec) || 0
	return int_min * 60 * 1000 + int_sec * 1000
}

export const ms_to_time = (ms) => {
	const min = Math.floor(ms / (1000 * 60))
	const sec = Math.floor(ms % (1000 * 60) / 1000)
	const pad_sec = !sec
		? "00"
		: sec < 10
		? "0" + sec
		: sec
	return [min || "00", pad_sec]
}

export class TimerGame extends Game {
	constructor(e_timer) {
		super()
		this.minutes = e_timer.$("minutes")
		this._m = this.minutes.value
		this.seconds = e_timer.$("seconds")
		this._s = this.seconds.value
		this._ms = time_to_ms([this._m, this._s])
		this.tog_user_access(true)
		e_timer.addEventListener("change", () => {
			const is_m_diff = ((t) => {
				if (t != this._m) {
					this._m = t
					return true
				}
				return false
			})(this.minutes.value)
			const is_s_diff = ((t) => {
				if (t != this._s) {
					this._s = t
					return true
				}
				return false
			})(this.seconds.value)
			if (is_m_diff || is_s_diff)
				this._ms = time_to_ms([this._m, this._s])

		})
	}

	init() {
		for (let x_idx = 0; x_idx < ROWS; ++x_idx)
			super.init()
	}

	is_active() {
		return Boolean(this._ms)
	}

	tog_user_access(is_playing) {
		this.minutes.disabled = is_playing
		this.seconds.disabled = is_playing
	}

	start(user_msg) {
		this.update_user(user_msg)
		this.time_state.current_interval = setInterval(function keep_current_nrem_time() {
			this.time_state.current_time++
			const rem = this._ms - this.time_state.current_time
			const [min, sec] = ms_to_time(rem)
			this.minutes.value = min
			this.seconds.value = sec
			if (this.end_game()) {
				this.update_user(user_msg, true)
				this.clear_intervals()
			}
		})
	}

	update_user(msg, is_ended = false) {
		super.update_user(msg)
		const time_played = msg.querySelector("span#time-played")
		if (is_ended)
			time_played.textContent = `${this._m}:${this._s}`
		else
			time_played.textContent = ms_to_time(this.time_state.current_time)

	}

	end_game() {
		return this.time_state.current_time == this.timer.end_ms()
	}
}
