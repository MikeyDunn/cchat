var msgArr = [],
    fs = require('fs'),
    q = require('q');

module.exports.validate = function (socket, data) {

    var deferred = q.defer();

    // Timedout
    if ( socket.handshake.address in msgArr &&
         msgArr[socket.handshake.address].timeout === true ) {

        if ( Date.now() - msgArr[socket.handshake.address].date < 20000 ) {

            deferred.resolve({

                isValid: false,
                clientMessage: 'you have been timedout for ' + (20000 - (Date.now() - msgArr[socket.handshake.address].date))/1000 + 's',
                consoleMessage: 'Timedout --- ' + socket.handshake.address + ' timeout: ' + (Date.now() - msgArr[socket.handshake.address].date)

            });

        } else {

            msgArr[socket.handshake.address].timeout = false;
            msgArr[socket.handshake.address].count = 1;

        }

    }

    // Character limit
    if ( data.message.length > 150 ) {

        deferred.resolve({

            isValid: false,
            clientMessage: 'messages may be a maximum of 150 characters',
            consoleMessage: '150 Limit --- ' + socket.handshake.address + ' ' + data.message.length + ' characters'

        });

    }

    // Duplication
    if ( socket.handshake.address in msgArr &&
         msgArr[socket.handshake.address].message === data.message ) {

        deferred.resolve({

            isValid: false,
            clientMessage: 'messages may not be a consecutive repeat',
            consoleMessage: 'Repeat --- ' + socket.handshake.address

        });

    }

    // Throttle
    if ( socket.handshake.address in msgArr &&
         msgArr[socket.handshake.address].count > 2 ) {

        msgArr[socket.handshake.address].timeout = true

        deferred.resolve({

            isValid: false,
            clientMessage: 'your messaging has been throttled',
            consoleMessage: 'Throttled --- ' + socket.handshake.address + ' count ' + msgArr[socket.handshake.address].count

        });

    }

    // Banned words / links
    if ( data.message.indexOf('http://') >= 0 ||
         data.message.indexOf('www.') >= 0 ||
         data.message.indexOf('.com') >= 0  ) {

        deferred.resolve({

            isValid: false,
            clientMessage: 'messages may not contain links',
            consoleMessage: 'Link --- ' + socket.handshake.address

        });

    }

    // Banned Users
    fs.readFile('banList.txt', function (err, file) {

        // search ban list for user's IP
        if ( file.indexOf(socket.handshake.address) >= 0 ) {

            deferred.resolve({

                isValid: false,
                clientMessage: data.message,
                consoleMessage: 'Banned --- ' + socket.handshake.address + ' ' + data.message

            });



        } else {

            deferred.resolve({

                isValid: true

            });

        }

    });

    // Save to msg object
    // refresh count and date after 7s for throttle check
    if ( socket.handshake.address in msgArr &&
         Date.now() - msgArr[socket.handshake.address].date < 7000 ) {

        msgArr[socket.handshake.address].message = data.message;
        msgArr[socket.handshake.address].count++;

    } else {

        msgArr[socket.handshake.address] = {

            message: data.message,
            date: Date.now(),
            count: 1,
            timeout: false

        }

    }

    return deferred.promise;

}
