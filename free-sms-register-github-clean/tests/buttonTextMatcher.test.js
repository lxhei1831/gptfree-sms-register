const test = require('node:test');
const assert = require('node:assert/strict');

const {
    PHONE_LOGIN_BUTTON_TEXTS,
    buttonTextMatches,
} = require('../src/buttonTextMatcher');

test('phone login candidates include current Chinese phone-number button text', () => {
    assert.equal(buttonTextMatches('使用电话号码继续', PHONE_LOGIN_BUTTON_TEXTS), true);
});

test('buttonTextMatches handles case and whitespace differences', () => {
    assert.equal(buttonTextMatches('  Continue   with   Phone Number  ', PHONE_LOGIN_BUTTON_TEXTS), true);
});
