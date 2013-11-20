// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/happysadtweets.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading happysadtweets.html');
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

//Dependencies
// var twitter = require('ntwitter');
var twitter = require('mtwitter');

//Twitter Setup
var twit = new twitter({
	consumer_key: 'EyK85zjxfMoYNo3GJmLH0A',
	consumer_secret: '0hOo5MgpiMHodYtHubK8NHvcviv581rHRT3vJwTyZc',
	access_token_key: '57089769-Mfu2XL5zI4nH1V8p3eN74A9jpolQMleB6qsZein3A',
	access_token_secret: 'dnUZoXLpbGD8LC06n7KNq2DshiTlyFQbSVx04E'
});

// var listOfSearchWords = [
// 	':)',
// 	':('
// ].join(',');

// twit.stream('statuses/filter', {track: listOfSearchWords}, function (stream){
// 	stream.on('data', function (data){
// 		console.log(data.text);
// 	});
// });

io.sockets.on('connection', function (socket) {

	//Connect to server
	console.log("We have a connection: " + socket.id);

	//Search for happy tweets
	socket.on('happyRequest', function () {
		console.log("received request!");

		twit.get('search/tweets', {q: 'happy'}, function (err, data) {
			//console.log(data);
			socket.emit('happyTweets', data);
		});
	});

	//Search for sad tweets
	socket.on('sadRequest', function () {
		console.log("received request!");

		twit.get('search/tweets', {q: 'sad'}, function (err, data) {
			//console.log(data);
			socket.emit('sadTweets', data);
		});
	});
});

