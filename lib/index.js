var util = require('util');

var TEMPLATE = 'angular.module(\'%s\', []).run(function($http) {\n' +
    '  $http.get(\'%s\',\n  {cache: true});\n' +
    '});\n';

var SINGLE_MODULE_TPL = '(function(module) {\n' +
    'try {\n' +
    '  module = angular.module(\'%s\');\n' +
    '} catch (e) {\n' +
    '  module = angular.module(\'%s\', []);\n' +
    '}\n' +
    'module.run(function($http) {\n' +
    '  $http.get(\'%s\',\n  {cache:true});\n' +
    '});\n' +
    '})();\n';


var createRequest2JSPreprocessor = function(logger, basePath, config) {
  config = typeof config === 'object' ? config : {};

  var log = logger.create('preprocessor.request2js');
  var moduleName = config.moduleName;
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

    console.log(util.format(TEMPLATE, htmlPath, htmlPath));

    if (moduleName) {
      done(util.format(SINGLE_MODULE_TPL, moduleName, moduleName, htmlPath));
    } else {
      done(util.format(TEMPLATE, htmlPath, htmlPath));
    }
  };
};

createRequest2JSPreprocessor.$inject = ['logger', 'config.basePath', 'config.ngRequest2JSPreprocessor'];

module.exports = {
  'preprocessor:ng-request2js': ['factory', createRequest2JSPreprocessor]
};
