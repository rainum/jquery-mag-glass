'use strict';

module.exports = function (grunt) {
  // Define the configuration for all the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    autoprefixer: {
      options: {
        browsers: ['last 3 version']
      },
      dist: {
        src: 'src/mag-glass.css',
        dest: 'dist/mag-glass.css'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/mag-glass.min.js': 'dist/mag-glass.js'
        },
        options: {
          compress: {
            hoist_funs: false,
            loops: false
          },
          banner: '/*! jQuery Mag Glass Plugin v<%= pkg.version %> | (c) 2014 Vazha Omanashvili */',
          sourceMap: 'dist/mag-glass.min.map',
          beautify: {
            ascii_only: true
          }
        }
      }
    },
    cssmin: {
      dist: {
        options: {
          banner: '/* jQuery Mag Glass Plugin v<%= pkg.version %> | (c) 2014 Vazha Omanashvili */'
        },
        files: {
          'dist/mag-glass.min.css': 'dist/mag-glass.css'
        }
      }
    },
    copy: {
      js: {
        src: 'src/mag-glass.js',
        dest: 'dist/mag-glass.js'
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'build'
      },
      js: {
        files: 'dist/{,**/}*.js',
        tasks: 'copy'
      },
      compass: {
        files: 'dist/{,**/}*.css',
        tasks: 'autoprefixer'
      }
    }
  });

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.registerTask('build', [
    'copy',
    'autoprefixer',
    'uglify',
    'cssmin'
  ]);
};