/**
 * Imports
 */

/**
 * Formatter constructor
 * 
 * @constructor
 */
function Formatter(options) {
	this._adapter = this._buildAdapter(options);
}

Formatter.SIMPLE = 'simple';
Formatter.NORMAL = 'normal';
Formatter.FULL = 'full';

/**
 * 
 * @return Base
 */
Formatter.prototype._buildAdapter = function (options) {
	var formatterModule, formatterClass;
	
	options = options || {};
	options.type = options.type || 'cli';
	options.mode = options.mode || Formatter.NORMAL;
	
	formatterModule = require('./formatter/' + options.type);
	formatterClass = formatterModule.Formatter;
	
	if (formatterClass === undefined) {
		throw new Error('Formatter class not found in module "' + options.type + '"');
	}
	
	return new formatterClass(options);
};

/**
 * 
 * @return {string}
 */
Formatter.prototype.format = function () {
	return this._adapter.format();
};

/**
 * 
 * @constructor
 * @param {Object} options
 */
function Base(options) {
	options = options || {};
	
	this._type = options.type;
	this._mode = options.mode;
}

/**
 * 
 * @return {string}
 */
Base.prototype.format = function () {
	switch(this._mode) {
		case Formatter.SIMPLE:
			return this.formatSimple();
		case Formatter.NORMAL:
			return this.formatNormal();
		case Formatter.FULL:
			return this.formatFull();
	}
};

Base.prototype.formatSimple = function () {
	throw new Error('formatSimple() not implemented.');
};

Base.prototype.formatNormal = function () {
	throw new Error('formatNormal() not implemented.');
};

Base.prototype.formatFull = function () {
	throw new Error('formatFull() not implemented.');
};

/**
 * Exports
 */
exports.Formatter = Formatter;
exports.Base = Base;