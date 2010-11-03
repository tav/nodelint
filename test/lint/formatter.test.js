var vows = require('vows');
var assert = require('assert');
var formatter = require('../../lib/lint/formatter');

function createFormatter(options) {
	return new formatter.Formatter(options);
}

function createBase(options) {
	return new formatter.Base(options);
}

var FormatterTest = vows.describe('Formatter class').addBatch({
	"constructor()" : {
		topic : function (item) {
			return createFormatter();
		},
		'should not throw error for types cli, json, etc' : function (topic) {
			['cli', 'json', 'xml', 'textmate'].forEach(function (type) {
				assert.doesNotThrow(function () {
					createFormatter({type: type});
				});
			});
		}
	},
	"format()" : {
		topic : function (item) {
			return createFormatter({type: 'json'});
		},
		'should not throw error for types cli, json, etc' : function (topic) {
			['cli', 'json', 'xml', 'textmate'].forEach(function (type) {
				assert.doesNotThrow(function () {
					topic.format({});
				});
			});
		}
	},
});

var BaseTest = vows.describe('Base class').addBatch({
	"format(), formatSimple(), formatNormal(), formatFull()" : {
		topic : function (item) {
			return createBase();
		},
		'should throw error' : function (topic) {
			['format', 'formatSimple', 'formatNormal', 'formatFull'].forEach(function (method) {
				assert['throws'](function () {
					topic[method]();
				});
			});
		}
	}
});

exports.FormatterTest = FormatterTest;
exports.BaseTest = BaseTest;