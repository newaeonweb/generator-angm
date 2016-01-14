(function() {
    var gulp = require('gulp');
    require('gulp-grunt')(gulp);

    var $ = require('gulp-load-plugins')();
    var watch = require('gulp-watch');
    var del = require('del');
    var exec = require('child_process').exec;
    var inject = require('gulp-inject');
    var uglify = require('gulp-uglifyjs');
    var less = require('gulp-less');
    var minifyCSS = require('gulp-minify-css');
    var concatCss = require('gulp-concat-css');
    var glob = require('glob');
    var rename = require('gulp-rename');
    var ngAnnotate = require('gulp-ng-annotate');
    var sourcemaps = require('gulp-sourcemaps');
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');
    var jslint = require('gulp-jslint-simple');
    var jslintrc = require('./jslintrc');
    var jscs = require('gulp-jscs');
    var htmlhint = require('gulp-htmlhint');
    var templateCache = require('gulp-angular-templatecache');
    var zip = require('gulp-zip');

    var rootDir = 'main';

    // Frontend Paths
    var publicDir = rootDir + '/public';
    var publicLibDir = publicDir + '/lib';
    var distDir = publicDir + '/dist';
    var modulesDir = publicDir + '/modules';

    // Backend Paths
    var pyLib = 'lib';
    var pyLibDir = rootDir + '/' + pyLib;
    var tempDir = 'temp';
    var venvDir = tempDir + '/venv';
    var storageDir = tempDir + '/storage';

    var jsFiles = {
        lib     : [
            'lib/angular/angular.js',
            'lib/angular-ui-router/release/angular-ui-router.js',
            'lib/angular-animate/angular-animate.js',
            'lib/angular-messages/angular-messages.js',
            'lib/angular-aria/angular-aria.js',
            'lib/restangular/dist/restangular.js',
            'lib/angular-no-captcha/src/angular-no-captcha.js',
            'lib/angular-material/angular-material.js',
            'lib/lodash/lodash.js',
            'lib/lrInfiniteScroll/lrInfiniteScroll.js',
            'lib/angulartics/src/angulartics.js',
            'lib/angulartics/src/angulartics-ga.js'
        ],
        scripts : [
            'application.js',
            'modules/**/*.js',
            '!modules/**/tests/**/*.js'
        ]
    };
    var cssFiles = [
        'lib/angular-material/angular-material.css'
    ];
    var lessPaths = [
        publicDir + '/lib/font-awesome/less'
    ];
    var appLessPaths = publicDir + '/modules/**/less';
    lessPaths = lessPaths.concat(glob.sync(appLessPaths));

    var manifestLessFile = 'modules/core/less/manifest.less';
    var injectAssetsDir = rootDir + '/templates/bit/';
    var htmlViews = ['modules/**/*.html'];

    gulp.task('bower-install', function() {
        return $.bower();
    });

    gulp.task('reload', function() {
        $.livereload.listen();
        gulp.watch(jsFiles.scripts.concat(htmlViews), {
            cwd : publicDir
        }).on('change', $.livereload.changed);
    });

    function injectScripts() {
        var target = gulp.src(injectAssetsDir + 'script.html');
        var sources = gulp.src(jsFiles.lib.concat(jsFiles.scripts), {
            read : false,
            cwd  : publicDir
        });
        return target.pipe(inject(sources, {
            addPrefix : '/p'
        })).pipe(gulp.dest(injectAssetsDir));
    }

    gulp.task('inject-scripts', injectScripts);

    gulp.task('watch-new-scripts', function() {
        watch([modulesDir + '/**/*.js', publicDir + '/*.js'], function(e) {
            if (e.event === 'add' || e.event === 'unlink') {
                injectScripts();
            }
        });
    });

    gulp.task('uglify', ['less'], function() {
        gulp.src(jsFiles.lib, {
            cwd : publicDir
        }).pipe(uglify('libs.min.js')).pipe(gulp.dest(distDir));
        gulp.src(jsFiles.scripts, {
            cwd : publicDir
        }).pipe(ngAnnotate()).pipe(uglify('scripts.min.js')).pipe(gulp.dest(distDir));
        gulp.src('style.css', {
            cwd : distDir
        }).pipe(minifyCSS()).pipe(rename({
            suffix : '.min'
        })).pipe(gulp.dest(distDir));
    });

    gulp.task('less', function() {
        return gulp.src(cssFiles.concat(manifestLessFile), {
            cwd : publicDir
        }).pipe(sourcemaps.init()).pipe(less({
            paths : lessPaths
        })).pipe(sourcemaps.write()).pipe(concatCss('style.css')).pipe(gulp.dest(distDir));
    });

    gulp.task('watch-less', function() {
        gulp.watch(appLessPaths + '/*.less', ['less']);
    });

    gulp.task('jshint', function() {
        return gulp.src(jsFiles.scripts, {
            cwd : publicDir
        }).pipe(jshint()).pipe(jshint.reporter(stylish));
    });

    gulp.task('jslint', function() {
        return gulp.src(jsFiles.scripts, {
            cwd : publicDir
        }).pipe(jslint.run(jslintrc)).pipe(jslint.report({
            reporter : stylish.reporter
        }));
    });

    gulp.task('jscs', function() {
        return gulp.src([modulesDir + '/**/*.js', './*.js']).pipe(jscs());
    });

    gulp.task('htmlhint', function() {
        return gulp.src(htmlViews, {
            cwd : publicDir
        }).pipe(htmlhint({
            htmlhintrc : 'htmlhintrc.json'
        })).pipe(htmlhint.reporter());
    });

    gulp.task('lint', ['jshint', 'jslint', 'jscs', 'htmlhint', 'grunt-pylint']);

    gulp.task('template-cache', function() {
        gulp.src('modules/**/*.html', {
            cwd : publicDir
        }).pipe(templateCache('templates.js', {
            standalone : false,
            root       : '/p/modules',
            module     : 'gae-angular-material-starter'
        })).pipe(gulp.dest(distDir));
    });

    gulp.task('copy-fonts', function() {
        gulp.src('font-awesome/fonts/*', {
            cwd : publicLibDir
        }).pipe(gulp.dest(distDir + '/fonts'))
    });

    gulp.task('clean-js', function() {
        del([publicLibDir, distDir]);
    });

    gulp.task('clean-cache', function(callback) {
        del([rootDir + '/**/*.pyc', rootDir + './**/*.pyo', rootDir + './**/.*~'], callback);
    });

    gulp.task('zip-lib', ['clean-cache'], function() {
        gulp.src(pyLibDir + '/**/*')
            .pipe(zip(pyLib + '.zip'))
            .pipe(gulp.dest(rootDir));
    });

    gulp.task('clean-storage', function() {
        del([storageDir]);
    });

    gulp.task('clean-python', function() {
        del([venvDir, pyLibDir]);
    });

    gulp.task('clean-all', ['clean-cache', 'clean-python'], function() {
        del(['bower_compenents', 'node_modules', publicLibDir, distDir, venvDir, pyLibDir]);
    });

    gulp.task('run-server', function() {
        var proc = exec('python -u run.py');
        proc.stderr.on('data', function(data) {
            process.stderr.write(data);
        });
        proc.stdout.on('data', function(data) {
            process.stdout.write(data);
        });
    });

    gulp.task('watch', ['reload', 'watch-less', 'watch-new-scripts']);

    gulp.task('run', [
        'clean-cache',
        'bower-install',
        'inject-scripts',
        'less',
        'watch',
        'copy-fonts',
        'run-server'
    ]);

    gulp.task('build', [
        'lint',
        'zip-lib',
        'uglify',
        'inject-scripts',
        'template-cache',
        'copy-fonts'
    ]);

    gulp.task('default', ['run']);

}());
