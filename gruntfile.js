module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ["src/less"]
                },
                files: {"static/css/custom.css": "src/less/main.less"}
            }
        },
        concat: {
            options: {
                separator: "\n"
            },
            dist: {
                src: [
                    'static/js/finance/finance.js',
                    'static/js/finance/gridlines.js',
                    'static/js/finance/buildd3.js'
                ],
                dest: 'static/js/finance.js'
            }
        },
        watch: {
            less: {
                files: ['src/less/**/*.less'],
                tasks: ['less']
            },
            concat: {
                files: ['static/js/finance/**/*.js'],
                tasks: ['concat']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);
};
