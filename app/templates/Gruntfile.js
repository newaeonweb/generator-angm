/* jshint node: true */

module.exports = function (grunt) {
	"use strict";

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
			'* bi-Framework v<%= pkg.version %> - Direitos Reservados <%= grunt.template.today("dd") %> <%= grunt.template.today("mm") %> <%= grunt.template.today("yyyy") %>. \n' +
			'* Uso Restrito a SSM - Sala de Situação Municipal.\n' +
			'*/\n',
		jqueryCheck: 'if (!jQuery) { throw new Error(\"jQuery Ausente\") }\n\n',

		clean: {
			dist: ['public']
		},

		jshint: {
			options: {
				jshintrc: 'src/.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			src: {
				src: ['src/*.js']
			},
			test: {
				src: ['src/tests/unit/*.js']
			}
		},

		concat: {
			options: {
				banner: '<%= banner %><%= jqueryCheck %>',
				stripBanners: false
			},
			base: {
				src: [
					//'src/styler.js',
					'src/scrollTop.js'
				],
				dest: 'public/js/<%= pkg.name %>-script.js'
			},
			kendo: {
				src: [
					'libs/kendo/kendo.web.js',
					'libs/kendo/kendo.dataviz.js',
					'libs/kendo/cultures/kendo.culture.pt-BR.js',
					'libs/kendo/cultures/kendo.messages.pt-BR.js'
					//'libs/kendo/kendo.mobile.js'
				],
				dest: 'public/js/vendors/kendo.<%= pkg.name %>.js'
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>',
				report: 'min'
			},
			base: {
				src: ['<%= concat.base.dest %>'],
				dest: 'public/js/<%= pkg.name %>-script.min.js'
			},
			basePlugin: {
				src: [ 'libs/plugins/*.js' ],
				dest: 'public/js/plugins/',
				expand: true,
				flatten: true,
				ext: '.min.js'
			},
			kendomin: {
				src: ['<%= concat.kendo.dest %>'],
				dest: 'public/js/vendors/kendo.bi-framework.min.js'
			}
		},

		recess: {
			options: {
				compile: true,
				banner: '<%= banner %>'
			},
			style: {
				options: {
					compress: false
				},
				src: ['less/style.less'],
				dest: 'public/css/<%= pkg.name %>-style.css'
			},
			style_min: {
				options: {
					compress: true
				},
				src: ['less/style.less'],
				dest: 'public/css/<%= pkg.name %>-style.min.css'
			},
			theme_min: {
				options: {
					compress: true
				},
				src: ['less/theme/theme.less'],
				dest: 'public/css/<%= pkg.name %>-theme.min.css'
			}
		},

		copy: {
			fonts: {
				expand: true,
				src: ["fonts/*"],
				dest: 'public/'
			},
			vendors: {
				cwd: 'libs/vendors',
				src: '**/*',
				dest: 'public/js/vendors',
				expand: true
			}
		},

		connect: {
			server: {
				options: {
					keepalive: true,
					port: 3000,
					base: '.'
				}
			}
		},

		watch: {
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test']
			},
			recess: {
				files: 'less/*.less',
				tasks: ['recess']
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
						'app/**/*Service.js'
					]
				}
			}
		}
    

	});

	// These plugins provide necessary tasks.
	grunt.loadTasks('tasks');

	// Register grunt tasks
	grunt.registerTask("default", [
		"clean",
		"jshint",
		"concat",
		"uglify",
		"recess",
		"copy",
		"docs"
	]);

	grunt.registerTask("dev", [
		"watch",
		"connect"
	]);

};
