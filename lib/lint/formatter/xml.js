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
	
	this._pretty = options.pretty === undefined ? false : options.pretty;
	
	// customize the error reporting -- the following colours the text red
	this._tab = options.tab || "\t";
}
util.inherits(Formatter, formatter.Base);

Formatter.prototype._escape = function (string) {
	return (string) ? string.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
};

/**
 * @return {string}
 */
Formatter.prototype.formatSimple = function () {
	return this.formatNormal();
};

/**
 * 
 * @return {string}
 */
Formatter.prototype.formatNormal = function () {
	var i, error, length, file, eol;
	

	eol = (this._pretty) ? this._eol : '';
	tab = (this._pretty) ? this._tab : '';
	
	dir = process.cwd();//TODO put this logic in parser
	
	
	xml = '<?xml version="1.0" encoding="UTF-8" ?>' + eol;
	xml += '<jslint>' + eol;
	for (i = 0, length = results.length; i < length; i += 1) {
		file = path.join(dir, results[i].file);//TODO put this logic in parser
		error = results[i].error;
		
		xml += tab + '<file name="' + file + '">' + eol;
		xml += tab + tab + '<issue char="' + error.character + '" evidence="' + escape(error.evidence || '') +
		       '" line="' + error.line + '" reason="' + this._escape(error.reason) + '"/>' + eol;
		xml += tab + '</file>' + eol;
	}
	xml += '</jslint>';
	return xml;
};

/**
 * @return {string}
 */
Formatter.prototype.formatFull = function () {
	return this.formatNormal();
};

/**
 * Exports
 */
exports.Formatter = Formatter;