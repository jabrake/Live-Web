// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/' + req.url, 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + req.url);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer,{log: false});

var players = new Array();
var playerId = null;
var displaySocket = null;

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', function (socket) {
	//Connect to server

	if (displaySocket === null) {
		console.log('Setting displaySocket');

		displaySocket = socket.id;
		io.sockets.emit('players', {id: displaySocket, type: "display"});

		console.log('displaySocket has been set:' + displaySocket);
	}
	else if (displaySocket !== null) {
		console.log("We have a new player joining: " + socket.id);

		playerId = players.length;
		players[playerId] = socket.id;
		io.sockets.emit('players', {socketId: socket.id, type: "player" + playerId});

		console.log("New player's ID: " + playerId);
	}

	socket.on('playerConnect', function() {
		io.sockets.emit('createPlayer');
	})

	socket.on('move', function (data) {
		// console.log("move: " + JSON.stringify(data));
		io.sockets.emit('move', data);
	});
		
	socket.on('disconnect', function() {

		io.sockets.emit('leave', {socketId: socket.id, id: playerId});
		
		players.splice(playerId, 1);

		console.log("removing player ID: " + playerId);

	});
});