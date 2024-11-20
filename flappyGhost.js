// Variables
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Ghost
let ghostWidth = 64;
let ghostHeight = 64;
let ghostX = boardWidth / 8;
let ghostY = boardHeight / 2;
let pokeSprite;

let ghost = {
	x: ghostX,
	y: ghostY,
	width: ghostWidth,
	height: ghostHeight,
};

// Giratina
let giratina = [];
let armWidth = 64;
let armHeight = 512;
let armX = boardWidth;
let armY = 0;

let topArmImg;
let bottomArmImg;

// Physics
let velocityX = -1.5; // Speed at which arms move left
let velocityY = 0;    // Speed of the ghost's jump
let gravity = 0.1;

let gameOver = false;
let score = 0;

// Evolution
let gastly = "./sprites/gastly.png";
let haunter = "./sprites/haunter.png";
let gengar = "./sprites/gengar.png";

let gameStart = false; // Indicates whether the game has started

// Onload
window.onload = function () {
	board = document.getElementById("board");
	board.width = boardWidth;
	board.height = boardHeight;
	context = board.getContext("2d");

	drawButton();

	// Load images
	pokeSprite = new Image();
	pokeSprite.src = gastly;

	topArmImg = new Image();
	topArmImg.src = "./sprites/giratina_top.png";

	bottomArmImg = new Image();
	bottomArmImg.src = "./sprites/giratina_bottom.png";

	// Add event listeners
	board.addEventListener("click", handleButtonClick); // Corrected name
	document.addEventListener("keydown", moveGhost);

	// Draw ghost after the image is loaded
	pokeSprite.onload = function () {
		context.drawImage(pokeSprite, ghost.x, ghost.y, ghost.width, ghost.height);
	};
};

// Draw the Start button
function drawButton() {
	const buttonWidth = 100;
	const buttonHeight = 50;
	const buttonX = boardWidth - buttonWidth - 10;
	const buttonY = boardHeight - buttonHeight - 10;

	// Button rectangle
	context.fillStyle = "black";
	context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight); // Fixed usage

	// Button text
	context.fillStyle = "purple";
	context.font = "20px sans-serif";
	context.fillText("Start", buttonX + 20, buttonY + 30);
}

// Handle button click
function handleButtonClick(event) {
	if (gameStart) return; // Prevent multiple clicks

	// Click coordinates
	const rect = board.getBoundingClientRect();
	const clickX = event.clientX - rect.left;
	const clickY = event.clientY - rect.top;

	// Button coordinates
	const buttonWidth = 100;
	const buttonHeight = 50;
	const buttonX = boardWidth - buttonWidth - 10;
	const buttonY = boardHeight - buttonHeight - 10;

	// Check if the click is inside the button
	if (
		clickX >= buttonX &&
		clickX <= buttonX + buttonWidth &&
		clickY >= buttonY &&
		clickY <= buttonY + buttonHeight
	) {
		gameStart = true; // Update game state
		requestAnimationFrame(update);
		setInterval(placeArms, 1500); // Every 1.5 seconds
	}
}

// Update the canvas
function update() {
	requestAnimationFrame(update);
	if (gameOver) return;

	context.clearRect(0, 0, board.width, board.height);

	// Evolution
	if (score >= 50 && pokeSprite.src !== gengar) {
		pokeSprite.src = gengar;
	} else if (score >= 25 && score < 50 && pokeSprite.src !== haunter) {
		pokeSprite.src = haunter;
	}

	// Ghost physics
	velocityY += gravity;
	ghost.y = Math.max(ghost.y + velocityY, 0);
	context.drawImage(pokeSprite, ghost.x, ghost.y, ghost.width, ghost.height);

	if (ghost.y > board.height) gameOver = true;

	// Giratina arms
	for (let i = 0; i < giratina.length; i++) {
		let arm = giratina[i];
		arm.x += velocityX;
		context.drawImage(arm.img, arm.x, arm.y, arm.width, arm.height);

		if (!arm.passed && ghost.x > arm.x + arm.width) {
			score += 0.5;
			arm.passed = true;
		}

		if (superEffective(ghost, arm)) gameOver = true;
	}

	// Clear arms outside the canvas
	while (giratina.length > 0 && giratina[0].x < -armWidth) {
		giratina.shift();
	}

	// Display score
	context.fillStyle = "white";
	context.font = "45px sans-serif";
	context.fillText(score, 5, 45);

	// Game Over message
	if (gameOver) context.fillText("GAME OVER", 5, 90);
}

// Generate arms
function placeArms() {
	if (gameOver) return;

	let randomArmY = armY - armHeight / 4 - Math.random() * (armHeight / 2);
	let openingSpace = board.height / 3;

	let topArm = {
		img: topArmImg,
		x: armX,
		y: randomArmY,
		width: armWidth,
		height: armHeight,
		passed: false,
	};

	giratina.push(topArm);

	let bottomArm = {
		img: bottomArmImg,
		x: armX,
		y: randomArmY + armHeight + openingSpace,
		width: armWidth,
		height: armHeight,
		passed: false,
	};

	giratina.push(bottomArm);
}

// Handle ghost movement
function moveGhost(key) {
	if (key.code == "Space" || key.code == "ArrowUp" || key.code == "KeyX") {
		velocityY = -4.5;

		// Reset game
		if (gameOver) {
			ghost.y = ghostY;
			giratina = [];
			score = 0;
			gameOver = false;
			pokeSprite.src = gastly;
		}
	}
}

// Collision detection
function superEffective(a, b) {
	const insetA = 8;
	const insetB = 8;

	return (
		a.x + insetA < b.x + b.width - insetB &&
		a.x + a.width - insetA > b.x + insetB &&
		a.y + insetA < b.y + b.height - insetB &&
		a.y + a.height - insetA > b.y + insetB
	);
}
