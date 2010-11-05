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
 * 
 * @constructor
 * @param {Object} options
 */
function Base(options) {
    options = options || {};

    this._type = options.type;

    this._config = {};
    this._config.mode = Formatter.NORMAL;
    this._config.encoding = 'utf-8';
    this._config.tab = "\t";
    this._config.eol = this._guessEol();

    this.configure(options);
}

/**
 * Configure the formatter
 * 
 * @param {Object} options
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

            this._config.mode = options.mode;
        }
        if (options.encoding !== undefined) {
            this._config.encoding = options.encoding;
        }

        if (options.tab !== undefined) {
            this._config.tab = options.tab;
        }
        if (options.eol !== undefined) {
            this._config.eol = options.eol;
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

    mode = mode || this._config.mode;
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