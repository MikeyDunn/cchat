var chatLog = ['archive cleared'];
var express = require('express');
var app = express();
var port = 3700;
app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){

    res.render('page',  {
        pageData: {
            'chatLog': chatLog
        }
    });

})


io.sockets.on('connection', function (socket) {

    // New connection messaging
    console.log(
        '\x1b[31m',
        socket.handshake.address + ' connected' ,
        '\x1b[0m'
    );

    socket.emit('message', {

        message: 'new user connected',
        type: 'system'

    });

    // Event handler
    socket.on('send', function (data) {

        io.sockets.emit('message', data);

        // Save last 5 messages for archive
        chatLog.push(data.message);
        if (chatLog.length > 5) {
            chatLog.shift();
        }

        // Log chat
        console.log(
            data.message,
            '\x1b[36m',
            '\n -- ' + Date(),
            '\n -- ' + socket.handshake.address,
            '\x1b[0m'
        );

    });

})

console.log("Listening on port " + port);
