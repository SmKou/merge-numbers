import Konva from 'konva'
import ui from 'UI'
import grid from 'Grid'
import './style.css'

const $ = (css_select) => document.querySelector(css_select)

const app = $("#app")
app.style.width = (width + offset * 2) + "px"
app.style.height = (height + offset * 2) + "px"
$("nav").style.width = app.style.width


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

const timer_ipt = $("#timer-ipt")

const start_btn = $("#start-btn")
ui.draw_start(start_btn)

const pause_btn = $("#pause-btn")
ui.draw_pause(pause_btn)

const stop_btn = $("#stop-btn")
ui.draw_stop(stop_btn)

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
