import { RisingRowsGame } from './models/RisingRowsGame'
import { TimerGame } from './models/TimerGame'

let game;

const start_game = (user_msg, c_timer) => {
	if (game?.is_paused()) {
		game.start(user_msg)
		return;
	}
	if (c_timer.is_active())
		game = new RisingRowsGame()
	else
		game = new TimerGame(c_timer)
	game.init()
	game.start(user_msg)
	return true
}

const pause_game = () => {
	game.clear_intervals()
}

const stop_game = (user_msg) => {
	game.update_user(user_msg)
	game = null
}

export default {
	start: start_game,
	pause: pause_game,
	stop: stop_game
}
