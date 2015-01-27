karma-ng-request2js-preprocessor
================================

A Karma plugin. Preprocess JSON files for loose (black-box) unit testing.

## Installation

```
npm install karma-ng-request2js-preprocessor --save-dev
```

## Configuration

**Example:**
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.json': ['ng-request2js']
    },
    ngRequest2JsPreprocessor: {
      // setting this option will create only a single module that
      // contains the JSON from the files.  So you'll need to load
      // this with module('jsons')
      moduleName: 'jsons',
      stripPrefix: '',
      prependPrefix: '/'
    },
    files: [
      '*.json'
    ]
  });
};
```

## How does it work?

The plugin preprocesses the JSON file for you.

For example.
```js
// foo.json
{
  "bar": "baz"
}
```
When loaded, the plugin puts the JSON files into $httpBackend:

```js
$httpBackend.when('GET', 'foo.json').respond({bar: "baz"});
```
