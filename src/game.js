import Konva from 'konva'
import { styles } from 'ui'

const SIZE = 48
const OFFSET = 16
const GAP = 12
const COLS = 6
const WIDTH = COLS * SIZE + (COLS - 1) * GAP
const ROWS = 8
const HEIGHT = ROWS * SIZE + (ROWS - 1) + GAP
const MAXIMUM_NUMBER = 10
const RISE_INTERVAL = 2400

export const d = {
	offset: OFFSET,
	width: WIDTH,
	height: HEIGHT
}

class Game {
	constructor(mode) {
		const stage = new Konva.Stage({
			container: 'foreground',
			WIDTH,
			HEIGHT
		})
		const cells = new Konva.Layer()
		const moving_tile = new Konva.Layer()
		stage.add(cells)
		stage.add(moving_tile)

		this.game_state = {
			highest_num: 5,
			cells: [],
			layers: {
				cells,
				moving_tile
			},
			tile: { x: -1, y: -1 },
			colors: styles.colors(MAXIMUM_NUMBER)
		}

		this.time_state = {
			interval: "",
			current_time: 0,
			current_interval: "",
			timer: -1
		}

		this.mode = mode
	}

	add_row(x_idx = 0, row = []) {
		const n = Math.floor(Math.random() * this.game_state.highest_num)
		const rect = new Konva.Rect({
			x: 0,
			y: 0,
			width: SIZE,
			height: SIZE,
			fill: this.game_state.colors[n],
			cornerRadius: SIZE * 0.12
		})
		const text = new Konva.Text({
			x: 0,
			y: 0,
			width: SIZE,
			fill: 'black',
			text: `${n + 1}`,
			fontSize: 20,
			align: 'center'
		})
		text.padding((SIZE - text.height()) / 2, 0)
		const tile = new Konva.Group({
			x: SIZE * x_idx + GAP * x_idx,
			y: HEIGHT,
			draggable: true
		})
		tile.add(rect)
		tile.add(text)
		row.push(tile)
		this.game_state.layers.cells.add(tile)
		if (i < COLS)
			this.add_row(x_idx + 1, row)
		else
			this.game_state.cells.unshift(row)
	}

	move_up_rows() {
		const period = 300
		const { cells } = this.game_state
		const layer_cells = this.game_state.layers.cells
		for (let y = cells.length - 1; y >= 0; --y) {
			const dist = y > 0
				? SIZE + GAP
				: SIZE
			const speed = dist / period
			const y_orig = cells[y][0].y()
			cells[y].forEach(function animate_cell(cell) {
				if (!cell) return;
				const anim = new Konva.Animation(frame => {
					cell.y(y_orig + speed * frame.time)
					if (speed * frame.time >= dist) {
						cell.y(y_orig - dist)
						anim.stop()
					}
				}, layer_cells)
				anim.start()
			})
		}
	}

	add_grid() {
		for (let x_idx = 0; x_idx < ROWS; ++x_idx)
			this.add_row()
	}

	move_towards_empty_slot() {}

	start() {}

	pause() {}

	stop() {}

	change_mode() {
		if (this.mode == "timer")
			this.mode = "rising-rows"
		else
			this.mode = "timer"
	}

	clear_intervals() {
		const { interval, current_interval } = this.time_state
		clearInterval(interval)
		clearInterval(current_interval)
		this.time_state.interval = ""
		this.time_state.current_interval = ""
	}

	end_game() {
		switch (this.mode) {
			case 'timer':
				const { current_time, timer } = this.time_state
				return timer > 0 && timer == current_time
			case 'rising-rows':
				const { cells } = this.game_state
				return cells.length >= ROWS - 1
		}
	}

	update_user(msg) {
		msg.querySelector("span#highest-num").textContent = this.game_state.highest_num

		const time_played = msg.querySelector("span#time-played")
		switch (mode) {
			case 'timer':
				time_played.textContent = this.time_state.timer
				break;
			case 'rising-rows':
				time_played.textContent = this.time_state.current_time
				break;
		}

	}
}
