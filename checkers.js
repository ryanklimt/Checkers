var playerLocations = new Array();
var letters = ['A','B','C','D','E','F','G','H'];
var gameLog = new Array();
var currMove = 0;
var isPlaying = false;
var isDoubleJumping = false;

function createBoard() {
	for(var i=0;i<8;i++) {
		$('.checkersHeader').append('<li>'+i+'</li>');
		$('.checkersSidebar').append('<li>'+letters[i]+'</li>');
		for(var j=0;j<8;j++) {
			var tmp = j+i*8;
			var divClass = (tmp+i)%2 == 0 ? 'black' : 'white';
			var divId = 'place' + i + '' + j + '';
			$('.checkersBoard').append('<div class="' + divClass + '" id="' + divId + '"></div>');	
		}
	}
}

function resetBoard() {
	playerLocations = new Array(
		new Array(1,0,1,0,1,0,1,0),
		new Array(0,1,0,1,0,1,0,1),
		new Array(1,0,1,0,1,0,1,0),
		new Array(0,0,0,0,0,0,0,0),
		new Array(0,0,0,0,0,0,0,0),
		new Array(0,3,0,3,0,3,0,3),
		new Array(3,0,3,0,3,0,3,0),
		new Array(0,3,0,3,0,3,0,3)
	);
}

function drawPlayers() {
	for(var i=0; i<8; i++) {
		for(var j=0; j<8; j++) {
			$('#place' + i + j).removeClass('p1 k1 p2 k2');
			if(playerLocations[i][j] == 1) {
				$('#place' + i + j).addClass('p1');
			} else if(playerLocations[i][j] == 2) {
				$('#place' + i + j).addClass('k1');
			} else if(playerLocations[i][j] == 3) {
				$('#place' + i + j).addClass('p2');
			} else if(playerLocations[i][j] == 4) {
				$('#place' + i + j).addClass('k2');
			}
		}
	}
}

function pieceType(piece, endX) {
	if((piece == 1 || piece == 2) && endX == 'H') piece = 2;
	if((piece == 3 || piece == 4) && endX == 'A') piece = 4;
	return piece;
}

function handleMove(move) {
	currMove = move;
	isDoubleJumping = false;
	resetBoard();
	$('.moves').empty();
	
	if(currMove == 0) {
		$('.moves').append('<li><em>Empty</em></li>');
	} else if(currMove<=gameLog.length) {
		for(var i=0;i<currMove;i++) {
			var tmp = gameLog[i].split(' ');
			var moves = tmp[0].split(':');

			$('.moves').prepend('<li>[' + (i+1) + '] Player ' + (i%2+1) + ': ' + tmp[0] + '</li>');

			if(i==currMove-1 && moves.length > 2) {
				var startXL = moves[0].charAt(0);
				var startX = letters.indexOf(startXL);
				var startY = moves[0].charAt(1);
				var endXL = moves[1].charAt(0);
				var endX = letters.indexOf(endXL);
				var endY = moves[1].charAt(1);
				var piece = playerLocations[startX][startY];
				var delXL = tmp[1].charAt(0);
				var delX = letters.indexOf(delXL);
				var delY = tmp[1].charAt(1);
				playerLocations[endX][endY] = pieceType(piece,endXL);
				playerLocations[startX][startY] = 0;
				playerLocations[delX][delY] = 0;
				isDoubleJumping = true;
				playMultipleMove(tmp,moves,1);
			} else {
				for(var j=0;j<moves.length-1;j++) {
					var startXL = moves[j].charAt(0);
					var startX = letters.indexOf(startXL);
					var startY = moves[j].charAt(1);
					var endXL = moves[j+1].charAt(0);
					var endX = letters.indexOf(endXL);
					var endY = moves[j+1].charAt(1);
					var piece = playerLocations[startX][startY];
					playerLocations[endX][endY] = pieceType(piece,endXL);
					playerLocations[startX][startY] = 0;
				}
				for(var j=1;j<tmp.length;j++) {
					var delXL = tmp[j].charAt(0);
					var delX = letters.indexOf(delXL);
					var delY = tmp[j].charAt(1);
					playerLocations[delX][delY] = 0;
				}
			}
		}
	}
	drawPlayers();
}

function playMultipleMove(tmp,moves,moveNum) {
	setTimeout(function() {
		if(moveNum<moves.length-1 && isDoubleJumping) {
			var startXL = moves[moveNum].charAt(0);
			var startX = letters.indexOf(startXL);
			var startY = moves[moveNum].charAt(1);
			var endXL = moves[moveNum+1].charAt(0);
			var endX = letters.indexOf(endXL);
			var endY = moves[moveNum+1].charAt(1);
			
			var delXL = tmp[moveNum+1].charAt(0);
			var delX = letters.indexOf(delXL);
			var delY = tmp[moveNum+1].charAt(1);
			
			var piece = playerLocations[startX][startY];
			
			playerLocations[endX][endY] = pieceType(piece,endXL);
			playerLocations[startX][startY] = 0;
			playerLocations[delX][delY] = 0;
			
			drawPlayers();
			
			moveNum++;
			playMultipleMove(tmp,moves,moveNum);
		} else {
			isDoubleJumping = false;
		}
	}, 2500/$('#speed').val());
}

function play(waitTime) {
	if(gameLog[currMove] != null && isPlaying && currMove<=gameLog.length) {
		setTimeout(function() {
			var addTime = 1;
			var moves = gameLog[currMove].split(" ")[0].split(":").length;
			if(moves > 2) addTime = moves-1;
			currMove++;
			handleMove(currMove);
			$('#frame').val(currMove);
			$('#frame').slider('refresh');
			play(addTime);
		}, (2500/$('#speed').val())*waitTime);
	} else {
		$('#play').attr('value','Play');
		$('#play').button('refresh');
		isPlaying = false;
	}
}

function fileUploaded() {
	$('.checkersContainer + div').hide();
	$('.checkers').show();
}

$('#newUpload').click(function(e) {
	$('#file').val('');
	$('.checkers').hide();
	$('.checkersContainer + div').show();
});

$('#play').click(function() {
	currMove = $('#frame').val();
	if(!isPlaying && currMove < gameLog.length) {
		$('#play').attr('value','Pause');
		$('#play').button('refresh');
		isPlaying = true;
		play(1);
	} else {
		$('#play').attr('value','Play');
		$('#play').button('refresh');
		isPlaying = false;
	}
});

$('#reset').click(function() {
	$('#frame').val(0);
	$('#frame').slider('refresh');
	$('.moves').empty();
	$('.moves').append('<li><em>Empty</em></li>');
	currMove = 0;
	resetBoard();
	drawPlayers();
});

$('#file').change(function(e) {
	resetBoard();
	if($('#file').prop('files')[0]) {
		$.ajax({
			url: $('#file').prop('files')[0]['name'],
			success: function(data) {
				gameLog = data.split('\n'),
				$('#frame').prop({
					max: gameLog.length
				}).slider('refresh');
				fileUploaded();
			}
		})
	}
});

$(document).ready(function() {
	createBoard();
	resetBoard();
	drawPlayers();
});