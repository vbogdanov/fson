/* global describe: false */
/* global it: false */
/* global expect: false */
/* global beforeEach: false */
/* global jasmine: false */
/* jshint maxstatements: 30 */
var fson = require('../src/fson');
var Path = require('path');
var testPath  = Path.join(Path.dirname(module.filename), 'res');

function res(name) {
  return Path.join(testPath, name);
}

describe('fson', function () {
  'use strict';

  var EXPECTATIONS = {
    'singleFile.json': { test: true },
    'simpleDir': { 'singleFile': { test: true }},
    'complex': { 
      'foo': { 
        'singleFile': { test: true }
      }, 'bar': {
        'bar': 'value'
      }, 'baz': {
        'baz': 'value'
      }
    },
    'dotted': {
      'dot':{
        'ted': {
          'fi':{
            'le':true
          }
        }
      }
    }
  };

  it('is a function', function () {
    expect(fson).toEqual(jasmine.any(Function));
  });

  describe('async usage', function () {
    for (var resource in EXPECTATIONS) {
      it('reads ' + resource + ' and returns the contained data', function (next) {
        var path = res(resource);
        fson(path, function (err, data) {
          if (err) {
            console.error(err);
            next(err);
          }

          expect(data).toEqual(EXPECTATIONS[resource]);
          next();
        });
      });
    }
  });

  describe('sync usage', function () {
    for (var resource in EXPECTATIONS) {
      it('reads ' + resource + ' and returns the contained data', function () {
        var path = res(resource);
        var data = fson(path);
        expect(data).toEqual(EXPECTATIONS[resource]);
      });
    }
  });

  describe('sync for invalid parameters', function () {
    it('throws at reading non-existing path', function () {
      var path = 'not existin';
      expect(function () {
        fson(path);
      }).toThrow();
    }); 

    it('throws at reading invalid json', function () {
      var path = res('invalidJSON');
      expect(function () {
        fson(path);
      }).toThrow();
    });

  });

  describe('async for invalid parameters', function (next) {
    it('throws at reading non-existing path', function () {
      var path = 'notExisting';
      fson(path, function (err, data) {
        expect(err).toEqual(jasmine.any(Error));
        setTimeout(next, 0);
      });
    }); 

    it('throws at reading invalid json', function (next) {
      var path = res('invalidJSON');
      fson(path, function (err, data) {
        expect(err).toEqual(jasmine.any(Error));
        next();
      });
    });

  });

});