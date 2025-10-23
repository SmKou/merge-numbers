const generate_colors = (n) => {
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

const range = ({ p, min, max }) => (!min && !max)
	|| (min <= p && p <= max)
	? p
	: !min
	? Math.max(p, max)
	: Math.min(p, min)

export const SIZE = 48
export const OFFSET = 16
export const GAP = 12
export const COLS = 6
export const WIDTH = COLS * SIZE + (COLS - 1) * GAP
export const ROWS = 8
export const HEIGHT = ROWS * SIZE + (ROWS - 1) + GAP
export const MAXIMUM_NUMBER = 10
export const RISE_INTERVAL = 2400

export class Game {
	constructor() {
		this.stage = new Konva.Stage({
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
			colors: generate_colors(MAXIMUM_NUMBER)
		}

		this.time_state = {
			interval: "",
			current_time: 0,
			current_interval: ""
		}
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
		const cell = {
			tile,
			value: n + 1
		}
		this.activate_tile(cell)
		row.push(cell)
		this.game_state.layers.cells.add(tile)
		if (i < COLS)
			this.add_row(x_idx + 1, row)
		else
			this.game_state.cells.unshift(row)
	}

	move_rows() {
		const period = 300
		const { cells } = this.game_state
		const layer_cells = this.game_state.layers.cells
		for (let y = cells.length - 1; y >= 0; --y) {
			const dist = y > 0
			? SIZE + GAP
			: SIZE
			const speed = dist / period
			const y_orig = cells[y][0].tile.y()
			cells[y].forEach(function animate_cell(cell) {
				if (!cell) return;
				const anim = new Konva.Animation(frame => {
					cell.tile.y(y_orig + speed * frame.time)
					if (speed * frame.time >= dist) {
						cell.tile.y(y_orig - dist)
						anim.stop()
					}
				}, layer_cells)
				anim.start()
			})
		}
	}

	init() {
		this.add_row()
		this.move_rows()
	}

	get_pos_idx(pos) {
		const x = Math.floor(pos.x / (SIZE + GAP))
		const y = (ROWS - 1) - Math.floor(pos.y / (SIZE + GAP))
		return { x, y }
	}

	activate_tile({ tile, value }) {
		const cross_area = SIZE + GAP
		const collision_area = SIZE / 4 + GAP
		const tile_of = (x, y) => this.game_state.cells[y][x].tile
		const number_of = (x, y) => this.game_state.cells[y][x].value

		tile.on('pointerclick', () => {
			const { x, y } = this.game_state.tile
			if (x == -1 || y == -1) {
				const pos = this.get_pos_idx(stage.getPointerPosition())
				this.game_state.tile.x = pos.x
				this.game_state.tile.y = pos.y
			}
			else {
				// todo: determine validity of move
				// if valid => move tile
				// else => do nothing
			}
		})
		tile.on('dragstart', () => {
			const pos = this.get_pos_idx(stage.getPointerPosition())
			this.game_state.tile.x = pos.x
			this.game_state.tile.y = pos.y
		})
		// not using coordinates from getPointerPosition: (x, y) = player touch point
		tile.on('dragmove', () => {
			const pos = pos_idxs(stage.getPointerPosition())
			const start_pos = this.game_state.tile
		})
		tile.on('dragend', () => {})
	}

	is_paused() {
		return !this.time_state.current_interval && this.time_state.current_time
	}

	clear_intervals() {
		const { interval, current_interval } = this.time_state
		clearInterval(interval)
		clearInterval(current_interval)
		this.time_state.interval = ""
		this.time_state.current_interval = ""
	}

	update_user(msg) {
		const highest_num = msg.querySelector("span#highest-num")
		highest_num.textContent = this.game_state.highest_num
	}
}
