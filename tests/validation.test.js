const test = require('tape')
const Validation = require('../services/validation')

test('Validation -- Valid String', function(t) {
  const validate = new Validation()

  // Test 1 does not pass as string
  const intInvalid = validate.validString(1)
  t.equal(intInvalid.valid, false)

  // Test object does not pass as string
  const objInvalid = validate.validString({})
  t.equal(objInvalid.valid, false)

  // Test that string has valid length
  const lengthInvalid = validate.validString('')
  t.equal(lengthInvalid.valid, false)

  // Test random string passes
  const stringValid = validate.validString('test')
  t.equal(stringValid.valid, true)
  t.equal(stringValid.message, 'test')

  t.end()
})

test('Validation -- Throttle Detection', function(t) {
  const validate = new Validation()

  // Test successive posts under throttle limit fails
  validate.lastPostTime = new Date()
  const throttleInvalid = validate.throttleDetection('test')
  t.equal(throttleInvalid.valid, false)

  // Test that posting after throttle time passes
  validate.lastPostTime = new Date() - (validate.throttleTime + 1)
  const throttleValid = validate.throttleDetection('test')
  t.equal(throttleValid.valid, true)
  t.equal(throttleValid.message, 'test')

  t.end()
})

test('Validation -- Character Limit', function(t) {
  const validate = new Validation()

  // Test that a string over max characters limit fails
  let overString = ''
  for (let i = 0; i < validate.maximumLength; i++) {
    overString += 'a'
  }
  const limitInvalid = validate.characterLimit(overString)
  t.equal(limitInvalid.valid, false)

  // Test the string trimmed passes
  const underString = overString.substring(0, validate.maximumLength - 1)
  const limitValid = validate.characterLimit(underString)
  t.equal(limitValid.valid, true)
  t.equal(limitValid.message, underString)

  t.end()
})

test('Validation -- Blacklist String', function(t) {
  const validate = new Validation()
  const blacklistString = validate.blacklist[0]

  // Test that a blacklist element triggers test
  const blacklistInvalid = validate.stringBlacklist(blacklistString)
  t.equal(blacklistInvalid.valid, false)

  // Test that a random message passes
  const blacklistValid = validate.stringBlacklist('test')
  t.equal(blacklistValid.valid, true)
  t.equal(blacklistValid.message, 'test')

  t.end()
})

test('Validation -- Duplicate String', function(t) {
  const validate = new Validation()

  // Test seeded historyArr triggers duplicate message
  validate.historyArr.push('test')
  const duplicateInvalid = validate.duplicateMessage('test')
  t.equal(duplicateInvalid.valid, false)

  // Test no longer duplicate after popping historyArr
  validate.historyArr.pop()
  const duplicateValid = validate.duplicateMessage('test')
  t.equal(duplicateValid.valid, true)
  t.equal(duplicateValid.message, 'test')

  t.end()
})

test('Validation -- Store History', function(t) {
  const validate = new Validation()

  // Test that store adds to historyArr
  validate._storeHistory('test')
  t.equal(validate.historyArr.pop(), 'test')

  // Test that no more than historyMax elements can be added
  for (let i = 0; i < validate.historyMax + 1; i++) {
    validate._storeHistory('test')
  }
  t.equal(validate.historyArr.length, validate.historyMax)

  t.end()
})
