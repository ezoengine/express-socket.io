var appPort = 8888;
var express = require('express'), app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
server.listen(appPort);

console.log("Server listening on port 8888");

io.sockets.on('connection', function (socket) { // First connection
	socket.on('message', function (data) {
		//socket.broadcast.emit('message', "broadcast message.");
		socket.send("broadcast message.");
	});
});

//process upload files
app.use(function(req, res, next){
    console.log('Step1:save files.');
    if(req.method === 'POST' && req.headers['content-type'].indexOf("multipart/form-data") !== -1){
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files){
            req.files = files;
            for (var key in files) {
                var filesArray =files[key];
                for(var i=0;i<filesArray.length;i++){
                    var file = filesArray[i];
                    var tmp_path = file.path
                    var target_path = __dirname + '/uploads/' + file.originalFilename;
                    fs.renameSync(file.path, target_path, function(err) {
                        if(err) console.error(err.stack);
                    });
                }
            }
            next();
        });
    }
    else next();
});

app.post('/upload', function(req, res, next){
    console.log('Step2: response result.');
    res.send(JSON.stringify(req.files));
});