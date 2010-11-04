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
	options =  options || {};
	
	formatter.Base.call(this, options);
	this._config.pretty = false;
	
	this.configure(options);
}
util.inherits(Formatter, formatter.Base);

/**
 * Configure the Formatter
 * 
 * @param {Object} options
 * @return this
 */
Formatter.prototype.configure = function (options) {
	if (options) {
		Formatter.super_.prototype.configure.call(this, options);
		
		if (options.pretty !== undefined) {
			this._config.pretty = options.pretty;
		}
	
		this.__tab = (this._config.pretty) ? this._config.tab  : '';
		this.__eol = (this._config.pretty) ? this._config.eol  : '';
	}
	return this;
};

/**
 * 
 * @return {string}
 */
Formatter.prototype._formatNormal = function (data) {
	var i, error, file, output;

	output = '';
	output += this._line(0, '<?xml version="1.0" encoding="' + this._config.encoding.toUpperCase() + '" ?>');
	output += this._line(0, '<jslint>');
	for (i in data) {
		if (data.hasOwnProperty(i)) {
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
	}
	output += this._line(0, '</jslint>');
	return output;
};

Formatter.prototype._line = function (indentation, content) {
	if (!content || content === '') {
		return this.__eol;
	}
	return this._indent(indentation, content + this.__eol);
};

Formatter.prototype._indent = function (count, content) {
	if (this.__tab === '') {
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