//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-ng-html2js-preprocessor'
    ],

    preprocessors: {
      // '**/*.html': 'html2js'
      'views/*.html': 'ng-html2js'
    },

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'views/*.html',
      'app*.js',
      'components/*.js',
      'services/*.js',
    ],

//     ngHtml2JsPreprocessor: {
//     // strip this from the file path
//     // stripPrefix: '.*/project/angular-app/',
//     prependPrefix: '/base/'
// },

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
;