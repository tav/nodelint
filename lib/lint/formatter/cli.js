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
	
	// customize the error reporting -- the following colours the text red
	this._colors = options.colors === undefined ? true : options.colors;//TODO: autodetect vt100 console
	this._errorPrefix = "\u001b[1m";
	this._errorSuffix = ":\u001b[0m ";
	this._eol = options.eol || "\n";
}
util.inherits(Formatter, formatter.Base);

/**
 * 
 * @return {string}
 */
Formatter.prototype.formatSimple = function () {
	var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/,
        i,
        length = results.length,
        result = '',
        error;
        
    for (i = 0; i < length; i += 1) {
    	error = results[i].error;
    	result += this._errorPrefix + results[i].file  + ', line ' + error.line +
             ', character ' + error.character + this._errorSuffix +
              error.reason + this._eol +
              (error.evidence || '').replace(error_regexp, "$1") + this._eol;
    }
    result += length + ' error' + ((length === 1) ? '' : 's');
	
	return result;
};

