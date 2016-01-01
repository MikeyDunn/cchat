window.onload = function () {

    // Chat Commands
    msg = function (text) {
        socket.emit('send', { message: text });
    };


    // Message styles
    var chatStyle = 'color: #800080; font-size:15px; font-family: helvetica;';
    var archStyle = 'color: #a694a6; font-size:15px; font-family: helvetica;';
    var sysStyle = 'color: #ccc; font-size:12px; font-family: helvetica;';


    // Message handler
    var socket = io.connect('http://54.200.115.24:3700');
    //var socket = io.connect('http://localhost:3700');
    socket.on('message', function (data) {

        if (data.message) {

            var style = (data.type === 'system') ? sysStyle : chatStyle;
            addMessage({
                'message': data.message,
                'type': style
            });

        }

    });


    var msgQueue = [];
    addMessage = function (msg) {

        msgQueue.push(msg);
        console.clear();

        // Output messages in queue
        for (var i = 0; i < msgQueue.length; i++) {

            console.log('%c' + msgQueue[i].message, msgQueue[i].type)

        }

    }


    // Initial messages
    // Add instruction messages
    addMessage({
        'message': '-- use msg(string) to chat',
        'type': sysStyle
    });
    // Add archive messages
    for(var i = 0; i<chatLog.length; i++) {

        addMessage({
            'message': chatLog[i],
            'type': archStyle
        })

    }
}
