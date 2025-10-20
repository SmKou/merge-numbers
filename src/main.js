import Konva from 'konva'
import './style.css'

const size = 48
const offset = 16
const gap = 12
const rows = 8
const cols = 6
const width = cols * size + (cols - 1) * gap
const height = rows * size + (rows - 1) * gap

const app = document.getElementById('app')
app.style.width = (width + offset * 2) + "px"
app.style.height = (height + offset * 2) + "px"

const stage = new Konva.Stage({
	container: 'foreground',
	width,
	height
})

const layer = new Konva.Layer()
stage.add(layer)

