var assert = require('assert');
var lint = require('../lint/parser');

if (! assert.validateLint) {
    assert.validateLint = function (actual, message) {
        var result = lint.isValid(actual);
        
        if (!result) {
            assert.fail(result, true, message || "LINT returned validation result {actual}", "===", assert.validateLint);
        }
    };
}

if (! assert.validateLintFile) {
    assert.validateLintFile = function (actual, message) {
        var result = lint.isValidFileSync(actual);
        if (!result) {
            assert.fail(result, true, message || "LINT returned validation result {actual}", "===", assert.validateLintFile);
        }
    };
}