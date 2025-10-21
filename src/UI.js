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
