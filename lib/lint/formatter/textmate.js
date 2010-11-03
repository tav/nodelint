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
	this._tab = options.tab || "\t";
	
	this.__tab = (this._pretty) ? this._tab : '';
	this.__eol = (this._pretty) ? this._eol : '';
}
util.inherits(Formatter, formatter.Base);

/**
 * @return {string}
 */
Formatter.prototype._formatNormal = function (data) {
	var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/, i, length, output, eol, file, error;
	
	eol = this._eol;

	length = data.length;
	output = '';

	if (length > 0 && length < 2) {
		for (i = 0; i < length; i += 1) {
			file = data[i].file;
			file = file.substring(file.lastIndexOf('/') + 1, file.length);
			error = data[i].error;

			output += file + ': line ' + error.line;
			output += ', character ' + error.character;
			output += ', ' + error.reason + eol;
			output += (error.evidence || '').replace(error_regexp, "$1") + eol + eol;
		}
	}
	output += length + ' error' + ((length === 1) ? '' : 's');

	return output;
};

/**
 * @return {string}
 */
Formatter.prototype._formatFull = function (data) {
	var output;

	output = '';
	output += this._line(0, '<html>');
	output += this._head(1);
	output += this._body(1, data);
	output += this._line(0, '</html>');
	return output;
};

Formatter.prototype._head = function (indentation) {
	var output;
	
	output = '';
	output += this._line(indentation, '<head>');
	output += this._css(indentation + 1);
	output += this._line(indentation, '</head>');
	return output;
};

Formatter.prototype._body = function (indentation, data) {
	var error_regexp = /^\s*(\S*(\s+\S+)*)\s*$/, i, output, length, row, file, error;
	
	length = data.length;
	
	output = '';
	output += this._line(indentation, '<body>');
	output += this._line(indentation + 1, '<h1>'+ length + ' Error' + ((length === 1) ? '' : 's') + '</h1>');
	output += this._line(indentation + 1, '<hr/>');
	output += this._line(indentation + 1, '<ul/>');
	
	for (i = 0; i < length; i += 1) {
		row = data[i];
		
		file = row.file;
		error = row.error;

		output += this._line(indentation + 2, '<li>');
		output += this._line(indentation + 3, '<a href="txmt://open?url=file://' + file + '&line=' + error.line + '&column=' + error.character + '">');
		output += this._line(indentation + 4, '<strong>' + error.reason + '</strong> <em>line ' + error.line + ', character ' + error.character + '</em>');
		output += this._line(indentation + 3, '</a>');

				
		output += this._line(indentation + 3, '<pre>');
		output += this._line(indentation + 4, '<code>');
		output += this._line(indentation + 5, (error.evidence || '').replace(error_regexp, "$1") );
		output += this._line(indentation + 4, '</code>');
		output += this._line(indentation + 3, '</pre>');
		
		output += this._line(indentation + 2, '</li>');
	}
	
	output += this._line(indentation + 1, '</ul>');
	output += this._line(indentation, '</body>');
	return output;
};

Formatter.prototype._css = function (indentation) {
	var output, rules, ruleSelector, ruleAttributes, ruleAttribute, ruleValue;

	
	//Define rules
	rules = {
		'body': {
			'font-size' : '14px'
		},
		'pre': { 
			'background-color': '#eee',
			'color': '#400',
			'margin': '3px 0'
		},
		'h1, h2': { 
			'font-family':'"Arial, Helvetica"',
			'margin': '0 0 5px' 
		},
		'h1': { 
			'font-size': '20px' 
		},
		'h2': { 
			'font-size': '16px'
		},
		'a': { 
			'font-family':'"Arial, Helvetica"'
		},
		'ul': { 
			'margin': '10px 0 0 20px',
			'padding': '0',
			'list-style': 'none'
		},
		'li': { 
			'margin': '0 0 10px'
		}
	};
	
	
	//Format all
	output = '';
	output += this._line(indentation, '<style type="text/css">');
	for (ruleSelector in rules) {
		ruleAttributes = rules[ruleSelector];
		
		output += this._line(indentation + 1, + ruleSelector + ' {');
		for (ruleAttribute in ruleAttributes) {
			ruleValue = ruleAttributes[ruleAttribute];
			output += this._line(indentation + 2, ruleAttribute + ': ' + ruleValue + ';');
		}
		output += this._line(indentation + 1, '}');
		output += this.__eol;
	}
	output += this._line(indentation, '</style>');
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

/**
 * Exports
 */
exports.Formatter = Formatter;
