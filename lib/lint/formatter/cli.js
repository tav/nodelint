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
	formatter.Base.call(this, options);
	
	// customize the error reporting -- the following colours the text red
	this._colors = options.colors === undefined ? true : options.colors;//TODO: autodetect vt100 console
	this._errorPrefix = "\u001b[1m";//TODO remove that and use color parameter
	this._errorSuffix = ":\u001b[0m ";
}
util.inherits(Formatter, formatter.Base);

/**
 * 
 * @return {string}
 */
Formatter.prototype.formatSimple = function(){
	var length = results.length;
	return length + ' error' + ((length === 1) ? '' : 's');
};

/**
 * 
 * @return {string}
 */
Formatter.prototype.formatNormal = function () {
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

/**
 * @return {string}
 */
Formatter.prototype.formatFull = function () {
	var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/,
	  i,
	  length = results.length,
	  result = '',
	  file,
	  error;

	for (i = 0; i < length; i += 1) {
		file = results[i].file;
		file = file.substring(file.lastIndexOf('/') + 1, file.length);
		error = results[i].error;
		result += file  + ': line ' + error.line +
		  ', character ' + error.character + ', ' +
		  error.reason + this._eol +
		  (error.evidence || '').replace(error_regexp, "$1") + this._eol;
	}

	if (length > 0) {
		result += length + ' error' + ((length === 1) ? '' : 's');
		return result;
	} else {
		return 'Lint free!';
	}
};

/**
 * Exports
 */
exports.Formatter = Formatter;
