/**
 * Import
 */
var util = require(process.binding('natives').util ? 'util' : 'sys');
var path = require('path');
var formatter = require('../formatter');

/**
 * Formatter constructor
 * 
 * @constructor
 * @extends lint.formatter.Base
 * @param {Object} options
 */
function Formatter(options) {
	formatter.Base.call(this, options);

	this._pretty = options.pretty === undefined ? false : options.pretty;
	this._tab = options.tab || "\t";
	
	this.__tab = (this._pretty) ? this._tab : '';
	this.__eol = (this._pretty) ? this._eol : '';
}
util.inherits(Formatter, formatter.Base);

/**
 * 
 * @return {string}
 */
Formatter.prototype.formatNormal = function (data) {
	var i, error, length, file, output;

	output = '';
	output += this._line(0, '<?xml version="1.0" encoding="UTF-8" ?>');
	output += this._line(0, '<jslint>');
	for (i = 0, length = data.length; i < length; i += 1) {
		file = data[i].file;
		error = data[i].error;

		output += this._line(1, '<file name="' + file + '">');
		output += this._line(2, '<issue'
				+ ' ' + this._attribute('char', error.character)
				+ ' ' + this._attribute('evidence', error.evidence)
				+ ' ' + this._attribute('line', error.line)
				+ ' ' + this._attribute('reason', error.reason)
				+ ' />'
		);
		output += this._line(1, '</file>');
	}
	output += this._line(0, '</jslint>');
	return output;
};

Formatter.prototype._line = function (indentation, content) {
	if (!content || content == '') {
		return this.__eol;
	}
	return this._tab(indentation, content + this.__eol);
};

Formatter.prototype._tab = function (count, content) {
	if (tab === '') {
		return content;
	}
	
	var output = '';
	while (count > 0) {
		output += this.__tab;
		count -= 1;
	}
	output += content;
	return output;
};

Formatter.prototype._attribute = function (name, value) {
	return name + '="' + this._escape(value || '') + '"';
};

Formatter.prototype._escape = function (string) {
	return (string) ? string.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
};

/**
 * Exports
 */
exports.Formatter = Formatter;