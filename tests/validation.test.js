const test = require('tape')
const Validation = require('../services/validation')

test('Validation -- Valid String', function(t) {
  const validate = new Validation()

  // Test 1 does not pass as string
  const intInvalid = validate.validString(1)
  t.false(intInvalid.valid)

  // Test object does not pass as string
  const objInvalid = validate.validString({})
  t.false(objInvalid.valid)

  // Test that string has valid length
  const lengthInvalid = validate.validString('')
  t.false(lengthInvalid.valid)

  // Test random string passes
  const stringValid = validate.validString('test')
  t.true(stringValid.valid)
  t.equal(stringValid.message, 'test')

  t.end()
})

test('Validation -- Throttle Detection', function(t) {
  const validate = new Validation()

  // Test successive posts under throttle limit fails
  validate.lastPostTime = new Date()
  const throttleInvalid = validate.throttleDetection('test')
  t.false(throttleInvalid.valid)

  // Test that posting after throttle time passes
  validate.lastPostTime = new Date() - (validate.throttleTime + 1)
  const throttleValid = validate.throttleDetection('test')
  t.true(throttleValid.valid)
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
  t.false(limitInvalid.valid)

  // Test the string trimmed passes
  const underString = overString.substring(0, validate.maximumLength - 1)
  const limitValid = validate.characterLimit(underString)
  t.true(limitValid.valid)
  t.equal(limitValid.message, underString)

  t.end()
})

test('Validation -- Blacklist String', function(t) {
  const validate = new Validation()
  const blacklistString = validate.blacklist[0]

  // Test that a blacklist element triggers test
  const blacklistInvalid = validate.stringBlacklist(blacklistString)
  t.false(blacklistInvalid.valid)

  // Test that a random message passes
  const blacklistValid = validate.stringBlacklist('test')
  t.true(blacklistValid.valid)
  t.equal(blacklistValid.message, 'test')

  t.end()
})

test('Validation -- Duplicate String', function(t) {
  const validate = new Validation()

  // Test seeded historyArr triggers duplicate message
  validate.historyArr.push('test')
  const duplicateInvalid = validate.duplicateMessage('test')
  t.false(duplicateInvalid.valid)

  // Test no longer duplicate after popping historyArr
  validate.historyArr.pop()
  const duplicateValid = validate.duplicateMessage('test')
  t.true(duplicateValid.valid)
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
