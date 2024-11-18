//board
let board
let boardWidth = 360
let boardHeight = 640
let context

//ghost
let ghostWidth = 64
let ghostHeight = 64
let ghostX = boardWidth/8
let ghostY = boardHeight/2
let pokeSprite

let ghost = {
	x : ghostX,
	y : ghostY,
	width : ghostWidth,
	height : ghostHeight
}

window.onload = function()
{
	board = document.getElementById("board")
	board.width = boardWidth
	board.height = boardHeight
	context = board.getContext("2d") //draw on the board

	//draw the ghost
	context.fillStyle = "green"
	context.fillRect(ghost.x, ghost.y, ghost.width, ghost.height )

	//load images
	pokeSprite = new Image()
	pokeSprite.src = "./sprites/gastly.png"
	pokeSprite.onload = function(){
		context.drawImage(pokeSprite, ghost.x, ghost.y, ghost.width, ghost.height)}
}