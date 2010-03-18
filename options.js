/*
 * This is a command line runner of jslint for Node.js
 *
 * Changes released into the Public Domain by tav <tav@espians.com>
 * Multiple file handling added by Corey Hart <corey@codenothing.com>
 *
 * Adapted from rhino.js, Copyright (c) 2002 Douglas Crockford
 * Adapted from posixpath.py in the Python Standard Library.
 *
 */

// Set JSLINT Defaults Here
var Defaults = {
};



// Export each option
for ( var i in Defaults ) {
	if ( Defaults.hasOwnProperty(i) ) {
		exports[i] = Defaults[i];
	}
}
