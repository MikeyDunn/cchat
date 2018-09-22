const test = require('tape')
const MockedSocket = require('socket.io-mock')
const Messaging = require('../services/messaging')

test('Messaging -- Send Message', tape => {
  let socket = new MockedSocket()
  let io = { sockets: socket.socketClient }
  let message = new Messaging(io, {})

  tape.plan(2)

  // Test that message is received to socket
  socket.on('message', message => tape.equal(message, 'test'))
  message.sendMessage('test')

  // Test that message is stored
  const historyArr = message._getHistory()
  const historyLast = historyArr.pop()
  tape.equal(historyLast, 'test')
})

test('Messaging -- Send System Message', tape => {
  let socket = new MockedSocket()
  let message = new Messaging(null, socket.socketClient)

  tape.plan(1)

  // Test that a system message is received to socket
  socket.on('sysMessage', message => tape.equal(message, 'test'))
  message.sendSysMessage('test')
})

test.skip('Messaing -- System Broadcast', tape => {
  // Socket.io-Mock does not offer broadcast mocking
})

test('Messaging -- Send History', tape => {
  let socket = new MockedSocket()
  let message = new Messaging(null, socket.socketClient)

  tape.plan(1)

  // Test that a complete history is returned
  const stringArray = ['a', 'b', 'c', 'd', 'e']
  const archiveArray = []
  stringArray.forEach(message._pushHistory.bind(message))
  socket.on('archMessage', message => archiveArray.push(message))
  message.sendHistory()
  tape.deepEqual(archiveArray, stringArray)
})

test('Messaing -- Push/Get History', tape => {
  let socket = new MockedSocket()
  let message = new Messaging(null, socket.socketClient)

  tape.plan(1)

  // Testing pushing and getting of history
  message._pushHistory('test')
  const historyString = message._getHistory().pop()
  tape.equal(historyString, 'test')
})
