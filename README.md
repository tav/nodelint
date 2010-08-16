nodelint.js
-----------

- [Node] is a [V8] based framework for writing Javascript applications outside
  the browser.

- [JSLint] is a code quality tool that checks for problems in Javascript programs.

- **nodelint.js** lets you run JSLint from the command line.

- nodelint.js currently supports node version 0.1.103

[Node]: http://nodejs.org/
[V8]: http://code.google.com/p/v8/
[JSLint]: http://www.jslint.com/lint.html



usage
-----

You can use `nodelint.js` directly if you have `node` in your $PATH:

    $ ./nodelint.js path/to/your/file.js

Otherwise, you need to run it with node:

    $ node nodelint.js path/to/your/file.js

Enjoy!


config
------

You can set JSLint options by modifying the default `config.js` file or even
override the default config by passing another config file with the optional
`--config` parameter, e.g.

    $ nodelint.js file1 file2 --config path/to/your/config/file.js

For example, if the default config.js has:

    var options = {
        adsafe       : false,
        bitwise      : true,
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

Take a look at [JSLint's Options] to see what to put in the `options` variable.


reporters
---------

By default nodelint.js uses an internal `reporter` function to output it's results to the console. For basic use it's possible to alter the `error_prefix` and `error_suffix` colors within your `config.js` file. This will prepend or append coloring information to the results when JSLint complains about your code. There may be times when a more customizable reporting system might be needed (*i.e. IDE/Text Editor integrations or customized console outputs*). 

nodelint.js allows you to designate a custom reporter for outputting the results from JSLint's run. This `reporter` function will override the default function built into nodelint.js. To utilize a custom reporter first create a js file that has a function in it named `reporter`:

`example-reporter.js`:

    var sys = require('sys');

    function reporter(results) {
        var len = results.length;
        sys.puts(len + ' error' + ((len === 1) ? '' : 's'));
    }

Then when you run nodelint.js from the command line, pass in the customized reporter:

`$ ./nodelint.js path/to/file.js --reporter path/to/file/example-reporter.js`

For brevity sake, this is a fairly simple reporter. For more elaborate examples see the `examples/reporters/` directory or `examples/textmate/`.

Please see the [wiki][wiki] for integrating into various editors.

contribute
----------

To contribute any patches, simply fork this repository using GitHub and send a
pull request to me <<http://github.com/tav>>. Thanks!


credits
-------

- [tav], wrote nodelint.js

- [Felix Geisendörfer][felixge], clarified Node.js specific details

- [Douglas Crockford], wrote the original JSLint and rhino.js runner

- [Nathan Landis][my8bird], updated nodelint to Node's new API.

- [Oleg Efimov][Sannis], added support for overridable configurations, running
  nodelint from a symlink and updates to reflect Node.js API changes.

- [Matthew Kitt][mkitt], added support for configurable reporters, various code
  cleanups and improvements including updates to reflect Node.js API changes.

- [Corey Hart], updated nodelint with multiple files and config support.

- [Mamading Ceesay][evangineer], added support for using nodelint within Emacs.

- [Matt Ranney][mranney], updated nodelint to use sys.error.

[tav]: http://tav.espians.com
[felixge]: http://debuggable.com
[Douglas Crockford]: http://www.crockford.com
[my8bird]: http://github.com/my8bird
[Sannis]: http://github.com/Sannis
[mkitt]: http://github.com/mkitt
[Corey Hart]: http://www.codenothing.com
[evangineer]: http://github.com/evangineer
[mranney]: http://github.com/mranney

[JSLINT's Options]: http://www.jslint.com/lint.html#options
[wiki]: http://wiki.github.com/tav/nodelint.js/
