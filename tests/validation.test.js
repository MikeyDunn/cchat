const test = require('tape')
const Validation = require('../services/validation')

test('Validation -- Valid String', tape => {
  const validate = new Validation()

  // Test 1 does not pass as string
  const intInvalid = validate.validString(1)
  tape.false(intInvalid.valid)

  // Test object does not pass as string
  const objInvalid = validate.validString({})
  tape.false(objInvalid.valid)

  // Test that string has valid length
  const lengthInvalid = validate.validString('')
  tape.false(lengthInvalid.valid)

  // Test random string passes
  const stringValid = validate.validString('test')
  tape.true(stringValid.valid)
  tape.equal(stringValid.message, 'test')

  tape.end()
})

test('Validation -- Throttle Detection', tape => {
  const validate = new Validation()

  // Test successive posts under throttle limit fails
  validate.lastPostTime = new Date()
  const throttleInvalid = validate.throttleDetection('test')
  tape.false(throttleInvalid.valid)

  // Test that posting after throttle time passes
  validate.lastPostTime = new Date() - (validate.throttleTime + 1)
  const throttleValid = validate.throttleDetection('test')
  tape.true(throttleValid.valid)
  tape.equal(throttleValid.message, 'test')

  tape.end()
})

test('Validation -- Character Limit', tape => {
  const validate = new Validation()

  // Test that a string over max characters limit fails
  let overString = ''
  for (let i = 0; i < validate.maximumLength; i++) {
    overString += 'a'
  }
  const limitInvalid = validate.characterLimit(overString)
  tape.false(limitInvalid.valid)

  // Test the string trimmed passes
  const underString = overString.substring(0, validate.maximumLength - 1)
  const limitValid = validate.characterLimit(underString)
  tape.true(limitValid.valid)
  tape.equal(limitValid.message, underString)

  tape.end()
})

test('Validation -- Blacklist String', tape => {
  const validate = new Validation()
  const blacklistString = validate.blacklist[0]

  // Test that a blacklist element triggers test
  const blacklistInvalid = validate.stringBlacklist(blacklistString)
  tape.false(blacklistInvalid.valid)

  // Test that a random message passes
  const blacklistValid = validate.stringBlacklist('test')
  tape.true(blacklistValid.valid)
  tape.equal(blacklistValid.message, 'test')

  tape.end()
})

test('Validation -- Duplicate String', tape => {
  const validate = new Validation()

  // Test seeded historyArr triggers duplicate message
  validate.historyArr.push('test')
  const duplicateInvalid = validate.duplicateMessage('test')
  tape.false(duplicateInvalid.valid)

  // Test no longer duplicate after popping historyArr
  validate.historyArr.pop()
  const duplicateValid = validate.duplicateMessage('test')
  tape.true(duplicateValid.valid)
  tape.equal(duplicateValid.message, 'test')

  tape.end()
})

test('Validation -- Store History', tape => {
  const validate = new Validation()

  // Test that store adds to historyArr
  validate._storeHistory('test')
  tape.equal(validate.historyArr.pop(), 'test')

  // Test that no more than historyMax elements can be added
  for (let i = 0; i < validate.historyMax + 1; i++) {
    validate._storeHistory('test')
  }
  tape.equal(validate.historyArr.length, validate.historyMax)

  tape.end()
})
