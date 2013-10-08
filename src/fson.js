module.exports = (function function_name (Path, FS, async) {
  'use strict';

  function read(path, callback) {
    path = Path.normalize(path);
    callback = pointedNameCallback(path, callback);
    FS.stat(path, function (error, stat) {
      if (error) callback(error, path);
      
      if (stat.isFile() && Path.extname(path) === '.json') {
        readJSONFile(path, callback);
      }

      if (stat.isDirectory()) {
        readDirectory(path, callback);
      }

    });
  }

  function readJSONFile(path, callback) {
    FS.readFile(path, { 'encoding':'utf-8'}, function (err, data) {
      if (err) callback(err, path);

      try {
        var json = JSON.parse(data);
        callback(null, json);
      } catch (e) {
        console.error(e);
        callback(e, path);
      }
    });
  }

  function readDirectory(path, callback) {
    FS.readdir(path, function (err, filenames) {
      if (err) callback(err);

      var result = {}; //the dir

      var files = filenames.map(function (item) {
        return Path.join(path, item);
      });

      async.map(files, read, function (err, datas) {
        if (err) callback(err);

        for (var i = 0; i < filenames.length; i ++) {
          var name = properName(filenames[i]);
          result[name] = datas[i];
        }
        callback(null, result);
      });

    });
  }

  function properName(file) {
    var i = file.indexOf('.');
    if (i === -1)
      return file;
    return file.substr(0, i);
  }

  function pointedNameCallback(path, callback) {
    var name = Path.basename(path, '.json');
    if (name.lastIndexOf('.') === -1)
      return callback;

    var arr = name.split('.');
    var result = {};
    var current = result;
    var n = arr[0];
    for (var i = 1; i < arr.length - 1; i ++) {
      n = arr[i];
      current[n] = {};
      current = current[n];
    }
    n = arr[arr.length - 1];

    return function (err, data) {
      current[n] = data;
      callback(err, result);
    };
  }

  return read;
}) (require('path'), require('fs'), require('async'));