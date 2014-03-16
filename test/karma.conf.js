// Karma configuration
// Generated on Sat Dec 28 2013 20:27:08 GMT+0100 (CET)

'use strict';

module.exports = function(config) {
  function getBowerPackageFilePaths (packageName) {
    var fs = require('fs');

    var bowerComponentsPath = 'bower_components/';

    var packageBowerFilePath = bowerComponentsPath + packageName + '/bower.json';

    var files;
    try {
      var packageBowerFile = fs.readFileSync(packageBowerFilePath);
      var packageBowerJson = JSON.parse(packageBowerFile);
      if (typeof packageBowerJson.main === 'string') {
        files = [ packageBowerJson.main ];
      } else {
        files = packageBowerJson.main;
      }
    } catch (ex) {
      files = [ packageName.replace(/-/g, '.') + '.js' ];
    }

    return files.map(function (packageFile) {
      return bowerComponentsPath + packageName + '/' + packageFile;
    })
    .map(function (x) {
      return x.replace(/\/.\//g, '/');
    });
  }

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '..',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'jquery',
      'jquery-simulate',
      'jquery-ui',
      'angular',
      'angular-mocks'
    ]
    .map(getBowerPackageFilePaths)
    .reduce(function(a, b) {
      return a.concat(b);
    }).concat([
      'test/libs/jquery.simulate.dragandrevert.js',
      'src/sortable.js',
      'test/sortable.test-helper.js',
      'test/sortable.test-directives.js',
      'test/*.spec.js'
    ]),


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
