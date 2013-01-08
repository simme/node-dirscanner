//
// # Test DirScanner
//

var dirscanner  = require('./../dirscanner');
var assert      = require('assert');

suite('Dirscanner:', function () {
  test('Emits error when given non-existant path.', function (done) {
    var ds = dirscanner('fooohooo');
    ds.on('error', function (err) {
      assert(err);
      done();
    });
    ds.on('done', function (dir) {
      throw new Error('Should not be here.');
    });
  });

  // Could be more "specific"....
  test('Emits done when done.', function (done) {
    var ds = dirscanner(__dirname + '/foo');
    ds.on('done', function (dir) {
      assert(dir.dirs[__dirname + '/foo/bar']);
      done();
    });
  });
});

