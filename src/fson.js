module.exports = (function (Path, FS, async, NSConf) {
  'use strict';

  function fson(path, callback) {
    if(typeof path !== 'string')
      throw new Error("path must be string");
    
    var async = typeof callback === 'function';
    var state = new NSConf();
    path = Path.normalize(path);

    if (async) {
      read(path, '', state, function (err, state) {
        callback(err, state && state.get && state.get(''));
      });
    } else {
      readSync(path, '', state);
      return state.get('');
    }
  }

  function read(path, namespace, state, callback) {

    FS.stat(path, function (err, stat) {
      if (err) return callback(err);
      
      if (stat.isFile() && Path.extname(path) === '.json') {
        readJSONFile(path, namespace, state, callback);
      }

      if (stat.isDirectory()) {
        readDirectory(path, namespace, state, callback);
      }
    });
  }

  function readSync(path, namespace, state){
    var stat = FS.statSync(path);
      
    if (stat.isFile() && Path.extname(path) === '.json') {
      readJSONFileSync(path, namespace, state);
    }

    if (stat.isDirectory()) {
      readDirectorySync(path, namespace, state);
    }
  }

  function readJSONFile(path, namespace, state, callback) {
    namespace = dropExtension(namespace, '.json');
    
    FS.readFile(path, { 'encoding':'utf-8'}, function (err, data) {
      if (err) return callback(err);

      try {
        var json = JSON.parse(data);
        state.set(namespace, json);
        callback(null, state);
      } catch (e) {
        //TODO: check if nextTick(callback) will resolve the problem with jasmine
        callback(e);
      }
    });
  }
  
  function readJSONFileSync(path, namespace, state) {
    namespace = dropExtension(namespace, '.json');
    var data = FS.readFileSync(path, { 'encoding':'utf-8'});
    var json = JSON.parse(data);
    state.set(namespace, json);
  }


  function readDirectory(path, namespace, state, callback) {
    FS.readdir(path, function (err, filenames) {
      if (err) return callback(err);
      async.map(
          filenames, 
          function (filename, _callback) {
            var _path = Path.join(path, filename);
            var _namespace = joinNamespace(namespace, filename);
            read(_path, _namespace, state, _callback);
          }, 
          function (err, datas) {
            if (err) return callback(err);
            callback(null, state);
          }
      );

    });
  }

  function readDirectorySync(path, namespace, state) {
    var _path, _namespace;
    var filenames = FS.readdirSync(path);
    for (var i = 0; i < filenames.length; i++) {
      var filename = filenames[i];
      _path = Path.join(path, filename);
      _namespace = joinNamespace(namespace, filename);
      readSync(_path, _namespace, state);
    }
  }

  function joinNamespace(base, addition) {
    return base === ''? addition: base + '.' + addition;
  }

  function dropExtension(namespace, extension) {
    var el = extension.length;
    var extStartInd = namespace.length - el;
    if (namespace.substr(extStartInd) === extension) {
      return namespace.substr(0, extStartInd);
    }
    return namespace;
  }

  return fson;
}) (require('path'), require('fs'), require('async'), require('nsconf'));