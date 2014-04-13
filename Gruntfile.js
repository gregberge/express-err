/* jshint camelcase: false */
'use strict';

// Use development as default environment.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = function (grunt) {

  /**
   * Configuration.
   */

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    lint_pattern: {
      no_console: {
        options: {
          rules: [{
            pattern: /console\./,
            message: 'Calling "console." is not allowed.'
          }]
        },
        files: [
          {src: 'lib/**/*.js'},
          {src: 'test/**/*.js'}
        ]
      },
      no_only: {
        options: {
          rules: [{
            pattern: /\.only\(./,
            message: 'You forgot a `.only` call.'
          }]
        },
        files: [
          {src: 'test/**/*.js'}
        ]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: ['*.js', './lib/**/*.js', './test/**/*.js']
    },
  });


  require('load-grunt-tasks')(grunt);


  /*
   * Test related tasks
   */
  grunt.registerTask('lint:all', ['jshint', 'lint_pattern']);
  grunt.registerTask('default', ['lint:all']);
};