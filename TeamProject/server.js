//Ju

var http = require("http");
var fs = require("fs");
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler (req, res){

        fs.readFile(__dirname + '/index.html',
                function (err, data) {
                        if (err) {
                                res.writeHead(500);
                                return res.end('Error loading index.html');
                        }

                        res.writeHead(200);
                        res.end(data);
                });
}


var io = require('socket.io').listen(httpServer,{log: false});

var users = new Array();

var totalScore = 0;
var threshold;
var accX = 0;
var accY = 0;
var velX = 0;
var velY = 0;
var xPos = 450;
var yPos = 250;
var width = 900;
var height = 500;
var radius = 30;

var serverCounter = 0;

// var randomAcc = function() {
// 	accX = Math.random();
// 	accY = Math.random();
// };

var updateBall = function() {

	accX = Math.random();
    accY = Math.random();

    velX += accX;
    velY += accY;

    xPos += velX;
    yPos += velY;

    if (xPos + radius > width) {
    	xPos = width - radius;
    	velX *= -1;
    	accX = 0;
    }

    if (xPos - radius < 0) {
    	xPos = 0 + radius;
        velX *= -1;
        accX = 0;
    }

    if (yPos + radius > height) {
    	yPos = height - radius;
    	velY *= -1;
    	accY = 0;
    }

    if (yPos - radius < 0) {
    	yPos = 0 + radius;
        velY *= -1;
        accY = 0;
    }
};

setInterval(updateBall, 30);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {

		console.log("We have a new client: " + socket.id);

		setInterval(function() {
			io.sockets.emit('xPos', xPos);
			io.sockets.emit('yPos', yPos);

			//console.log(xPos, yPos);

		}, 30);

		var userId = -1;
		userId = users.length;
		users[users.length] = socket.id;
		console.log(users.length);
		
		// When this user "send" from clientside javascript, we get a "message"
		// client side: socket.send("the message");  or socket.emit('message', "the message");
		socket.on('message', function() {

			socket.emit('init', userId);

			// for(var i = 0; i < users.length; i++){
			// 	io.sockets.emit('init', userId);
			// }
		});

		socket.on('mousecoords', function (data) {
			socket.broadcast.emit('mousecoords', data);
			//console.log(data);
		});

		socket.on('playerscore', function () {
			totalScore++;
			console.log(totalScore);
			// console.log(data);

			// for(var i = 0; i<data.length; i++){
			// 	if(data[i].onCircle == true){
			// 		serverCounter++;
			// 	}
			// }
			// //if (data.counter = 1) {
			// //	serverCounter++;
			// 	console.log(serverCounter);
			// //};

			if (totalScore >= 700) {

				io.sockets.emit('threshold');
			}
		});
			// totalScore++;
			// console.log(totalScore);

			// if (totalScore = 500) {
			// }
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
		});
	}
);