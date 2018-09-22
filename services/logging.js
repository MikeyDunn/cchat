class Logging {
  constructor() {
    // Colors
    this.defaultColor = '\x1b[0m' // reset
    this.successColor = '\x1b[32m' // green
    this.failColor = '\x1b[31m' // red
  }

  success(message) {
    this._send(message, this.successColor)
  }

  default(message) {
    this._send(message, this.defaultColor)
  }

  fail(message) {
    this._send(message, this.failColor)
  }

  _send(message, color = this.defaultColor) {
    // Wrapper to better control console colors
    console.log(color, message, this.defaultColor)
  }
}

module.exports = Logging
