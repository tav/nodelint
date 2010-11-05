var vows = require('vows');
var assert = require('assert');
var formatter = require('../../../lib/lint/formatter/xml');

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

var FormatterTest = vows.describe('Formatter class').addBatch({
	"format() / pretty=false" : {
		topic : function (item) {
			return createFormatter();
		},
		'should return format empty content' : function (topic) {
			assert.equal(topic.format([]), '<?xml version="1.0" encoding="UTF-8" ?><jslint></jslint>');
		},
		'should return format simple content' : function (topic) {
			var expected =  '<?xml version="1.0" encoding="UTF-8" ?><jslint><file name="foo"><issue line="12" char="5" evidence="e" reason="r" /></file></jslint>';
			
			assert.equal(topic.format(createReport()), expected);
		}
	},
	"format() / pretty=true" : {
		topic : function (item) {
			return createFormatter({pretty: true});
		},
		'should return format empty content' : function (topic) {
			var expected = '<?xml version="1.0" encoding="UTF-8" ?>\n<jslint>\n</jslint>\n';
			assert.equal(topic.format([]), expected);
		},
		'should return pretty xml formatted content' : function (topic) {
			var expected = '<?xml version="1.0" encoding="UTF-8" ?>\n<jslint>\n\t<file name="foo">\n\t\t<issue line="12" char="5" evidence="e" reason="r" />\n\t</file>\n</jslint>\n';
			assert.equal(topic.format(createReport()), expected);
		}
	},
	"format() / pretty=true, tab='  '" : {
		topic : function (item) {
			return createFormatter({pretty: true, tab: '  '});
		},
		'should return format empty content' : function (topic) {
			var expected = '<?xml version="1.0" encoding="UTF-8" ?>\n<jslint>\n</jslint>\n';
			assert.equal(topic.format([]), expected);
		},
		'should return pretty xml formatted content' : function (topic) {
			var expected = '<?xml version="1.0" encoding="UTF-8" ?>\n<jslint>\n  <file name="foo">\n    <issue line="12" char="5" evidence="e" reason="r" />\n  </file>\n</jslint>\n';
			assert.equal(topic.format(createReport()), expected);
		}
	},
	"format() / pretty=true, eol='\n\r'" : {
		topic : function (item) {
			return createFormatter({pretty: true, eol: '\n\r'});
		},
		'should return format empty content' : function (topic) {
			var expected = '<?xml version="1.0" encoding="UTF-8" ?>\n\r<jslint>\n\r</jslint>\n\r';
			assert.equal(topic.format([]), expected);
		},
		'should return pretty xml formatted content' : function (topic) {
			var expected = '<?xml version="1.0" encoding="UTF-8" ?>\n\r<jslint>\n\r\t<file name="foo">\n\r\t\t<issue line="12" char="5" evidence="e" reason="r" />\n\r\t</file>\n\r</jslint>\n\r';
			assert.equal(topic.format(createReport()), expected);
		}
	}
});

exports.FormatterTest = FormatterTest;