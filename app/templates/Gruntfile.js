// Grunt tasks

module.exports = function (grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
			'* <%= pkg.name %> - v<%= pkg.version %> - MIT LICENSE <%= grunt.template.today("yyyy-mm-dd") %>. \n' +
			'* @author <%= pkg.author %>\n' +
			'*/\n',

		clean: {
			dist: ['src/tmp']
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			app: {
				src: ['app/modules/**/*.js']
			}
		},

		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: false
			},
			base: {
				src: [
					// Angular Project Dependencies,
					'src/bower_components/angular/angular.js',
					'src/bower_components/angular-resource/angular-resource.js',
					'src/bower_components/angular-mocks/angular-mocks.js',
					'src/bower_components/angular-cookies/angular-cookies.js',
					'src/bower_components/angular-animate/angular-animate.js',
					'src/bower_components/angular-touch/angular-touch.js',
					'src/bower_components/angular-sanitize/angular-sanitize.js',
					'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
					'src/bower_components/angular-route/angular-route.js'
				],
				dest: 'src/tmp/<%= pkg.name %>-angscript.js'
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>',
				report: 'min'
			},
			base: {
				src: ['<%= concat.base.dest %>'],
				dest: 'app/assets/js/<%= pkg.name %>-angscript.min.js'
			},
			basePlugin: {
				src: [ 'src/plugins/**/*.js' ],
				dest: 'app/assets/js/plugins/',
				expand: true,
				flatten: true,
				ext: '.min.js'
			}
		},

		connect: {
			server: {
				options: {
					keepalive: true,
					port: 8000,
					base: '.',
					hostname: 'localhost',
					debug: true,
					livereload: true,
					open: true
				}
			}
		},
		concurrent: {
			tasks: ['connect', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},

		watch: {
			app: {
				files: '<%= jshint.app.src %>',
				tasks: ['jshint:app'],
				options: {
					livereload: true
				}
			}
		},

		injector: {
			options: {},
			local_dependencies: {
				files: {
					'index.html': [
						'bower.json',
						'app/app.js',
						'app/**/*Route.js',
						'app/**/*Ctrl.js',
						'app/**/*Service.js',
						'app/**/*Directive.js'
					]
				}
			}
		}


	});

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project if something fail.
	grunt.option('force', true);

	// Register grunt tasks
	grunt.registerTask("build", [
		"jshint",
		"concat",
		"uglify",
		"clean",
		"injector"
	]);

	// Development task(s).
	grunt.registerTask('dev', ['injector', 'concurrent']);

};
