
import './style.css'

const $ = (css_select) => document.querySelector(css_select)

const app = $("#app")
app.style.width = (width + offset * 2) + "px"
app.style.height = (height + offset * 2) + "px"
$("nav").style.width = app.style.width

const timer_ipt = $("#timer-ipt")

const start_btn = $("#start-btn")
ui.draw_start(start_btn)

const pause_btn = $("#pause-btn")
ui.draw_pause(pause_btn)

const stop_btn = $("#stop-btn")
ui.draw_stop(stop_btn)

const user_msg = $("#user-msg")

let game = new Game()

