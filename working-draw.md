Reference: [How to Pull Specific Commit From Git Repository](https://www.delftstack.com/howto/git/git-pull-specific-commit/)

How to create a branch from a specific commit:
1. `git fetch origin`
2. `git checkout -b <branch-name> <commit-id>`

```js
import Konva from 'konva'
import './style.css'

const size = 48
const offset = 16
const gap = 12
const rows = 8
const cols = 6
const width = cols * size + (cols - 1) * gap
const height = rows * size + (rows - 1) * gap

const state = {
	high_num: 5,
	max_num: 10,
	cells: [],
	colors: [],
	layers: {
		cells: new Konva.Layer(),
		moving_tile: new Konva.Layer()
	},
	tile: { x: -1, y: -1 },
	interval: "",
	interval_time: 3600,
	interval_count: 0,
	min_interval: 1200,
	current_time: 0,
	current_interval: "",
	timer: -1
}

for (let idx = 0; idx < state.max_num; ++idx) {
	const level = Math.floor(idx / 5)
	const base_color = 195 + level * (60 / state.max_num)

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
	state.colors.push(`rgb(${red}, ${green}, ${blue})`)
}

const app = document.getElementById('app')
app.style.width = (width + offset * 2) + "px"
app.style.height = (height + offset * 2) + "px"
document.querySelector("nav").style.width = app.style.width

const stage = new Konva.Stage({
	container: 'foreground',
	width,
	height
})
stage.add(state.layers.cells)
stage.add(state.layers.moving_tile)

const add_row = (i = 0, row = []) => {
	const n = Math.floor(Math.random() * state.high_num) + 1
	const rect = new Konva.Rect({
		x: 0,
		y: 0,
		width: size,
		height: size,
		fill: state.colors[n - 1],
		cornerRadius: size * .12
	})
	const text = new Konva.Text({
		x: 0,
		y: 0,
		width: size,
		fill: 'black',
		text: n,
		fontSize: 20,
		align: 'center'
	})
	text.padding((size - text.height()) / 2, 0)

	const tile = new Konva.Group({
		x: size * i + gap * i,
		y: height,
		draggable: true
	})

	tile.on('pointerclick', () => {
		const pos = stage.getPointerPosition()
		const x = Math.floor(pos.x / (size + gap))
		const y = (rows - 1) - Math.floor(pos.y / (size + gap))
		if (state.tile.x < 0) {
			state.tile.x = x
			state.tile.y = y
			state.tile.elm = tile
		}
		else {
			// check if movement is valid: true = move
			// does not move through tile
			// does not end on tile
			// check if tile beneath is same number: true = merge
		}
	})

	tile.on('dragstart', () => {
		const pos = stage.getPointerPosition()
		state.tile.x = Math.floor(pos.x / (size + gap))
		state.tile.y = (rows - 1) - Math.floor(pos.y / (size + gap))
		tile.moveTo(state.layers.moving_tile)
		state.layers.cells.draw()
	})

	tile.on('dragmove', () => {
		// y-lim
		// x-lims

		let full = false, i = state.cells.length - 1
		while (!full && i >= 0) {
			const n = state.cells[i].filter(cell => !cell).length
			if (n > 0)
				i--
			else
				full = true
		}
		const y_lim = full
			? state.cells[i][0].y()
			: height
		tile.y(Math.min(tile.y(), y_lim))
	})

	tile.on('dragend', () => {
		const pos = stage.getPointerPosition()
		const x = Math.floor(pos.x / (size + gap))
		const y = (rows - 1) - Math.floor(pos.y / (size + gap))
		// check if movement is valid: true = move
		// drops into place

		// check if tile beneath is same number: true = merge
		tile.moveTo(state.layers.cells)
		state.layers.cells.draw()
	})

	tile.add(rect)
	tile.add(text)
	row.push(tile)
	state.layers.cells.add(tile)

	if (i < cols)
		add_row(i + 1, row)
	else {
		state.cells.unshift(row)
		move_rows()
	}
}

const move_rows = () => {
	const period = 300
	for (let y = state.cells.length - 1; y >= 0; --y) {
		const dist = y > 0
			? size + gap
			: size
		const speed = dist / period
		const y_orig = state.cells[y][0].y()
		const y_dest = y_orig - dist
		state.cells[y].forEach((cell) => {
			if (!cell) return;
			const anim = new Konva.Animation(frame => {
				cell.y(y_orig - speed * frame.time)
				if (speed * frame.time >= dist) {
					cell.y(y_dest)
					anim.stop()
				}
			}, state.layers.cells)
			anim.start()
		})
	}
}

const time_to_ms = (time) => {
	const [min, sec] = time.split(":");
	const int_min = Number(min) || 0
	const int_sec = Number(sec) || 0
	return int_min * 60 * 1000 + int_sec * 1000
}

const ms_to_time = (ms) => {
	const min = Math.floor(ms / (1000 * 60)) || "00"
	const sec = Math.floor(ms % (1000 * 60) / 1000) || "00"
	return `${min}:${sec}`
}

const end_game = () =>  state.cells.length >= rows - 1 || (state.timer > 0 && state.timer == state.current_time)

const decrement_interval = () => {
	if (state.count >= 3 && state.interval_time > state.min_interval) {
		state.interval_time -= 600
		state.count = 0
	}
	else
		state.count++
}

const clear_intervals = () => {
	clearInterval(state.interval)
	state.interval = ""

	clearInterval(state.current_interval)
	state.current_interval = ""
}

const $ = (css_select) => document.querySelector(css_select)
const get_cvs = (e) => e.querySelector("canvas")

const timer_ipt = $("#timer-ipt")

const start_btn = $("#start-btn")
const draw_start = () => {
	const cvs = get_cvs(start_btn)
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
draw_start()

const pause_btn = $("#pause-btn")
const draw_pause = () => {
	const cvs = get_cvs(pause_btn)
	cvs.width = 20
	cvs.height = 20
	const ctx = cvs.getContext("2d")
	ctx.fillStyle = "#000"
	ctx.fillRect(2, 2, 6, 18)
	ctx.fillRect(10, 2, 6, 18)
}
draw_pause()

const stop_btn = $("#stop-btn")
const draw_stop = () => {
	const cvs = get_cvs(stop_btn)
	cvs.width = 20
	cvs.height = 20
	const ctx = cvs.getContext("2d")
	ctx.fillStyle = "#000"
	ctx.fillRect(2, 3, 16, 16)
}
draw_stop()

const user_msg = $("#user-msg")

start_btn.addEventListener("click", () => {
	user_msg.textContent = "w (focus timer), s (pause), d (stop)"
	add_row()
	const time = !state.current_interval && state.current_time
		? state.interval_time - state.current_time
		: state.interval_time
	state.interval = setInterval(() => {
		decrement_interval()
		if (!end_game())
			add_row()
		else {
			const game_ended = `Game end: reached ${state.high_num}${ state.timer > 0 ? "in " + state.timer : ""}`
			stop_btn.click()
			user_msg.textContent = game_ended
			setTimeout(() => user_msg.textContent = "Click start or press a.", 1500)
		}
	}, time)
	state.current_interval = setInterval(() => {
		state.current_time++
		if (state.timer >= 0) {
			const rem_time = state.timer - state.current_time
			timer_ipt.value = ms_to_time(rem_time)
		}
		console.log(state.current_time)
	}, 1000)
})

pause_btn.addEventListener("click", () => {
	user_msg.textContent = "Paused. Click start or press a."
	clear_intervals()
	console.log(state.interval, state.current_interval)
})

stop_btn.addEventListener("click", () => {
	user_msg.textContent = "Click start or press a."
	clear_intervals()
	state.high_num = 5
	state.cells = []
	state.layers.cells.destroy()
	state.layers.cells = new Konva.Layer()
	stage.add(state.layers.cells)
	state.layers.moving_tile.destroy()
	state.layers.moving_tile = new Konva.Layer()
	stage.add(state.layers.moving_tile)
	state.tile = { x: -1, y: -1 }
	state.interval_time = 3600
	state.interval_count = 0
	state.current_time = 0
	timer_ipt.disabled = false
})

timer_ipt.addEventListener("change", evt => {
	stop_btn.click()
	const ipt = evt.target.value
	if (!ipt.length) {
		state.timer = -1
		return;
	}
	state.timer = time_to_ms(ipt)
	timer_ipt.disabled = true
	app.focus()
})

document.addEventListener("keydown", evt => {
	if (!["w", "a", "s", "d"].includes(evt.key))
		return;
	switch (evt.key) {
		case "w":
			timer_ipt.focus()
			break;
		case "a":
			start_btn.click()
			break;
		case "s":
			pause_btn.click()
			break;
		case "d":
			stop_btn.click()
			break;
	}
})
```
