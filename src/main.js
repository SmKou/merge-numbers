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
	interval_time: 1200,
	interval_count: 0,
	min_interval: 300,
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
		tile.y()
	})

	tile.on('dragend', () => {
		const pos = stage.getPointerPosition()
		const x = Math.floor(pos.x / (size + gap))
		const y = (rows - 1) - Math.floor(pos.y / (size + gap))
		// check if movement is valid: true = move
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
		const div = y == 0 ? 0 : offset
		const speed = (size + div) / period
		const y_orig = state.cells[y][0].y()
		const y_dest = y_orig - (size + div)
		state.cells[y].forEach((cell) => {
			if (!cell) return;
			const anim = new Konva.Animation(frame => {
				cell.y(y_orig - speed * frame.time)
				if (speed * frame.time > size + div) {
					cell.y(y_dest)
					anim.stop()
				}
			}, state.layers.cells)
			setTimeout(() => anim.start(), 300)
		})
	}
}

const end_game = () =>  state.cells.length >= rows || (state.timer > 0 && state.timer == state.current_time)

const decrement_interval = () => {
	if (state.count >= 3 && state.interval_time > state.min_interval) {
		state.interval_time -= 100
		state.count = 0
	}
	else return;
}

const clear_intervals = () => {
	clearInterval(state.interval)
	state.interval = ""
	clearInterval(state.current_interval)
	state.current_interval = ""
}

const timer_ipt = document.getElementById("timer-ipt")
const start_btn = document.getElementById("start-btn")
const pause_btn = document.getElementById("pause-btn")
const stop_btn = document.getElementById("stop-btn")
const user_msg = document.getElementById("user-msg")

timer_ipt.addEventListener("", evt => {
	const ipt = evt.target.value.split(":")
	if (!ipt.length || !ipt[0]) {
		state.timer = -1
		return;
	}
	const time = ipt[0] * 1000 * 60 + (ipt[1] || 0)
	state.timer = time
})

start_btn.addEventListener("click", () => {
	user_msg.textContent = "w (focus timer), s (pause), d (stop)"
	const time = !state.current_interval && state.current_time
		? state.interval_time - state.current_time
		: state.interval_time
	state.interval = setInterval(() => {
		decrement_interval()
		if (!end_game())
			add_row()
		else {
			clear_intervals()
			user_msg.textContent = `Game end: reached ${state.high_num}${ state.timer > 0 ? "in " + state.timer : ""}`
		}
	}, time)
	state.current_interval = setInterval(() => {
		state.current_time++
		if (state.timer) {
			const rem_time = state.timer - state.current_time
			const min_to_ms = 1000 * 60
			const [min, sec] = [
				rem_time / min_to_ms,
				rem_time % min_to_ms
			]
			timer_ipt.value = `${min || ""}:${sec || "00"}`
		}
	}, 1000)
})

pause_btn.addEventListener("click", () => {
	clear_intervals()
	user_msg.textContent = "Paused. Click start or press a."
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
	state.interval_time = 1200
	state.interval_count = 0
	state.current_time = 0
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
