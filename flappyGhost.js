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

//giratina
let giratina = []
let armWidth = 64
let armHeight = 512
let armX = boardWidth
let armY = 0

let topArmImg
let bottomArmImg

window.onload = function()
{
	board = document.getElementById("board")
	board.width = boardWidth
	board.height = boardHeight
	context = board.getContext("2d") //draw on the board

	//draw the ghost
	context.fillStyle = "green"
	/*context.fillRect(ghost.x, ghost.y, ghost.width, ghost.height )*/

	//load images
	pokeSprite = new Image()
	pokeSprite.src = "./sprites/gastly.png"
	pokeSprite.onload = function(){
		context.drawImage(pokeSprite, ghost.x, ghost.y, ghost.width, ghost.height)}
	
	topArmImg = new Image()
	topArmImg.src = "./sprites/giratina_top.png"

	bottomArmImg = new Image()
	bottomArmImg.src = "./sprites/giratina_bottom.png"
	
	requestAnimationFrame(update)
	setInterval(placeArms, 1500) //every 1.5 seconds
}

function update() {
	requestAnimationFrame(update)
	context.clearRect(0, 0, board.width, board.height)

	//ghost
	context.drawImage(pokeSprite, ghost.x, ghost.y, ghost.width, ghost.height)

	//giratina
	for (let i = 0; i < giratina.length; i++)
	{
		let arm = giratina[i]
		context.drawImage(arm.img, arm.x, arm.y, arm.width, arm.height)
	}
}

function placeArms() {
	let topArm = {
		img : topArmImg,
		x : armX,
		y : armY,
		width : armWidth,
		height : armHeight,
		passed : false
	}

	giratina.push(topArm)
}