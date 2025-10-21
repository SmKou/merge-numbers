const gen_colors = (n) => {
	const colors = []
	for (let idx = 0; idx < n; ++idx) {
		const level = Math.floor(idx / 5)
		const base_color = 195 + level * (60 / n)

		let red = 0, green = 0, blue = 0;
		switch (idx % 5) {
			case 1:
				red = base_color
				blue = base_color
				break;
			case 2:
				green = base_color
				break;
			case 3:
				green = base_color
				blue = base_color
				break;
			case 4:
				blue = base_color
				break;
			default:
				red = base_color
		}
		colors.push(`rgb(${red}, ${green}, ${blue})`)
	}
	return colors
}

export const styles = {
	colors: gen_colors
}

export const convert = {
	time_to_ms(time) {
		const [min, sec] = time.split(":");
		const int_min = Number(min) || 0
		const int_sec = Number(sec) || 0
		return int_min * 60 * 1000 + int_sec * 1000
	},
	ms_to_time(ms) {
		const min = Math.floor(ms / (1000 * 60)) || "00"
		const sec = Math.floor(ms % (1000 * 60) / 1000) || "00"
		return `${min}:${sec}`
	}
}

const get_cvs = (e) => e.querySelector("canvas")

const draw_start = (btn) => {
	const cvs = get_cvs(btn)
	cvs.width = 20
	cvs.height = 20
	const ctx = cvs.getContext("2d")
	ctx.beginPath()
	ctx.moveTo(2, 0)
	ctx.lineTo(20, 10)
	ctx.lineTo(2, 20)
	ctx.closePath()
	ctx.fillStyle = "#000"
	ctx.fill()
}

const draw_pause = (btn) => {
	const cvs = get_cvs(btn)
	cvs.width = 20
	cvs.height = 20
	const ctx = cvs.getContext("2d")
	ctx.fillStyle = "#000"
	ctx.fillRect(2, 2, 6, 18)
	ctx.fillRect(10, 2, 6, 18)
}

const draw_stop = (btn) => {
	const cvs = get_cvs(btn)
	cvs.width = 20
	cvs.height = 20
	const ctx = cvs.getContext("2d")
	ctx.fillStyle = "#000"
	ctx.fillRect(2, 3, 16, 16)
}

export default {
	start: draw_start,
	pause: draw_pause,
	stop: draw_stop
}
