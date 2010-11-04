/**
 * Imports
 */
/*global JSLINT */
/*jslint evil: true, regexp: false */

var fs = require('fs');
var path = require('path');

/**
 * Constants
 */
var JSLINT_PATH = path.join(path.dirname(fs.realpathSync(__filename)), 'jslint.js');
eval(fs.readFileSync(JSLINT_PATH, 'utf8'));

var NODE_CONFIG = {
	adsafe: false, // if ADsafe should be enforced
	bitwise: true, // if bitwise operators should not be allowed
	browser: false, // if the standard browser globals should be
	// predefined
	cap: false, // if upper case HTML should be allowed
	css: false, // if CSS workarounds should be tolerated
	debug: false, // if debugger statements should be allowed
	devel: false, // if logging should be allowed (console, alert, etc.)
	eqeqeq: true, // if === should be required
	es5: true, // if ES5 syntax should be allowed
	evil: false, // if eval should be allowed
	forin: false, // if for in statements must filter
	fragment: false, // if HTML fragments should be allowed
	immed: true, // if immediate invocations must be wrapped in parens
	laxbreak: false, // if line breaks should not be checked
	newcap: true, // if constructor names must be capitalized
	nomen: false, // if names should be checked
	on: false, // if HTML event handlers should be allowed
	onevar: true, // if only one var statement per function should be
	// allowed
	passfail: false, // if the scan should stop on first error
	plusplus: true, // if increment/decrement should not be allowed
	regexp: true, // if the . should not be allowed in regexp literals
	rhino: false, // if the Rhino environment globals should be predefined
	undef: true, // if variables should be declared before used
	safe: false, // if use of some browser features should be restricted
	windows: false, // if MS Windows-specific globals should be
	// predefined
	strict: false, // require the "use strict"; pragma
	sub: false, // if all forms of subscript notation are tolerated
	white: true, // if strict whitespace rules apply
	widget: false, // if the Yahoo Widgets globals should be predefined
	indent: 2, // set the expected indentation level
	// the names of predefined global variables:
	// the following are defined by nodejs itself
	predef: ['exports', 'module', 'require', 'process', '__filename', '__dirname', 'global', 'console', 'setInterval', 'setTimeout', 'clearInterval', 'clearTimeout']
};

/*******************************************************************************
 * Parser class
 *
 * Usage:
 *
 * <pre>
 * var parser = new Parser({
 *     rhino : true
 * })
 * parser.update('var local = 1;');
 * parser.update('\n');
 * parser.update('local = 2;');
 * parser.validate();
 *
 * console.log(parser.isValid()) //Display true if not valid javascript
 * for (var key in this.data()) {
 *     //...Put some code here
 * }
 * </pre>
 ******************************************************************************/
/**
 * Parser constructor
 *
 * @constructor
 * @param {Object} options
 */
function Parser(options) {
	options = options || {};
	if (options.node === undefined) {
		options.node = true;
	}
	
	this._config = {};
	this._report = null;
	this._isValid = null;
	this._source = '';
		
	this.configure(options);
}

/**
 * Configure the parser
 * 
 * @param {Object} options
 * @return this
 */
Parser.prototype.configure = function (options) {
	var property;
	
	options = options || {};
	if (options.node) {
		for (property in NODE_CONFIG) {
			if (NODE_CONFIG.hasOwnProperty(property)) {
				this._config[property] = NODE_CONFIG[property];
			}
		}
	}
    
	for (property in options) {
		if (options.hasOwnProperty(property)) {
			this._config[property] = options[property];
		}
	}
	
	//Parameters has changed to validation could be changed too
	this._report = null;
	this._isValid = null;
	return this;
};

/**
 * Reset all parameters to default
 *
 * @return this
 */
Parser.prototype.reset = function () {
	this._source = '';
	this._report = null;
	this._isValid = null;
	return this;
};

/**
 * Append source to currently parsed source
 *
 * @param {string} sourcePart
 * @return this
 */
Parser.prototype.update = function (sourcePart) {
	if (sourcePart) {
		this._source += sourcePart;
		this._report = null;
		this._isValid = null;
	}
	return this;
};

/**
 * Validate only if not previously tested or if force is true
 *
 * @param {boolean} force
 * @return this
 */
Parser.prototype.validate = function (force) {
	var result;
	
	if (this._report === null || force) {
		result = JSLINT(this._source, this._config);
		this._report = JSLINT.data().errors || [];
		this._isValid = (JSLINT.errors.length === 0);
	}
	return this;
};

/**
 * Return true if source is valid
 *
 * @return {boolean}
 */
Parser.prototype.isValid = function () {
	this.validate();
	return this._isValid;
};

/**
 * Return the validation report data
 *
 * @return {Object}
 */
Parser.prototype.getReport = function () {
	this.validate();
	return this._report;
};


/**
 * Exports
 */
exports.Parser = Parser;
