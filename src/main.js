import Konva from "konva"
import ui from './ui'
import './style.css'

const SIZE = 48
const OFFSET = 16
const GAP = 12
const COLS = 6
const WIDTH = COLS * SIZE + (COLS - 1) * GAP
const ROWS = 8
const HEIGHT = ROWS * SIZE + (ROWS - 1) * GAP

const $ = (id) => document.querySelector("#" + id)
HTMLElement.prototype.$ = (id) => this.querySelector("#" + id)

const app = $("app")
app.style.width = (WIDTH + OFFSET * 2) + "px"
app.style.height = (HEIGHT + OFFSET * 2) + "px"
document.querySelector("nav").style.width = app.style.width

const stage = new Konva.Stage({
	container: 'foreground',
	WIDTH,
	HEIGHT
})
const cells = new Konva.Layer()
const moving_tile = new Konva.Layer()
stage.add(cells)
stage.add(moving_tile)

const rect = new Konva.Rect({
	x: 0,
	y: 0,
	width: SIZE,
	height: SIZE,
	fill: 'rgb(250)',
	cornerRadius: SIZE * 0.12
})
const text = new Konva.Text({
	x: 0,
	y: 0,
	width: SIZE,
	fill: 'black',
	text: 1,
	fontSize: 20,
	align: 'center'
})
text.padding((SIZE - text.height()) / 2, 0)
const tile = new Konva.Group({
	id: `x0-y0`,
	x: 0,
	y: 7 * (SIZE + GAP),
	draggable: true
})
tile.add(rect)
tile.add(text)
cells.add(tile)




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
