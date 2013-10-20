// HTTP Portion
var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {

	fs.readFile(__dirname + '/socket_game.html', 

		function (err, data) {

			if (err) {
				res.writeHead(500);
				return res.end('Error loading canvas_socket.html');
			}

			res.writeHead(200);
			res.end(data);
  		}
  	);
}

var io = require('socket.io').listen(httpServer,{log: false});

var players = new Array();
var idGenerator = 0;

io.sockets.on('connection', function (socket) {

	var playerId = idGenerator++;
	socket.emit("list", players);

	var player = createChar(playerId);
	players.push(player);
	io.sockets.emit("join", player);
	
	console.log("We have a new client: " + socket.id);

		// for (i = 0; i < users.length; i++) {
		// 	socket.emit('other_id', i);
		// }

		// var myId = -1;

		// myId = users.length;
		// users[myId] = socket.id;

		// console.log("ID:" + myId);

		// socket.broadcast.emit('other_id', myId);
		// socket.emit('set_id', myId);

		socket.on('othermouse', function (data) {
			// Data comes in as whatever was sent, including objects
			//console.log("Received: 'othermouse' " + data.x + " " + data.y);
			
			// Send it to all of the clients
			socket.broadcast.emit('othermouse', data);
		});
		
		
		socket.on('disconnect', function() {

			var sId = "character" + playerId;

			for (var i = 0; i < players.length; i++) {
				var player = players[i];

				if (player.id == sId) {
					io.sockets.emit('leave', {id: player.id});
					players.splice(i, 1);
					break;
				}
			}

			// console.log("Client has disconnected " + socket.id);

			// users.splice(myId, 1);

			// socket.broadcast.emit('disconnect', myId);
			//console.log(users);

		});
	}
);

function createChar (pid) {
	var player = {
		src: "http://itp.nyu.edu/~jab680/assets/pixel1.png",
		pid: "character" + pid
	};
	return player;
}