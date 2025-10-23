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

export class Game {
	static SIZE = 48
	static OFFSET = 16
	static GAP = 12
	static COLS = 6
	static WIDTH = COLS * SIZE + (COLS - 1) * GAP
	static ROWS = 8
	static HEIGHT = ROWS * SIZE + (ROWS - 1) + GAP
	static MAXIMUM_NUMBER = 10
	static RISE_INTERVAL = 2400

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
		this.activate_tile(tile)
		row.push(tile)
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

	init() {
		this.add_row()
		this.move_rows()
	}

	activate_tile(tile) {
		tile.on('pointerclick', () => {})
		tile.on('dragstart', () => {})
		tile.on('dragmove', () => {
			console.log()
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

	clear() {

	}

	update_user(msg) {
		const highest_num = msg.querySelector("span#highest-num")
		highest_num.textContent = this.game_state.highest_num
	}
}
