class Validation {
  constructor() {
    // Storage
    this.historyArr = []
    this.lastPostTime = new Date()

    // Rules
    this.historyMax = 5
    this.maximumLength = 150
    this.throttleTime = 2000
    this.blacklist = ['http://', 'www.', '.com']
  }

  isValid(message) {
    // Validation Tests
    const vs = this.validString(message)
    if (!vs.valid) return vs
    const td = this.throttleDetection(message)
    if (!td.valid) return td
    const cl = this.characterLimit(message)
    if (!cl.valid) return cl
    const sb = this.stringBlacklist(message)
    if (!sb.valid) return sb
    const dm = this.duplicateMessage(message)
    if (!dm.valid) return dm

    // Store valid message
    this._storeHistory(message)

    // Return valid object
    return { valid: true, error: '', message }
  }

  validString(message) {
    const valid = typeof message === 'string' && message.length > 0
    const error = 'message was not a valid string'
    return { valid, error, message }
  }

  throttleDetection(message) {
    const currentTime = new Date()
    const differenceTime = currentTime - this.lastPostTime
    const valid = differenceTime > this.throttleTime
    const error = 'message has been sent to quickly'
    this.lastPostTime = currentTime
    return { valid, error, message }
  }

  characterLimit(message) {
    // Messages should not exceed the maximumLength
    const valid = message.length < this.maximumLength
    const error = `message exceeded maximum of ${this.maximumLength} characters`
    return { valid, error, message }
  }

  stringBlacklist(message) {
    // Messages should not contain strings in blacklist
    const containsWord = this.blacklist.some(word => message.indexOf(word) >= 0)
    const valid = !containsWord
    const error = 'message contained a blacklisted string'
    return { valid, error, message }
  }

  duplicateMessage(message) {
    // Messages should not be be exact duplicates
    const valid = this.historyArr.indexOf(message) === -1
    const error = 'message was a duplicate of a previous'
    return { valid, error, message }
  }

  _storeHistory(message) {
    // store message history for duplicate check
    // will check for duplicates in the past nth Messages
    // based on historyMax
    this.historyArr.push(message)
    if (this.historyArr.length > this.historyMax) this.historyArr.shift()
  }
}

module.exports = Validation
