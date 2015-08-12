/* jshint node: true */
'use strict';

var es = require('event-stream');
var gutil = require('gulp-util');
var extend = require('lodash.assign');

var wrapperPlugin = function(headerText, footerText, data) {
  headerText = headerText || '';
  footerText = footerText || '';
  return es.map(function(file, cb){
    file.contents = Buffer.concat([
      new Buffer(gutil.template(headerText, extend({file : file}, data))),
      file.contents,
      new Buffer(gutil.template(footerText, extend({file : file}, data))),
    ]);
    cb(null, file);
  });
};

module.exports = wrapperPlugin;