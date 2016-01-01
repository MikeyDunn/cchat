window.onload = function () {

    // Chat Commands
    msg = function (text) {
        var d = new Date();
        socket.emit('send', { message: text });
        return d;
    };

    help = function(){};
    help.toString = function(){return "lets do this"};


    // Message styles
    var chatStyle = 'color: #800080; font-size:15px; font-family: helvetica;';
    var archStyle = 'color: #a694a6; font-size:15px; font-family: helvetica;';
    var sysStyle = 'color: #ccc; font-size:12px; font-family: helvetica;';


    // Initial messages
    console.log('%c-- use msg(string) to chat', sysStyle);
    for(var i = 0; i<chatLog.length; i++) {
        console.log('%c' + chatLog[i], archStyle)
    }


    // Message handler
    var socket = io.connect('http://localhost:3700');
    socket.on('message', function (data) {

        if (data.message) {

            if (data.type === 'system') {

                console.log('%c' + data.message, sysStyle);

            } else {

                console.log('%c' + data.message, chatStyle);

            }

        }

    });
}
