var spawn = require('child_process').spawn;


exports.NodePredefines = function (test) {
  test.expect(2);

  var
    child = spawn('./nodelint', [__dirname + '/fixtures/nodejs-predefines.js']),
    stdout_output = '',
    stderr_output = '';

  child.stdout.addListener('data', function (data) {
    stdout_output += data;
  });

  child.stderr.addListener('data', function (data) {
    stderr_output += data;
  });

  child.addListener('exit', function (code) {
    test.equal(code, 0, 'nodejs-predefines.js ok');
    test.equal(stderr_output, '0 errors\n', 'nodejs-predefines.js passed');
    test.done();
  });
};

