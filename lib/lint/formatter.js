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

Formatter.prototype.setMode = function (mode) {
	this._adapter.setMode(mode);
	return this;
};

Formatter.prototype.getMode = function () {
	return this._adapter.getMode();
};

/**
 * 
 * @return {string}
 */
Formatter.prototype.format = function (data) {
	return this._adapter.format(data);
};

/**
 * 
 * @constructor
 * @param {Object} options
 */
function Base(options) {
	options = options || {};
	
	this._type = options.type;
	this._mode = null;
	this._eol = options.eol || this._guessEol();
	this._data = null;
	
	this.setMode(options.mode || Formatter.NORMAL);
}

Base.prototype._guessEol = function () {
	return "\n";//TODO: detect platform auto?
};

Base.prototype.setMode = function (mode) {
	this._mode = mode;
	return this;
};

Base.prototype.getMode = function () {
	return this._mode;
};

/**
 * Return formatted content
 * 
 * @return {string}
 */
Base.prototype.format = function (data) {
	switch(this._mode) {
		case Formatter.SIMPLE:
			return this.formatSimple(data);
		case Formatter.NORMAL:
			return this.formatNormal(data);
		case Formatter.FULL:
			return this.formatFull(data);
		default:
			throw new Error('type "' + this._mode + '" does not exist');
	}
};

/**
 * Return simple formatted content (can be overriden)
 * 
 * @return {string}
 */
Base.prototype.formatSimple = function (data) {
	return this.formatNormal();
};

/**
 * Return normal formatted content (can be overriden)
 * 
 * @return {string}
 */
Base.prototype.formatNormal = function (data) {
	throw new Error('formatNormal() not implemented.');
};

/**
 * Return full formatted content (can be overriden)
 * 
 * @return {string}
 */
Base.prototype.formatFull = function (data) {
	return this.formatNormal();
};

/**
 * Exports
 */
exports.Formatter = Formatter;
exports.Base = Base;