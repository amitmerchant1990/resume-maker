module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8081,
                    keepalive: true,
                    //base: 'build'
                    base: './'
                }
            }
        },
        clean: ['build'],
        copy: {
            main: {
                expand: true,
                src: ['app/index.html', 'app/fonts/*', 'app/images/*', 'app/partials/**/*.html'],
                dest: 'build/'
            }
        },
        concat: {
            css: {
                src: ['app/css/*'],
                dest: 'build/css/app.min.css'
            },
            js : {
                src: ['app/js/angular.js', 'app/js/angular-ui-router.js', 'app/js/angular-sanitize.js', 'app/js/jquery.min.js', 'app/js/angular-route.min.js', 'app/js/angular-messages.min.js', 'app/js/angular-material.js', 'app/js/angular-aria.min.js', 'app/js/angular-animate.min.js', 'app/js/svg-assets-cache.js', 'app/controllers/**/*.js', 'app/services/**/*.js', 'app/app.js'],
                dest : 'build/js/app.min.js'
            }
        },
        cssmin : {
            css:{
                src: 'build/assets/css/app.min.css',
                dest: 'build/assets/css/app.min.css'
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            components: {
                expand: true,
                src: ['build/app/**/*.html'],
                dest: 'build/components/'
            },
            index: {
                src: 'build/app/index.html',
                dest: 'build/index.html'
            }
        },
        uglify: {
            js: {
                options: {
                    mangle: false,
                    sourceMap: true
                },
                files: {'build/assets/js/app.min.js': ['build/assets/js/app.min.js']}
            }
        },
        useminPrepare: {
            html: 'build/index.html'
        },
        usemin: {
            html: ['build/index.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('default', ['clean', 'copy', 'concat:css', 'cssmin:css', 'concat:js', 'uglify:js', 'usemin', 'htmlmin:components', 'htmlmin:index']);

};
