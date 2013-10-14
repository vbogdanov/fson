FSON
====

File System Object Notation - A function constructing json-like javascript objects from directory tree.
Folders become JavaScript Objects. Files in a folder - properties of the object. As a result an fs tree

*   settings
    *   foo
        *   config.json
        *   data.json
    *   bar
        *   config.json

will produce javascript objects:

```javascript
{
 "foo": {
    "config": "config.json contents come here",
    "data": "and data.json contents"
  },
  "bar": {
    "config": 1234
  }
}
```

and dotted filenames are broken into multiple objects. For example reading settings:

*   settings
    *   foo.bar
        *   config.json
    *   exam.ple.json

will result in

```js
{
  "foo": {
    "bar":{
      "config":"config.json contents"
    }
  },
  "exam":{
    "ple": "exam.ple.json contents"
  }
}
```

Example usage:
-------------
```js
var SETTINGS_PATH = '/etc/nodeApp';
require('fson')(SETTINGS_PATH, function (error, settings) {
  //use settings
});
```
