//
// # Directory
//
// Represents a directory.
//

var fs      = require('fs');
var path    = require('path');
var emitter = require('events').EventEmitter;
var inherit = require('util').inherits;
var File    = require('./file');

//
// ## Constructor
//
// Creates a new directory object for the given root path.
//
var Directory = function (root, parent, scanner) {
  emitter.call(this);
  this._path  = root;
  this._ds    = scanner;
  this.done   = false;
  this.dirs   = {};
  this._dirs  = [];       // Paths
  this.files  = {};
  this.parent = parent;
  this.stat   = null;
  this.depth  = parent ? parent.depth + 1 : 0;
  this._stack = [];
  this._events = ['dir', 'error', 'done', 'start', 'ignored'];

  this.on('filesread', this.popPath.bind(this));
  this.on('filesscanned', function () {
    if (this._dirs.length > 0) {
      this._scanSubs();
    }
    else {
      this.emit('done');
    }
  }.bind(this));
};

// Inherit from EventEmitter.
inherit(Directory, emitter);

//
// ## Scan
//
// Scan current directory.
//
// ### Emits
//
// * start
//
//   Emits a start event with the current target.
//
// * filesread
//
//   Files have been read.
//
// * error
//
//   Emits an error object if an error is encountered.
//
Directory.prototype.scan = function() {
  this.emit('start', this._path);
  fs.readdir(this._path, function (err, files) {
    if (err) {
      this.emit('error', err);
      return;
    }

    for (var i = 0, len = files.length; i < len; i++) {
      var file = path.join(this._path, files[i]);
      this._stack.push(file);
    }

    this.emit('filesread', files);
  }.bind(this));
};

//
// ## Pop a path off the stack
//
// Takes one path of the stack, stats it and adds it to the tree.
//
// ### Emits
//
// * error
//
//   Emits an error object if an error is encountered.
//
// * ignored
//
//   Emitted when a path is ignored.
//
// * dir
//
//   Emitted when a directory is created.
//
Directory.prototype.popPath = function() {
  var target = this._stack.pop();

  // No more path means we are done
  if (!target) {
    this.emit('filesscanned');
    return;
  }

  // Ignore this file?
  var ignore = this._ds._ignore;
  for (var i = 0; i < ignore.length; i++) {
    var pattern = ignore[i];
    var base = path.basename(target);
    if (base.match(pattern)) {
      this.emit('ignore', target);
      this.popPath();
      return;
    }
  }

  fs.stat(target, function (err, stat) {
    if (err) {
      this.emit('error', err);
      return;
    }
    this.stat = stat;

    if (stat.isDirectory()) {
      var dir = new Directory(target, this, this._ds);
      this.dirs[target] = dir;
      this._dirs.push(target);
      this.emit('dir', dir);
      this.popPath();
    }
    else if (stat.isFile()) {
      var file = File(target, this);
      this.files[target] = file;
      this.popPath();
    }
    else {
      console.log('Cant handle path: ' + target);
    }
  }.bind(this));
};

//
// ## Scan subdirectories
//
// Scan one subdirectory at a time.
//
Directory.prototype._scanSubs = function() {
  var dirPath = this._dirs.pop();
  if (!dirPath) {
    this.emit('done');
    return;
  }

  var directory = this.dirs[dirPath];
  directory.on('done', this._scanSubs.bind(this));
  directory.scan();
};

//
// ## Export
//
module.exports = function (target, parent, ds) {
  return new Directory(target, parent, ds);
};

