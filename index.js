// Required
var msgModule = require('./validateMsg.js'),
    express = require('express'),
    app = express(),
    port = 3700,
    io = require('socket.io').listen(app.listen(port)),
    fs = require('fs');

// Application settings
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){

    res.render('page');

})

// Message styles
var chatLog = ['archive cleared'],
    chatStyle = 'color: #800080; font-size:15px; font-family: helvetica;',
    archStyle = 'color: #a694a6; font-size:15px; font-family: helvetica;',
    sysStyle = 'color: #ccc; font-size:12px; font-family: helvetica;';

// Socket IO functions
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

        message: '-- use msg(string) to chat\n-- or type "msg" for prompt',
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

        // Validate that the message should be emitted
        msgModule.validate(socket, data).then(function(msgValidate){

            if( msgValidate.isValid ) {

                // Emit to client handler
                data.style = chatStyle;
                io.sockets.emit('message', data);
                console.log(socket.handshake.address + ' --- ' + data.message);

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

            } else {

                // Use chatStyle for client message if the user is banned
                // This will effectively create a shadow ban
                var style =
                    msgValidate.consoleMessage.substring(0,6) === 'Banned' ?
                    chatStyle :
                    sysStyle;

                socket.emit('message', {

                    message: msgValidate.clientMessage,
                    style: style

                });
                console.log(
                    '\x1b[31m',
                    msgValidate.consoleMessage ,
                    '\x1b[0m'
                );

            }

        });

    });

})
