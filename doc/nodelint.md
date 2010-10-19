nodelint(1) -- Node JSLint runner
=================================

## SYNOPSIS

    nodelint [options] <file.js|dirname> [file2.js] [other dir] ...

## DESCRIPTION

Nodelint is a simple comand line code quality tool for Node based on JSLint.  
Node is a V8 based framework for writing Javascript applications outside the browser.  
JSLint is a code quality tool that checks for problems in Javascript programs.

## OPTIONS

  __--reporter FILE__:  
      You can set the test reporter to a custom module or on of the modules
      in nodeunit/lib/reporters, when omitted, the default test runner is used.

  __--config FILE__:  
      Load config options from a JSON file, allows the customisation
      of color schemes for the default test reporter etc.
      See bin/nodeunit.json for current available options.

  __-h__, __--help__:  
      display this help and exit

  __-v__, __--version__:  
      output version information and exit

## CONFIG

You can set JSLint options by modifying the default config.js file  
or even override the default config by passing another config file  
with the optional --config parameter, e.g.

    nodelint --config path/to/your/config/file.js file1.js file2.js ...

For example, if the default config.js has:

    var options = {
        adsafe       : false,
        bitwise      : True,
        error_prefix : "\u001b[1m",
        error_suffix : ":\u001b[0m "
    };

And your own path/to/your/config/file.js looks like:

    var options = {
        bitwise      : false,
        browser      : false
    };

Then the final options used will be:

    var options = {
        adsafe       : false,
        bitwise      : false,
        browser      : false,
        error_prefix : "\u001b[1m",
        error_suffix : ":\u001b[0m "
    };

Nodelint config file contains options for JSLint and defines coloring for output.

## JSLINT OPTIONS

  * adsafe:  
    True if ADsafe  rules should be enforced. See http://www.ADsafe.org/.
  * bitwise:  
    True if bitwise operators should not be allowed.
  * browser:  
    True if the standard browser globals should be predefined.
  * cap:  
    True if upper case HTML should be allowed.
  * css:  
    True if CSS workarounds should be tolerated.
  * debug:  
    True if debugger statements should be allowed.  
    Set this option to false before going into production.
  * devel:  
    True if browser globals that are useful in development  
    (console, alert, ...) should be predefined.
  * eqeqeq:  
    True if === should be required.
  * es5:  
    True if ES5 syntax should be allowed.
  * evil:  
    True if eval should be allowed.
  * forin:  
    True if unfiltered for in statements should be allowed.
  * fragment:  
    True if HTML fragments should be allowed.
  * immed:  
    True if immediate function invocations must be wrapped in parens
  * indent:  
    The number of spaces used for indentation (default is 4)
  * laxbreak:  
    True if statement breaks should not be checked.
  * maxerr:  
    The maximum number of warnings reported (default is 50)
  * maxlen:  
    The maximum number of characters in a line
  * nomen:  
    True if names should be checked for initial or trailing underbars
  * newcap:  
    True if Initial Caps must be used with constructor functions.
  * on:  
    True if HTML event handlers should be allowed.
  * onevar:  
    True if only one var statement per function should be allowed.
  * passfail:  
    True if the scan should stop on first error.
  * plusplus:  
    True if ++ and -- should not be allowed.
  * predef:  
    An array of strings (comma separated), the names of predefined global variables.  
    predef is used with the option object, but not with the /*jslint */ comment.  
    Use the var statement to declare global variables in a script file.
  * regexp:  
    True if . and [^...] should not be allowed in RegExp literals.  
    These forms should not be used when validating in secure applications.
  * rhino:  
    True if the Rhino environment globals should be predefined.
  * safe:  
    True if the safe subset rules are enforced. These rules are used by ADsafe.  
    It enforces the safe subset rules but not the widget structure rules.
  * strict:  
    True if the ES5 "use strict"; pragma is required. Do not use this option carelessly.
  * sub:  
    True if subscript notation may be used for expressions better expressed in dot notation.
  * undef:  
    True if variables must be declared before used.
  * white:  
    True if strict whitespace rules apply.
  * widget:  
    True if the Yahoo Widgets globals should be predefined.
  * windows:  
    True if the Windows globals should be predefined.


## AUTHORS

Written by Tav and other nodelint contributors.  
Contributors list: <http://github.com/tav/nodelint/contributors>.

## REPORTING BUGS

Report nodelint bugs to <http://github.com/tav/nodelint/issues>.

## COPYRIGHT

Nodelint is licensed under a Public Domain license..

## SEE ALSO

node(1)

