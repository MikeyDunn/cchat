var chatLog = ['archive cleared'];
var fs = require('fs');
var express = require('express');
var app = express();
var port = 3700;
var io = require('socket.io').listen(app.listen(port));


// Application settings
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){

    res.render('page');

})


// Message styles
var chatStyle = 'color: #800080; font-size:15px; font-family: helvetica;';
var archStyle = 'color: #a694a6; font-size:15px; font-family: helvetica;';
var sysStyle = 'color: #ccc; font-size:12px; font-family: helvetica;';


io.sockets.on('connection', function (socket) {

    // Log connected user
    console.log(
        '\x1b[32m',
        socket.handshake.address + ' connected -- ' +
        io.engine.clientsCount + ' total connections' ,
        '\x1b[0m'
    );
    // Send app instructions
    socket.emit('message', {

        message: '-- use msg(string) to chat',
        style: sysStyle

    });
    // Send archive messages
    for(var i = 0; i<chatLog.length; i++) {

        socket.emit('message', {

            message: chatLog[i],
            style: archStyle

        });

    };
    // Send new user status to all connections
    io.sockets.emit('message', {

        message: 'new user connected',
        style: sysStyle

    });


    // Event handler
    socket.on('send', function (data) {

        // Rules for omitting messages
        // Character limit
        if ( data.message.length > 150 ) {

            socket.emit('message', {

                message: 'messages may be a maximum of 150 characters',
                style: sysStyle

            });
            console.log(
                '\x1b[31m',
                '150 Limit --- ' + socket.handshake.address + ' ' + data.message.length + ' characters' ,
                '\x1b[0m'
            );
            return;

        }
        // Banned
        /*
        if (banned) {

            return;

        }
        if (throttled) {

            return;

        }
        */

        data.style = chatStyle;

        // Emit to client handler
        io.sockets.emit('message', data);

        // Save last 5 messages for archive
        chatLog.push(data.message);
        if (chatLog.length > 5) {
            chatLog.shift();
        }

        // Log messages
        fs.appendFile("msgLog.txt",
            data.message +
            ' || ' + Date() +
            ' || ' + socket.handshake.address +
            '\n'
        );
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
