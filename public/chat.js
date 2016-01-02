window.onload = function () {

    // Chat Commands
    msg = function (text) {

        // Send message to server
        socket.emit('send', { message: text });

    };

    msg.toString = function () {

        text = prompt('enter your message');
        socket.emit('send', { message: text });

    }

    // Handle receiving messages
    // var socket = io.connect('http://54.200.115.24:80');
    var socket = io.connect('http://localhost:3700');
    socket.on('message', function (data) {

        if (data.message) {

            addMessage({
                'message': data.message,
                'style': data.style
            });

        }

    });

    // Console painting system
    var msgQueue = [];
    addMessage = function (msg) {

        msgQueue.push(msg);
        console.clear();

        // Output messages in queue
        for (var i = 0; i < msgQueue.length; i++) {

            console.log('%c' + msgQueue[i].message, msgQueue[i].style)

        }

    }

}
