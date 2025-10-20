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
	tile: { x: -1, y: -1 }
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

add_row()
