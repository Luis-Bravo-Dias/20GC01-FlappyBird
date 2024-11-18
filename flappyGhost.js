//board
let board
let boardWidth = 360
let boardHeight = 640
let context

window.onload = function()
{
	board = document.getElementById("board")
	board.width = boardWidth
	board.height = boardHeight
	context = board.getContext("2d") //draw on the board
}