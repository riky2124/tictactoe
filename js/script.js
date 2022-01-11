var originBoard;
var winner;
var level;
var isSuggest;
var head = document.querySelector('#head');
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos =[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector('.endgame').style.display = 'none';
	document.querySelector('.pregame').style.display = 'block';
    originBoard = Array.from(Array(9).keys());
	document.getElementById('suggest-check').removeAttribute('checked');
    winner = null;
	//suggest();
	document.getElementById('suggest-check').addEventListener('change', function(){
		if(this.checked){
			isSuggest = true;
		}
		else{
			isSuggest = false;
		}
	});
    for(var cell = 0; cell < cells.length; cell++){
        cells[cell].innerText = '';
        cells[cell].style.removeProperty('background-color');
        cells[cell].addEventListener('click', turnClick, false);
    }
}

/* Level selector */
function easy(){
	level = 'easy';
	document.querySelector('.pregame').style.display = 'none';
	head.innerHTML = "<h2>Level: Easy</h2>";
	head.style.color = "green";
}
function medium(){
	level = 'medium';
	document.querySelector('.pregame').style.display = 'none';
	head.innerHTML = "<h2>Level: Medium</h2>";
	head.style.color = "yellow";
}
function hard(){
	level = 'hard';
	document.querySelector('.pregame').style.display = 'none';
	head.innerHTML = "<h2>Level: Hard</h2>";
	head.style.color = "red";
}

function turnClick(square){
    if(typeof originBoard[square.target.id] == 'number'){
        turn(square.target.id, huPlayer);
        if(!checkWin(originBoard, huPlayer) && !checkTie()){
			turn(bestSpot(), aiPlayer);
		} 
    }
}

function turn(squareId, player){
    originBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(originBoard, player);
    if(gameWon){
		 gameOver(gameWon);
	}
	else if(player === aiPlayer && isSuggest){
		suggest();
	}
}

function checkWin(board, player){
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if(win.every(ele => plays.indexOf(ele) > -1)){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
    }
    for(var cell = 0; cell < cells.length; cell++){
        cells[cell].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You won" : "You lose");
    winner = gameWon.player;
}

function declareWinner(who){
	head.innerHTML = "";
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
}

/* Suggestion Area */
function suggest(){
	var suggested = document.getElementById(suggestion(originBoard, huPlayer).index);
	suggested.style.backgroundColor = "skyblue";
}

/* Ai & Winner Box */

function emptySpots(){
    return originBoard.filter(ele => typeof ele == 'number');
}

function bestSpot(){
	//return minimax(originBoard, aiPlayer).index;
	switch (level){
		case 'easy':
			return emptySpots()[0];
		case 'medium':
			return emptySpots()[Math.floor(Math.random() * emptySpots().length)];
		case 'hard':
			return minimax(originBoard, aiPlayer).index;

	}
	
}

function checkTie(){
    if(emptySpots().length == 0){
        for(var cell = 0; cell < cells.length; cell++){
            cells[cell].style.backgroundColor = "green";
            cells[cell].removeEventListener('click', turnClick, false);
        }
        declareWinner("Game is Tied!");
        return true;
    }
    return false;
}

/* Minimax */

function minimax(newBoard, player){
    var availSpots = emptySpots();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}


/*Suggestion */

function suggestion(newBoard, player){
    var availSpots = emptySpots();
	if (checkWin(newBoard, aiPlayer)) {
		return {score: -20};
	} else if (checkWin(newBoard, huPlayer)) {
		return {score: 20};
	} else if (availSpots.length === 0) {
		return {score: -10};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = suggestion(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = suggestion(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}