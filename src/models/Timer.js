export class Timer {
	static time_to_ms(time) {
		const [min, sec] = time.split(":");
		const int_min = Number(min) || 0
		const int_sec = Number(sec) || 0
		return int_min * 60 * 1000 + int_sec * 1000
	}

	static ms_to_time(ms) {
		const min = Math.floor(ms / (1000 * 60)) || "00"
		const sec = Math.floor(ms % (1000 * 60) / 1000) || "00"
		return `${min}:${sec}`
	}

	constructor(e_timer) {
		const minutes = e_timer.$("minutes")
		minutes.disabled = true
		const seconds = e_timer.$("seconds")
		seconds.disabled = true
		e_timer.addEventListener("change", () => {
			if (!Number(minutes.value) && !Number(seconds.value))
				this.active = false

		})
	}

	set_value(formatted_time) {
		const [min, sec] = formatted_time.split(":")
		this.minutes.set(min)
		this.seconds.set(sec)
	}

	tog_user_access(is_playing) {
		this.minutes.$().disabled = is_playing
		this.seconds.$().disabled = is_playing
	}
}
