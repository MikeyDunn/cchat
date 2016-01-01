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

    socket.emit('message', {

        message: 'new user connected',
        type: 'system'

    });
    socket.on('send', function (data) {

        io.sockets.emit('message', data);

        // Save lat 5 messages for archive
        chatLog.push(data.message);
        if (chatLog.length > 5) {
            chatLog.shift();
        }

        // Log chat
        console.log(
            data.message +
            '\n -- ' + Date() +
            '\n -- ' + socket.handshake.address
        );

    });

})

console.log("Listening on port " + port);
