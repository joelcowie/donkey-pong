var canvas;
var canvasContext;
var donkeyX = 50;
var donkeyY = 50;
var donkeySpeedX = 5;
var donkeySpeedY = 5;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;
var showingWinScreen = false;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
var donkey = new Image()
donkey.src = './donkey.png'

function mousePosition(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}
function handleMouseClick(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	var framesPerSecond = 60;
	setInterval(function() {
			moveEverything();
			drawEverything();
		}, 1000/framesPerSecond);
	canvas.addEventListener('mousedown', handleMouseClick);
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = mousePosition(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		});
}
function donkeyReset() {
	if(player1Score >= WINNING_SCORE ||
		player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}
	donkeySpeedX = -donkeySpeedX;
	donkeySpeedY = 5;
	donkeyX = canvas.width/2;
	donkeyY = canvas.height/2;
}
function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < donkeyY - 35) {
		paddle2Y = paddle2Y + 5;
	}
	else if(paddle2YCenter > donkeyY + 35) {
		paddle2Y = paddle2Y - 5;
	}
}
function moveEverything() {
	if(showingWinScreen) {
		return;
	}
	computerMovement();
	donkeyX = donkeyX + donkeySpeedX;
	donkeyY = donkeyY + donkeySpeedY;
	if(donkeyX < 30) {
		if(donkeyY > paddle1Y &&
			donkeyY < paddle1Y+PADDLE_HEIGHT) {
			donkeySpeedX = -donkeySpeedX;
			var deltaY = donkeyY
				-(paddle1Y+PADDLE_HEIGHT/2);
			donkeySpeedY = deltaY * 0.2;
		}
		else {
			player2Score++; // must be BEFORE donkeyReset()
			donkeyReset();
		}
	}
	if(donkeyX+50 > 770) {
		if(donkeyY > paddle2Y &&
			donkeyY < paddle2Y+PADDLE_HEIGHT) {
			donkeySpeedX = -donkeySpeedX;
			var deltaY = donkeyY
				-(paddle2Y+PADDLE_HEIGHT/2);
			donkeySpeedY = deltaY * 0.2;
		}
		else {
			player1Score++; // must be BEFORE donkeyReset()
			donkeyReset();
		}
	}
	if(donkeyY < 0) {
		donkeySpeedY = -donkeySpeedY;
	}
	if(donkeyY > canvas.height-50) {
		donkeySpeedY = -donkeySpeedY;
	}
}
function drawNet() {
	for(var i=0;i<canvas.height;i+=40) {
		colorRect(canvas.width/2-1,i,2,20,'white');
	}
}
function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');
	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("You win!", 365, 200);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("You lose :(", 365, 200);
		}
		canvasContext.fillText("click to continue", 350, 300);
		return;
	}
	drawNet();
	// this is left player paddle
	colorRect(15,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');
	// this is right computer paddle
	colorRect(canvas.width-PADDLE_WIDTH-15,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');
	// next line draws the donkey
	canvasContext.drawImage(donkey, donkeyX, donkeyY, 50, 50)
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);
}
function colorRect(leftX,topY, width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}
