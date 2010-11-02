/**
 * Import
 */
var util = require('util');
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
	

}
util.inherits(Formatter, formatter.Base);

/**
 * @return {string}
 */
Formatter.prototype.formatSimple = function () {
	return this.formatNormal();
}

/**
 * @return {string}
 */
Formatter.prototype.formatNormal = function () {
	var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/,
      i,
      length = results.length,
      result = '',
      file,
      error;

	if (length > 0) {
		for (i = 0; i < length; i += 1) {
			file = results[i].file;
			error = results[i].error;
			
			result += file  + 'line ' + error.line +
			' column ' + error.character +
			' Error: ' + error.reason + ' ' +
			(error.evidence || '').replace(error_regexp, "$1");
			
			result += (i === length - 1) ? '' : this._eol;
		}
		return result;
	}
}

/**
 * Exports
 */
exports.Formatter = Formatter;