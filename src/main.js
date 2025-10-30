import Konva from "konva"
import ui from './ui'
import './style.css'

const size = 48
const offset = 16
const gap = 12
const rows = 8
const cols = 6
const width = cols * size + (cols - 1) * gap
const height = rows * size + (rows - 1) * gap

const tiles_sample = [
	[1, 2, 4, 2, 3, 1],
	[2, -1, 1, 3, -1, -1],
	[-1, -1, 5, -1, -1, -1]
]

const layers = {
	cells: new Konva.Layer(),
	moving_tile: new Konva.Layer()
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
stage.add(layers.cells)
stage.add(layers.moving_tile)

for (let y = tiles_sample.length - 1; y >= 0; --y) {
	tiles_sample[y].forEach((n, idx) => {
		if (n < 1)
			return;
		const rect = new Konva.Rect({
			x: 0,
			y: 0,
			width: size,
			height: size,
			fill: 'pink',
			stroke: 'black',
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
			x: size * idx + gap * idx,
			y: size * (rows - 1 - y) + gap * (rows - 1 - y),
			draggable: true
		})
		tile.add(rect)
		tile.add(text)

		tile.on('pointerclick', () => {})

		tile.on('dragstart', () => {})

		tile.on('dragmove', () => {})

		tile.on('dragend', () => {})

		layers.cells.add(tile)
	})
}

const $ = (id) => document.querySelector("#" + id)
const timer_ipt = $("timer-ipt")
// const timer = new Timer(timer_ipt)
const user_msg = $("user-msg")
const start_btn = $("start-btn")
ui.start(start_btn)
start_btn.addEventListener("click", () => {})
const pause_btn = $("pause-btn")
ui.pause(pause_btn)
pause_btn.addEventListener("click", () => {})
const stop_btn = $("stop-btn")
ui.stop(stop_btn)
stop_btn.addEventListener("click", () => {})
document.addEventListener("keydown", evt => {
	if (!["w", ":", "a", "s", "s"].includes(evt.key))
		return;
	switch (evt.key) {
		case "w":
			timer_ipt.$("minutes").focus()
			break;
		case ":":
			timer_ipt.$("seconds").focus()
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
