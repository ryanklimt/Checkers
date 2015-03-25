var playerLocations = new Array();
var letters = ['A','B','C','D','E','F','G','H'];
var gameLog = new Array();
var currMove = 0;
var isPlaying = false;

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
	if((piece == 1 || piece == 2) && endX == 'H') {
		piece = 2;
	} else if((piece == 3 || piece == 4) && endX == 'A') {
		piece = 4;
	}
	return piece;
}

function handleMove(move) {
	if(move<=gameLog.length) {
		resetBoard();
		$('.moves').empty();
		if(move == 0) $('.moves').append('<li><em>Empty</em></li>');
		for(var i=0;i<move;i++) {
			var tmp = gameLog[i].split(' ');
			var moves = tmp[0].split(':');
			$('.moves').prepend('<li>[' + (i+1) + '] Player ' + (i%2+1) + ': ' + tmp[0] + '</li>');

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
	}, 2500/$('#speed').val())
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
	$('.moves').empty();
	$('.moves').append('<li><em>Empty</em></li>');
	currMove = 0;
	resetBoard();
	drawPlayers();
});

$('#file').change(function(e) {
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