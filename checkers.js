var playerLocations = new Array();
var gameLog = new Array();
var currMove = 0;
var isPlaying = false;

function createBoard() {
	for(var i=0;i<8;i++) {
		$('.chessboardHeader').append('<li>'+i+'</li>');
		$('.chessboardSidebar').append('<li>'+i+'</li>');
		for(var j=0;j<8;j++) {
			var tmp = j+i*8;
			var divClass = (tmp+i)%2 == 0 ? 'black' : 'white';
			var divId = 'place' + i + '' + j + '';
			$('.chessboard').append('<div class="' + divClass + '" id="' + divId + '"></div>');	
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

function pieceType(player, startX, startY, endX, endY) {
	var piece = playerLocations[startX][startY];
	if(player == 1 && endX == 7) {
		piece = 2;
	} else if(player == 2 && endX == 0) {
		piece = 4;
	}
	return piece;
}

function handleMove(move) {
	if(move<=gameLog.length) {
		resetBoard();
		$(".moves").empty();
		for(var i=0;i<move;i++) {
			var tmp = gameLog[i].split(" ");
			var i2 = i + 1;
			for(var j=0;j<tmp.length;j++) {
				tmp[j] = parseInt(tmp[j]);
			}
			$(".moves").append("<li>[" + i2 + "] Player " + tmp[0] + ": " + tmp[1] + "-" + tmp[2] + " to " + tmp[3] + "-" + tmp[4] + "</li>");
			playerLocations[tmp[3]][tmp[4]] = pieceType(tmp[0],tmp[1],tmp[2],tmp[3],tmp[4]);
			if(tmp.length>6) {
				playerLocations[tmp[5]][tmp[6]] = 0;
				if(tmp.length>10) {
					playerLocations[tmp[9]][tmp[10]] = 0;
					playerLocations[tmp[3]][tmp[4]] = 0;
					playerLocations[tmp[7]][tmp[8]] = pieceType(tmp[0],tmp[1],tmp[2],tmp[3],tmp[4]);
					if(tmp.length>14) {
						playerLocations[tmp[13]][tmp[14]] = 0;
						playerLocations[tmp[7]][tmp[8]] = 0;
						playerLocations[tmp[11]][tmp[12]] = pieceType(tmp[0],tmp[3],tmp[4],tmp[7],tmp[8]);
						if(tmp.length>18) {
							playerLocations[tmp[17]][tmp[18]] = 0;
							playerLocations[tmp[11]][tmp[12]] = 0;
							playerLocations[tmp[15]][tmp[16]] = pieceType(tmp[0],tmp[7],tmp[8],tmp[11],tmp[12]);
						}
					}
				}
			}
			playerLocations[tmp[1]][tmp[2]] = 0;
		}
		drawPlayers();
	}
}

function play() {
	setTimeout(function() {
		currMove++;
		handleMove(currMove);
		$('#frame').val(currMove);
		$('#frame').slider('refresh');
		if(currMove<=gameLog.length && isPlaying) {
			play();
		} else {
			$('#play').attr('value','Play');
			$('#play').button('refresh');
			isPlaying = false;
		}
	}, 500)
}

$('#play').click(function() {
	if(!isPlaying) {
		$('#play').attr('value','Pause');
		$('#play').button('refresh');
		isPlaying = true;
		currMove = $('#frame').val();
		play();
	} else {
		$('#play').attr('value','Play');
		$('#play').button('refresh');
		isPlaying = false;
	}
});

$('#reset').click(function() {
	$('#frame').val(0);
	$('#frame').slider('refresh');
	resetBoard();
	drawPlayers();
});

$(document).ready(function() {
	createBoard();
	resetBoard();
	drawPlayers();
	$.get('checkers.txt', function(data) {
		gameLog = data.split('\n');
		$('#frame').prop({
			max: gameLog.length
		}).slider("refresh");
	});
});