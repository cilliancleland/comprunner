
module.exports = function(config) {
  config.set({

    basePath: '',

    // plugins: [
    //   'karma-chrome-launcher',
    //   'karma-firefox-launcher',
    //   'karma-jasmine',
    //   'karma-junit-reporter',
    //   'karma-ng-html2js-preprocessor',
    //   'karma-webpack'
    // ],

    // files: [
    //   'bower_components/angular/angular.js',
    //   'bower_components/angular-route/angular-route.js',
    //   'bower_components/angular-mocks/angular-mocks.js',
    //   'views/*.html',
    //   'app*.js',
    //   'components/*.js',
    //   'services/*.js',
    // ],
    
    files: [
      './dist/vendor.bundle.js',
      // './node_modules/angular-mocks/angular-mocks.js',
      './app/bower_components/angular-mocks/angular-mocks.js',
      './app/views/*.html',
      './dist/app.bundle.js',
      './app/services/*.spec.js',
      './app/components/*.spec.js'
    ],

    preprocessors: {
      './app/views/*.html': ['ng-html2js']
    },

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