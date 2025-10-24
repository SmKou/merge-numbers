

const create_tile = (x_idx, y_idx, n) => {


	console.log("tile created", tile)
	return tile
}
const state = ((points_nums) => {
	const register = {}
	points_nums.forEach(([x_idx, y_idx, n]) => register[`x${x_idx}-y${y_idx}`] = create_tile(x_idx, y_idx, n))
	return register
})([[0, 0, 1], [1, 0, 1], [2, 0, 2], [4, 0, 3], [5, 0, 2], [4, 1, 1], [4, 2, 3]])



const rows = [
	[1, 1, 2, null, 3, 2],
	[null, null, null, null, 1, null],
	[null, null, null, null, 3, null]
]



const tiles = rows.forEach((row, y_idx) => row.map((num, x_idx) => {
	if (!num)
		return num // num is null


}))

export default {
	tiles
}
