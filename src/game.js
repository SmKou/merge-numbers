import { RisingRowsGame } from './models/RisingRowsGame'
import { TimerGame } from './models/TimerGame'

const start_game = (is_rising_rows = true, e_timer) => {
	if (is_rising_rows)
		return new RisingRowsGame()
	else
		return new TimerGame(e_timer)
}

const pause_game = (game) => {
	game.clear_intervals()
}

const stop_game = (mode) => {
	return new Game(mode)
}

export default {
	start: start_game,
	pause: pause_game,
	stop: stop_game
}
