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

  it('reads a file as json and returns the contained data', function (next) {
    fson(res('singleFile.json'), function (err, data) {
      expect(data).toEqual({ test: true });
      next();  
    });
  });

  it('reads a directory as a javascript object', function (next) {
    fson(res('simpleDir'), function (err, data) {
      if (err) {
        next(err);
      }

      expect(data).toEqual({ 'singleFile': { test: true }});
      next();  
    });
  });

  it('reads a complex directory as a javascript object', function (next) {
    fson(res('complex'), function (err, data) {
      if (err) {
        console.error(err);
        next(err);
      }

      expect(data).toEqual({ 
        'foo': { 
          'singleFile': { test: true }
        }, 'bar': {
          'bar': 'value'
        }, 'baz': {
          'baz': 'value'
        }
      });

      next();  
    });
  });

  it('breaks dotted names into namespace objects', function (next) {
    fson(res('dot.ted'), function (err, data) {
      if (err) {
        console.error(err);
        next(err);
      }

      expect(data).toEqual({
        'ted': {
          'fi':{
            'le':true
          }
        }
      });

      next();
    });
  });

});