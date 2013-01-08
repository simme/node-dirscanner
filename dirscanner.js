//
// # Dirscanner
//
// Scans a directory and creates an object representation of the target's
// substructure.
//

//
// ## Dependencies
//
var fs      = require('fs');
var emitter = require('events').EventEmitter;
var inherit = require('util').inherits;
var path    = require('path');
var Dir     = require('./lib/directory');

//
// ## Constructor
//
// Set up internal state and inherit from EventEmitter.
//
var Dirscanner = function Dirscanner(target, ignore) {
  target = path.normalize(path.join(process.cwd(), target));

  emitter.call(this);
  this._target  = target;   // Source path
  this._ignore  = ignore;   // File patterns to ignore
  this._root    = null;     // Root directory
};

// Inherit from EventEmitter
inherit(Dirscanner, emitter);

//
// ## Start Scan
//
Dirscanner.prototype.start = function start() {
  this.emit('start', this._target);
  this.log('Scan started in directory: ' + this._target);
  this._root = Dir(this._target, null, this);
  this._root.on('done', function () {
    this.emit('done', this._root);
  }.bind(this));
  this._root.scan();
};

//
// ## Log
//
// Emits a log event with the given message.
//
Dirscanner.prototype.log = function log(message) {
  this.emit('log', message);
};

//
// ## Error
//
// Emits an error event.
//
Dirscanner.prototype.error = function(error) {
  this.emit('error', error);
};

//
// ## Returns a new Dirscanner
//
// Creates a new Dirscanner and initiates scan.
//
module.exports = function (target, ignore, start) {
  var ds = new Dirscanner(target, ignore);
  if (start !== false) {
    ds.start();
  }
  return ds;
};

