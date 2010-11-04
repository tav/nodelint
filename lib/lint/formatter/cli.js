/**
 * Import
 */
var util = require(process.binding('natives').util ? 'util' : 'sys');
var formatter = require('../formatter');

/**
 * Formatter constructor
 * 
 * @constructor
 * @extends lint.formatter.Base
 * @param {Object} options
 */
function Formatter(options) {
	options = options || {};
	formatter.Base.call(this, options);

	// customize the error reporting -- the following colours the text red
	this._config.colors = this._guessVt100();
	
	this.__errorPrefix = '';
	this.__errorSuffix = '';
	
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
		
		if (options.colors !== undefined) {
			this._config.colors = options.colors;
		}
		
		if (this._config.colors) {
			this.__errorPrefix = "\u001b[1m";
			this.__errorSuffix = ":\u001b[0m ";
		}
	}
	return this;
};

/**
 * 
 * @return {string}
 */
Formatter.prototype._formatSimple = function (data) {
	var length = data.length;
	return this._line(0, length + ' error' + ((length === 1) ? '' : 's'));
};

/**
 * 
 * @return {string}
 */
Formatter.prototype._formatNormal = function (data) {
	var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/, i, length, output, file, error;
	
	length = data.length;
	output = '';
	for (i = 0; i < length; i += 1) {
		file = data[i].file;
		error = data[i].error;
		output += this._line(0, this.__errorPrefix + file + ': line ' + error.line + ', character ' + error.character + ' '+ this.__errorSuffix + error.reason);
		output += this._line(0, (error.evidence || '').replace(error_regexp, "$1"));
	}
	output += this._line(0, length + ' error' + ((length === 1) ? '' : 's'));
	return output;
};

/**
 * @return {string}
 */
Formatter.prototype._formatFull = function (data) {
	var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/, i, length = data.length, output = '', file, error;

	for (i = 0; i < length; i += 1) {
		file = data[i].file;
		file = file.substring(file.lastIndexOf('/') + 1, file.length);
		
		error = data[i].error;
		output += this._line(0, file + ': line ' + error.line + ', character ' + error.character + ', ' + error.reason);
		output += this._line(0, (error.evidence || '').replace(error_regexp, "$1"));
	}

	if (length > 0) {
		output += this._line(0, length + ' error' + ((length === 1) ? '' : 's'));
		return output;
	} else {
		return 'Lint free!';
	}
};

Formatter.prototype._line = function (indentation, content) {
	if (!content || content === '') {
		return this._config.eol;
	}
	return this._indent(indentation, content + this._config.eol);
};

Formatter.prototype._indent = function (count, content) {
	if (this._config.tab === '') {
		return content;
	}
	
	var output = '';
	while (count > 0) {
		output += this._config.tab;
		count -= 1;
	}
	output += content;
	return output;
};

Formatter.prototype._guessVt100 = function () {
	return false;
};

/**
 * Exports
 */
exports.Formatter = Formatter;
