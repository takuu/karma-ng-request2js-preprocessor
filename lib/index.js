var util = require('util');
var fs = require('fs');
var TEMPLATE = 'angular.module("%s", []).run(function($httpBackend) {\n' +
    '  $httpBackend.when("GET", "%s").respond(%s);\n' +
    '});\n';

var SINGLE_MODULE_TPL = '(function(module) {\n' +
    'try {\n' +
    '  module = angular.module("%s");\n' +
    '} catch (e) {\n' +
    '  module = angular.module("%s", []);\n' +
    '}\n' +
    'module.run(function($httpBackend) {\n' +
    '  $httpBackend.when("GET", "%s").respond(%s);\n' +
    '});\n' +
    '})();\n';


var createRequest2JsPreprocessor = function(logger, basePath, config) {
  config = typeof config === 'object' ? config : {};

  var log = logger.create('preprocessor.request2js');
  var moduleName = config.moduleName || 'jsons';
  var stripPrefix = new RegExp('^' + (config.stripPrefix || ''));
  var prependPrefix = config.prependPrefix || '';
  var stripSufix = new RegExp((config.stripSufix || '') + '$');
  var cacheIdFromPath = config && config.cacheIdFromPath || function(filepath) {
    return prependPrefix + filepath.replace(stripPrefix, '').replace(stripSufix, '');
  };

  return function(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    var htmlPath = cacheIdFromPath(file.originalPath.replace(basePath + '/', ''));

    if (!/\.js$/.test(file.path)) {
      file.path = file.path + '.js';
    }

    if (moduleName) {
      done(util.format(SINGLE_MODULE_TPL, moduleName, moduleName, htmlPath, JSON.stringify(content)));
    } else {
      done(util.format(TEMPLATE, htmlPath, htmlPath, JSON.stringify(content)));
    }
  };
};

createRequest2JsPreprocessor.$inject = ['logger', 'config.basePath', 'config.ngRequest2JsPreprocessor'];

module.exports = {
  'preprocessor:ng-request2js': ['factory', createRequest2JsPreprocessor]
};
