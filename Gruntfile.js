'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.initConfig({
        nodeunit: {
            files: []
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: [
                    'attribute.js',
                    'cfg.js',
                    'iotdb.js',
                    'meta.js',
                    'model.js',
                    'model_maker.js',
                    'queue.js',
                    'thing_array.js',
                    'helpers/*.js',
                    'bin/iotdb',
                ]
            },
            test: {
                src: []
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test']
            }
        },
        jsbeautifier: {
            files: [
                '*.js'
            ],
            options: {
                js: {
                    jslint_happy: true,
                    indentChar: ' ',
                    indentSize: 4
                }
            },
        },
        mocha_istanbul: {
            coverage: {
                // src: 'test', // a folder works nicely 
            }
        }
    });

    grunt.registerTask('default', ['jsbeautifier', 'jshint', 'coverage']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
};
