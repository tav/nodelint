var vows = require('vows');
var assert = require('assert');
var parser = require('../../lib/lint/parser');

function createParser(options) {
	return new parser.Parser(options);
}

var ParserTest = vows.describe('Parser class').addBatch({
	"update()" : {
		topic : function (item) {
			return createParser();
		},
		'should return this' : function (topic) {
			assert.equal(topic.update(), topic);
		},
		'should concatenate source' : function (topic) {
			topic.update();
			assert.equal(topic._source, '');
			topic.update('foo');
			assert.equal(topic._source, 'foo');
			topic.update();
			assert.equal(topic._source, 'foo');
			topic.update('');
			assert.equal(topic._source, 'foo');
			topic.update('bar');
			assert.equal(topic._source, 'foobar');
		}
	},
	"reset()" : {
		topic : function (item) {
			return createParser();
		},
		'should return this' : function (topic) {
			assert.equal(topic.reset(), topic);
		},
		'should empty source' : function (topic) {
			topic.reset();
			topic.update('foo-bar').update('-baz');
			assert.equal(topic._source, 'foo-bar-baz');
			topic.reset();
			assert.equal(topic._source, '');
		}
	},
	"validate()" : {
		topic : function (item) {
			return createParser();
		},
		'should return this' : function (topic) {
			assert.equal(topic.validate(), topic);
		}
	},
	"isValid()" : {
		topic : function (item) {
			return createParser();
		},
		'should return true if empty' : function (topic) {
			topic.reset();
			assert.equal(topic.isValid(), true);
		},
		'should return true if valid javascript (simple)' : function (topic) {
			topic.reset();
			topic.update('var foo = "bar";');
			assert.equal(topic.isValid(), true);
			
			topic.reset();
			topic.update('var foo = "baz";');
			assert.equal(topic.isValid(), true);
		},
		'should return false if invalid javascript (simple)' : function (topic) {
			topic.reset();
			topic.update('var foo = "bar"');//(missing semicolon)
			assert.equal(topic.isValid(), false);
			
			topic.update(';');
			assert.equal(topic.isValid(), true);
		}
	},
	"getReport()" : {
		topic : function (item) {
			return createParser();
		},
		'should return new object' : function (topic) {
			assert.ok(typeof(topic.getReport()) === 'object');
			topic.update('foo');
			assert.ok(typeof(topic.getReport()) === 'object');
			topic.reset();
			assert.ok(typeof(topic.getReport()) === 'object');
		}
	}
	
});

exports.ParserTest = ParserTest;