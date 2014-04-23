var appPort = 8888;
var express = require('express'), app = express();
var http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// Views Options
app.use(express.static(__dirname + '/public'));
server.listen(appPort);
console.log("Server listening on port 8888");

io.sockets.on('connection', function (socket) { // First connection
	socket.on('message', function (data) {
		//socket.broadcast.emit('message', "broadcast message.");
		socket.send("broadcast message.");
	});
});
