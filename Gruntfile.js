'use strict';

// Use:
// 
// grunt server    to build and launch HTML5 version
// 
// grunt build:html5
// grunt build:android
// grunt build:ios       to build versions
// 
// grunt build      to build all
// 
// grunt clean      to clean intermediate files
// 
// 

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    paths: {
      res: 'Resources',
      src: 'src',
      dist: 'dist',
      webhome: '.',
      bower: './bower_components',
      test: 'test',
      tmp: '.tmp'
    },

    properties: grunt.file.isFile('grunt.local.json') ?
                  grunt.file.readJSON('grunt.local.json') : {},

    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      server: {
        options: {
          base: [
            '<%= paths.dist %>',
            '<%= paths.webhome %>',
            '<%= paths.tmp %>',
            '<%= paths.res %>',
            '<%= paths.bower %>/cocos2d-html5',
            '<%= paths.bower %>/requirejs'
          ]
        }
      },
      test: {
        options: {
          port: 9002,
          base: [
            '<%= paths.dist %>',
            '<%= paths.test %>',
            '<%= paths.webhome %>',
            '<%= paths.tmp %>',
            '<%= paths.res %>',
            '<%= paths.bower %>/cocos2d-html5',
            '<%= paths.bower %>/requirejs'
          ]
        }
      },
      dist: {
        options: {
          base: [
            '<%= paths.dist %>'
          ]
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      },
      test: {
        path: 'http://localhost:<%= connect.test.options.port %>'
      }
    },

    clean: {
      dist: ['<%= paths.tmp %>', '<%= paths.dist %>/*'],
      server: '<%= paths.tmp %>'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: './jshint-reporter.js'
      },
      all: [
        'Gruntfile.js',
        '<%= paths.src %>/{,*/}*.js',
        '<%= paths.res %>/{,*/}*.js',
        '<%= paths.webhome %>/*.js',
        '<%= paths.test %>/spec/{,*/}*.js',
        '!<%= paths.webhome %>/vendor/*',
        '!<%= paths.bower %>/*'
      ]
    },

    mocha: {
      all: {
        options: {
          reporter: 'Spec',
          run: false,
          urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
        }
      }
    },

    watch: {
      compass: {
        files: ['<%= paths.res %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      js: {
        files: '<%= jshint.all %>',
        tasks: ['jshint', 'browserify']
      },
      jstest: {
        files: '<%= paths.test %>/spec/{,*/}*.js',
        tasks: ['test:watch']
      }
    },

    browserify: {
      dist: {
        files: {
          'dist/bundled-scripts.js': [
            '<%= paths.src %>/boot.js'
          ]
        },
      },
      options: {
        external: [
          'jsb.js'
        ],
        debug: true
      }
    },

    shell: {
      buildnative: {
        command: 'python build_native.py',
        options: {
          stdout: true,
          execOptions: {
            cwd: 'proj.android'
          }
        }
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.res %>',
          dest: '<%= paths.dist %>',
          src: [
            '**/*.{png,jpg}',
            '**/*.js',
            '*.{ico,txt}',
            '**/*.plist'
          ]
        }, {
          expand: true,
          dot: false,
          cwd: '<%= paths.bower %>/requirejs',
          dest: '<%= paths.dist %>',
          src: [
            'requirejs/require.js'
          ]
        }, {
          expand: true,
          dot: false,
          cwd: '<%= paths.bower %>/cocos2d-html5',
          dest: '<%= paths.dist %>',
          src: [
            'external/**/*.js',
            'cocos2d/**/*.js',
          ]
        }, {
          expand: true,
          cwd: '<%= paths.webhome %>',
          dest: '<%= paths.dist %>',
          src: [
            'cocos2d.js',
            'main.js',
            'index.html',
            'manifest.webapp'
          ]
        }
        ]
      }
    }

  });

  grunt.registerTask('build', function (target) {
    if (target === 'html5') {
      grunt.task.run([
        'jshint',
        'clean:dist',
        'copy:build',
        'browserify'
      ]);
    } else if (target === 'android') {
      grunt.task.run([
        'build:html5',
        'shell:buildnative'
      ]);
    } else if (target === 'ios') {
      grunt.task.run([
        'build:html5'
      ]);
    } else {
      grunt.task.run([
        'build:html5',
        'build:ios',
        'build:android'
      ]);
    }
  });
 
  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      grunt.task.run([
        'build:html5',
        'browserify',
        'open:server',
        'connect:dist:keepalive'
      ]);
    } else if (target === 'test') {
      grunt.task.run([
        'clean:server',
        'connect:test',
        'open:test',
        'watch'
      ]);
    } else {
      grunt.task.run([
        'build:html5',
        'browserify',
        'clean:server',
        'connect:server',
        'open:server',
        'watch'
      ]);
    }
  });

  grunt.registerTask('test', [
    'jshint',
    'clean:server',
    'connect:test',
    'mocha'
  ]);

};
