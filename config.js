/*
 * This is the default options file for nodelint
 *
 * Changes released into the Public Domain by tav <tav@espians.com>
 * Options support added by Corey Hart <corey@codenothing.com>
 *
 */

// set your options here

var options = {
    "adsafe"     : false, // if ADsafe should be enforced
    "bitwise"    : true,  // if bitwise operators should not be allowed
    "browser"    : false, // if the standard browser globals should be predefined
    "cap"        : false, // if upper case HTML should be allowed
    "confusion"  : false, // if types can be used inconsistently
    "continue"   : true,  // if the continuation statement should be tolerated
    "css"        : false, // if CSS workarounds should be tolerated
    "debug"      : false, // if debugger statements should be allowed
    "devel"      : false, // if logging should be allowed (console, alert, etc.)
    "eqeq"       : false, // if the == and != operators should be tolerated
    "es5"        : true,  // if ES5 syntax should be allowed
    "evil"       : false, // if eval should be allowed
    "forin"      : true, // true if unfiltered for in statements should be allowed
    "fragment"   : false, // if HTML fragments should be allowed
    "indent"     : 2,     // set the expected indentation level
    "maxerr"     : 50,    // the maximum number of errors to allow
    "maxlen"     : 100,   // the maximum length of a source line
    "newcap"     : false, // true if Initial Caps with constructor functions is optional
    "node"       : true,  // if Node.js globals should be predefined
    "nomen"      : true,  // true, if names may have dangling _
    "on"         : false, // if HTML event handlers should be allowed
    "passfail"   : false, // if the scan should stop on first error
    "plusplus"   : true,  // if increment/decrement should not be allowed
    "properties" : false, // if all property names must be declared with /*properties*/
    "regexp"     : true,  // true if . and [^...] should be allowed in RegExp literals
    "rhino"      : false, // if the Rhino environment globals should be predefined
    "undef"      : true,  // if variables should be declared before used
    "unparam"    : true,  // if unused parameters should be tolerated
    "safe"       : false, // if use of some browser features should be restricted
    "sloppy"     : true,  // if the 'use strict'; pragma is optional
    "sub"        : false, // if all forms of subscript notation are tolerated
    "vars"       : false, // if multiple var statements per function should be allowed
    "white"      : true,  // if sloppy whitespace is tolerated
    "widget"     : false, // if the Yahoo Widgets globals should be predefined
    "windows"    : false, // if MS Windows-specific globals should be predefined

    // the names of predefined global variables:
    "predef"       : [],

    // customise the error reporting -- the following colours the text red
    "error_prefix" : "\u001b[1m",
    "error_suffix" : ":\u001b[0m "
};

