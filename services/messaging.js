const Logging = require('./logging')
const Validation = require('./validation')

// Message history for new connection
const history = []

class Messaging {
  constructor(io, socket) {
    // Services
    this.log = new Logging()
    this.validate = new Validation()
    this.io = io
    this.socket = socket

    // Config
    this.historyMax = 5

    // Props
    this.identifier = this.socket.handshake
      ? this.socket.handsahke.address
      : null
  }

  sendMessage(message) {
    // Test message against all validations and emit
    if (!this._isValid(message)) return
    this.io.sockets.emit('message', message) // change to broadcast?????

    // Store message in history for new connection
    this._pushHistory(message)

    // Log message
    this.log.default(`${this.identifier} -- ${message}`)
  }

  sendSysMessage(message) {
    // Emit system messages privately to connection
    this.socket.emit('sysMessage', message)
  }

  sendSysBroadcast(message) {
    // Emit system message to all connections
    this.socket.broadcast.emit('sysMessage', message)
  }

  sendHistory() {
    // Send tail of message history to new connection
    // Use archived message styling
    this._getHistory().forEach(message => {
      this.socket.emit('archMessage', message)
    })
  }

  _pushHistory(message) {
    history.push(message)

    // Keep last nth of messages for history
    if (history.length > this.historyMax) history.shift()
  }

  _getHistory() {
    return history
  }

  _isValid(message) {
    // Validation wrapper for sending system error messages
    const { valid, error } = this.validate.isValid(message)
    if (!valid) {
      // Return error message to user
      this.sendSysMessage(error)

      // Log error
      this.log.fail(`${this.identifier} -- ${error}`)
    }
    return valid
  }
}

module.exports = Messaging
