module.exports = function(grunt) {

    grunt.initConfig({
        pylint : {
            options : {
                virtualenv : 'temp/venv',
                rcfile     : '.pylintrc'
            },
            app     : {
                src : [
                    './*.py',
                    'main/*.py',
                    'main/api/**/*.py',
                    'main/auth/**/*.py',
                    'main/control/**/*.py',
                    'main/model/**/*.py'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-pylint');
    grunt.registerTask('default', ['grunt-pylint']);
};
