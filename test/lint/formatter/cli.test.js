var vows = require('vows');
var assert = require('assert');
var formatter = require('../../../lib/lint/formatter/cli');

function createFormatter(options) {
	options = options || {};
	options.colors = options.colors === undefined ? false : options.colors;
	return new formatter.Formatter(options);
}

function createReport() {
	return [
		{
			file : 'foo',
			error: {
				character: 'c',
				evidence: 'e',
				line: 'l',
				reason: 'r'
			}
		}
	];
}

var FormatterTest = vows.describe('Formatter class').addBatch({
	"format() / mode=simple" : {
		topic : function (item) {
			return createFormatter({mode: 'simple'});
		},
		'should return ' : function (topic) {
			assert.equal(topic.format(createReport()), '1 error\n');
		}
	},
	"format() / mode=normal" : {
		topic : function (item) {
			return createFormatter({mode: 'normal'});
		},
		'should return ' : function (topic) {
			assert.equal(topic.format(createReport()), 'foo: line l, character c r\ne\n1 error\n');
		}
	},
	"format() / mode=full" : {
		topic : function (item) {
			return createFormatter({mode: 'full'});
		},
		'should return ' : function (topic) {
			assert.equal(topic.format(createReport()), 'foo: line l, character c, r\ne\n1 error\n');
		}
	}
});

exports.FormatterTest = FormatterTest;