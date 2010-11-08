/*jslint indent:4 */
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
    var formatterModule, FormatterClass;

    options = options || {};
    options.type = options.type || 'cli';
    options.mode = options.mode || Formatter.NORMAL;

    formatterModule = require('./formatter/' + options.type);
    FormatterClass = formatterModule.Formatter;

    if (FormatterClass === undefined) {
        throw new Error('Formatter class not found in module "' + options.type + '"');
    }

    return new FormatterClass(options);
};

/**
 * Configure the formatter
 * 
 * @return this
 */
Formatter.prototype.configure = function (options) {
    this._adapter.configure(options);
    return this;
};

/**
 * 
 * @return {string}
 */
Formatter.prototype.format = function (data) {
    return this._adapter.format(data);
};

/**
 * Base constructor
 * 
 * @constructor
 * @param {Object} options
 */
function Base(options) {
    options = options || {};

    this._type = options.type;
    this.mode = Formatter.NORMAL;
    this.encoding = 'utf-8';
    this.tab = "\t";
    this.eol = this._guessEol();
    this.limit = null;

    this.configure(options);
}

/**
 * Configure the formatter
 * 
 * @param {Object} options
 * - mode: quantity of information displayed (= simple|normal|full)
 * - encoding: character encoding utf-8
 * - tab: tabulation character used (default: "\t")
 * - eol: end of line character (default: "\n")
 * - limit: limit the error count (default: null)
 * 
 * @return this
 */
Base.prototype.configure = function (options) {
    if (options) {
        if (options.mode !== undefined) {
            if (
                    options.mode !== Formatter.SIMPLE &&
                    options.mode !== Formatter.NORMAL &&
                    options.mode !== Formatter.FULL
            ) {
                throw new Error('mode "' + options.mode + '" is not recognized.');
            }

            this.mode = options.mode;
        }
        if (options.encoding !== undefined) {
            this.encoding = options.encoding;
        }

        if (options.tab !== undefined) {
            this.tab = options.tab;
        }
        if (options.eol !== undefined) {
            this.eol = options.eol;
        }
        
        if (options.limit !== undefined) {
            this.limit = options.limit;
        }
    }
    return this;
};

/**
 * Return formatted data
 * 
 * @param {Object} data
 * @param {string} mode
 * @return {string}
 */
Base.prototype.format = function (data, mode) {
    if (data === undefined) {
        throw new Error('data should not be undefined');
    }

    mode = mode || this.mode;
    data = data || {};

    switch (mode) {
    case Formatter.SIMPLE:
        return this._formatSimple(data);
    case Formatter.NORMAL:
        return this._formatNormal(data);
    case Formatter.FULL:
        return this._formatFull(data);
    default:
        throw new Error('type "' + mode + '" does not exist');
    }
};

/**
 * Return simple formatted content (can be overriden)
 * 
 * @return {string}
 */
Base.prototype._formatSimple = function (data) {
    return this._formatNormal(data);
};

/**
 * Return normal formatted content (can be overriden)
 * 
 * @return {string}
 */
Base.prototype._formatNormal = function (data) {
    throw new Error('_formatNormal() not implemented.');
};

/**
 * Return full formatted content (can be overriden)
 * 
 * @return {string}
 */
Base.prototype._formatFull = function (data) {
    return this._formatNormal(data);
};

Base.prototype._guessEol = function () {
    switch (process.platform) {
    case 'win':
    case 'windows'://TODO: check this if supported
        return "\r\n";
    default:
        return "\n";
    }

};

/**
 * Exports
 */
exports.Formatter = Formatter;
exports.Base = Base;