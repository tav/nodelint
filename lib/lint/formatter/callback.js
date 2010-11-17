/*jslint indent:4 */
/**
 * Import
 */
var util = require(process.binding('natives').util ? 'util' : 'sys');
var Script = process.binding('evals').Script;
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

    //Default identity function
    this.callback = null;
    
    this.configure(options);
}
util.inherits(Formatter, formatter.Base);

/**
 * Configure the Formatter
 * 
 * @param {Object} options
 * @return this
 */
Formatter.prototype.configure = function (options) {
    if (options) {
        options = options || {};
        Formatter.super_.prototype.configure.call(this, options);

        if (options.callback !== undefined) {
            if (typeof(options.callback) === 'string') {
                var scriptObj, env;
                
                env  = {};
                
                scriptObj = new Script(options.callback, __filename);
                scriptObj.runInNewContext(env);
                
                options.callback = env.reporter;
            }
            
            if (typeof(options.callback) === 'function') {
                this.callback = options.callback;
            } else {
                throw new Error('options.callback must be a Function');
            }
        }
    }
    return this;
};

/**
 * 
 * @return {string}
 */
Formatter.prototype._formatNormal = function (report) {
    return this.callback(report);
};

/**
 * Exports
 */
exports.Formatter = Formatter;
