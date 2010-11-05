var vows = require('vows');
var assert = require('assert');
var formatter = require('../../../lib/lint/formatter/vim');

function createFormatter(options) {
    return new formatter.Formatter(options);
}

function createReport() {
    return [
            {
                file : 'foo',
                error: {
                line: 12,
                character: 5,
                evidence: 'e',
                reason: 'r'
            }
            }
            ];
}

var FormatterTest = vows.describe('VIM Formatter class').addBatch({
    "format()" : {
    topic : function (item) {
    return createFormatter();
},
'should format empty data' : function (topic) {
    assert.equal(topic.format([]), '');
},
'should format simple data' : function (topic) {
    assert.equal(topic.format(createReport()), 'foo line 12 column 5 Error: r e');
}
}
});

exports.FormatterTest = FormatterTest;