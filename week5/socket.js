// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/canvas_socket.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading canvas_socket.html');
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

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', function (socket) {
	//Connect to server
	console.log("We have a new client: " + socket.id);

	var playerId = -1;
	playerId = players.length;
	players[playerId] = socket.id;
	console.log("Player ID: " + playerId);

	//Send new player ID to client
	socket.emit('join', playerId);

	//Emit list of players to everyone
	io.sockets.emit('list', players);

	socket.on('otherkeys', function (data) {
		console.log(data);

		socket.broadcast.emit('otherkeys', data);
	});
		
	socket.on('disconnect', function() {

		io.sockets.emit('leave', playerId);
		
		players.splice(playerId, 1);

		console.log("removing player ID: " + playerId);

	});
});