import { Timer } from './models/Timer'
import game from './game'
import './style.css'

const $ = (id) => document.querySelector("#" + id)
HTMLElement.prototype.$ = (id) => this.querySelector("#" + id)

const app = $("app")
app.style.width = (width + offset * 2) + "px"
app.style.height = (height + offset * 2) + "px"
document.querySelector("nav").style.width = app.style.width

const timer_ipt = $("timer-ipt")
const timer = new Timer(timer_ipt)

const user_msg = $("user-msg")

const start_btn = $("start-btn")
ui.draw_start(start_btn)
start_btn.addEventListener("click", () => {
	game.start(user_msg, timer)
})

const pause_btn = $("pause-btn")
ui.draw_pause(pause_btn)
pause_btn.addEventListener("click", () => {
	game.pause()
})

const stop_btn = $("stop-btn")
ui.draw_stop(stop_btn)
stop_btn.addEventListener("click", () => {
	game.stop()
})

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
