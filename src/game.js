import { RisingRowsGame } from './models/RisingRowsGame'
import { TimerGame } from './models/TimerGame'

let game;

const start_game = (user_msg, e_timer) => {
	if (game && game.is_paused()) {
		game.start(user_msg, e_timer)
		return;
	}
	if (is_rising_rows)
		game = new RisingRowsGame()
	else {
		const time = e_timer.value
		game = new TimerGame(e_timer)
	}
	game.init()
	game.start(user_msg, e_timer)
	return true
}

const pause_game = () => {
	game.clear_intervals()
}

const stop_game = (user_msg) => {
	game.update_user(user_msg)
	game.clear()
	game = null
}

export default {
	start: start_game,
	pause: pause_game,
	stop: stop_game
}
