export class Timer {
	static time_to_ms([min, sec]) {
		const int_min = Number(min) || 0
		const int_sec = Number(sec) || 0
		return int_min * 60 * 1000 + int_sec * 1000
	}

	static ms_to_time(ms) {
		const min = Math.floor(ms / (1000 * 60))
		const sec = Math.floor(ms % (1000 * 60) / 1000)
		const pad_sec = !sec
			? "00"
			: sec < 10
			? "0" + sec
			: sec
		return [min || "00", pad_sec]
	}

	constructor(e_timer) {
		this.minutes = e_timer.$("minutes")
		this._m = this.minutes.value
		this.minutes.disabled = true
		this.seconds = e_timer.$("seconds")
		this._s = this.seconds.value
		this.seconds.disabled = true
		this._ms = time_to_ms([this._m, this._s])
		const changed = (() => {
			let change = false
			let min = () => this._m
			let sec = () => this._s
			return (idx, value) => {
				const current = [min(), sec()]
				if (!value)
					change = false
				else if (value != current[idx]) {
					change = true
					if (idx)
						this._s = value
					else
						this._m = value
				}
				return change
			}
		})()
		e_timer.addEventListener("change", () => {
			if (changed(0, minutes.value) || changed(1, seconds.value))
				this._ms = time_to_ms([this._m, this._s])
			changed()
		})
	}

	is_active() {
		return Boolean(this._ms)
	}

	tog_user_access(is_playing) {
		this.minutes.disabled = is_playing
		this.seconds.disabled = is_playing
	}

	update_display(current_time) {
		const rem = this._ms - current_time
		const [min, sec] = ms_to_time(rem)
		this.minutes.value = min
		this.seconds.value = sec
	}

	end_ms() {
		return this._ms
	}

	end() {
		return `${this._m}:${this._s}`
	}
}
