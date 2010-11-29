var assert = require('assert');
var lint = require('../lint/parser');

if (! assert.validateLint) {
    assert.validateLint = function (actual, message) {
        var result = lint.isValid(actual);
        
        if (!result) {
            assert.fail(actual, true, message || "{actual} does not validate LINT", "===", assert.validateLint);
        }
    };
}

if (! assert.validateLintFile) {
    assert.validateLintFile = function (actual, message) {
        var result = lint.isValidFileSync(actual);
        
        if (!result) {
            assert.fail(result, true, message || "{actual} file does not validate LINT", "===", assert.validateLint);
        }
    };
}