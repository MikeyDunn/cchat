// Required
const Messaging = require('./services/messaging')
const Logging = require('./services/logging')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

// Helpers
const staticExpress = require('express').static('public')
const indexFile = `${__dirname}/templates/index.html`
const getRes = (req, res) => res.sendFile(indexFile)

// Application Settings
server.listen(8080)
app.use(staticExpress)
app.get('*', getRes)

// Socket IO
io.sockets.on('connection', function(socket) {
  const msg = new Messaging(io, socket)
  const log = new Logging()

  // Log new user
  const { address } = socket.handshake
  const { clientsCount } = io.engine
  const connectedLog = `${address} connected -- ${clientsCount} total connections`
  log.success(connectedLog)

  // Broadcast new user message
  const connectedMsg = 'new user connected'
  msg.sendSysBroadcast(connectedMsg)

  // Send intro messager
  const introMsg = '-- use msg(string) to chat\n-- or type "msg" for prompt'
  msg.sendSysMessage(introMsg)

  // Send message history
  msg.sendHistory()

  // Message Handler
  socket.on('send', msg.sendMessage.bind(msg))
})
