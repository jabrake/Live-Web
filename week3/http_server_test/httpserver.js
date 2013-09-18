// Use the http module: http://nodejs.org/api/http.html
var http = require('http');

// http://nodejs.org/api/http.html#http_event_request
function onRequest(req, res) {
	//req is an IncominMessage: http://nodejs.org/api/http.html#http_http_incomingmessage
	//res is a ServerResponse: http://nodejs.org/api/http.html#http_class_http_serverresponse
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
	
	// Send a log message to the console
	console.log("Got a request " + req.url);
}

// Call the createServer method, passing in an anonymous callback function that will be called when a request is made
var httpServer = http.createServer(onRequest);

// Tell that server to listen on port 8080
httpServer.listen(8080);  

console.log('Server listening on port 8080');