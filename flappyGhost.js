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

//physics
let velocityX = -1.5 //pipes moving left speed
let velocityY = 0 //ghost jump speed
let gravity = 0.1

let gameOver = false
let score = 0

//evoluition
let gastly = "./sprites/gastly.png"
let haunter = "./sprites/haunter.png"
let gengar = "./sprites/gengar.png"

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
	pokeSprite.src = gastly
	pokeSprite.onload = function(){
		context.drawImage(pokeSprite, ghost.x, ghost.y, ghost.width, ghost.height)}
	
	topArmImg = new Image()
	topArmImg.src = "./sprites/giratina_top.png"

	bottomArmImg = new Image()
	bottomArmImg.src = "./sprites/giratina_bottom.png"
	
	requestAnimationFrame(update)
	setInterval(placeArms, 1500) //every 1.5 seconds
	document.addEventListener("keydown", moveGhost)
}

function update() {
	requestAnimationFrame(update)
	if (gameOver)
		return
	context.clearRect(0, 0, board.width, board.height)

	//evolution
	if (score >= 50 && pokeSprite.src !== gengar)
		pokeSprite.src = gengar
	else if (score >= 25 && score < 50 && pokeSprite.src !== haunter)
		pokeSprite.src = haunter

	//ghost
	velocityY += gravity
	//ghost.y += velocityY
	ghost.y = Math.max(ghost.y + velocityY, 0)
	context.drawImage(pokeSprite, ghost.x, ghost.y, ghost.width, ghost.height)

	if (ghost.y > board.height)
		gameOver = true

	//giratina
	for (let i = 0; i < giratina.length; i++)
	{
		let arm = giratina[i]
		arm.x += velocityX
		context.drawImage(arm.img, arm.x, arm.y, arm.width, arm.height)

		if (!arm.passed && ghost.x > arm.x + arm.width)
		{
			score += 0.5
			arm.passed = true
		}


		if (superEffective(ghost, arm))
			gameOver = true
	}

	//clear arms
	while (giratina.length > 0 && giratina[0].x < - armWidth)
	{
		giratina.shift() //removes first element of the array
	}


	//score
	context.fillStyle = "white"
	context.font = "45px sans-serif"
	context.fillText(score, 5, 45)

	if (gameOver)
		context.fillText("GAME OVER", 5, 90)
}

function placeArms() {
	
	if (gameOver)
		return
	
	let randomArmY = armY - armHeight/4 - Math.random()*(armHeight/2)
	let openingSpace = board.height/3
	
	let topArm = {
		img : topArmImg,
		x : armX,
		y : randomArmY,
		width : armWidth,
		height : armHeight,
		passed : false
	}

	giratina.push(topArm)

	let bottomArm = {
		img : bottomArmImg,
		x : armX,
		y : randomArmY + armHeight + openingSpace,
		width : armWidth,
		height : armHeight,
		passed : false
	}

	giratina.push(bottomArm)
}

function moveGhost(key) {
	if (key.code == "Space" || key.code == "ArrowUp" || key.code == "keyX")
	{
		//jump
		velocityY = -4.5

		//reset game
		if (gameOver)
		{
			ghost.y = ghostY
			giratina = []
			score = 0
			gameOver = false
			pokeSprite.src = gastly
		}
	}
}

function superEffective(a, b)
{

	const insetA = 8
	const insetB = 8

	return	a.x + insetA < b.x + b.width - insetB &&
        	a.x + a.width - insetA > b.x + insetB &&
        	a.y + insetA < b.y + b.height - insetB &&
        	a.y + a.height - insetA > b.y + insetB
}