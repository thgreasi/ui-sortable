// Karma configuration
// Generated on Sat Dec 28 2013 20:27:08 GMT+0100 (CET)

'use strict';

module.exports = function(config) {
  var wiredep = require('wiredep');

  var fs = require('fs');
  var bowerOverrides = JSON.parse(fs.readFileSync('./test/bower_overrides.json'));

  var devJSDependencies = wiredep({
    devDependencies: true,
    overrides: bowerOverrides
  }).js;

  devJSDependencies = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    // 'src/jq/jquery.js',
    // 'bower_components/jquery-ui/jquery-ui.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/jquery-simulate/jquery.simulate.js'
  ];

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '..',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: devJSDependencies.concat([
      'src/jq/ui.core.js',
      'src/jq/ui.widget.js',
      'src/jq/ui.mouse.js',
      'src/jq/ui.sortable.js',
      'src/sortable.js',
      'test/libs/jquery.simulate.dragandrevert.js',
      'test/sortable.test-helper.js',
      'test/sortable.test-directives.js',
      'test/*.spec.js',
      'test/sortable.tests.css'
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
