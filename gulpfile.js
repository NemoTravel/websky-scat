(function() {

    var gulp = require('gulp'),
        del = require('del'),
        browserify = require('browserify'),
        strictify = require('strictify'),
        buffer = require('vinyl-buffer'),
        ngHtml2Js = require('gulp-ng-html2js'),
        minifyHtml = require('gulp-minify-html'),
        source = require('vinyl-source-stream'),
        uglify = require('gulp-uglify'),
        less = require('gulp-less'),
        sourcemaps = require('gulp-sourcemaps'),
        concat = require('gulp-concat'),
        karma = require('karma').Server;

    gulp.task('clean', function() {
        return del('build');
    });

    gulp.task('build:html', function() {
        return gulp.src('src/**/*.html')
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(ngHtml2Js({
                moduleName: 'app',
                rename: function(url) {
                    return url.replace('src/', '');
                }
            }))
            .pipe(concat("custom-templates.js"))
            .pipe(uglify())
            .pipe(gulp.dest('build/'));
    });

    gulp.task('build:js', function () {
        return browserify('src/index.js', { transform: strictify })
            .bundle()
            .pipe(source('custom-controllers.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('build/'));
    });

    gulp.task('build:css', function () {
        return gulp.src('./src/styles/insurance-with-iin.less')
            .pipe(less())
            .pipe(gulp.dest('./build/'));
    });

    gulp.task('watch', function() {
        gulp.watch('src/**/*.*', gulp.series('build:js', 'build:html'));
    });

    gulp.task('test:build', () => {
        return gulp.src([
            'node_modules/angular-mocks/angular-mocks.js',
            'src/**/*.spec.js'
        ])
            .pipe(concat('test.js'))
            .pipe(gulp.dest('build/'));
    });

    gulp.task('test:run', (cb) => {
        karma.start({
            configFile: `${__dirname }/karma.conf.js`,
            autoWatch: false,
            singleRun: true
        }, () => {
            cb();
        });
    });

    gulp.task('test', gulp.series('build:js', 'test:build', 'test:run'));

    gulp.task('tdd', () => {
        gulp.watch('src/**/*.*', gulp.series('test'));
    });

    gulp.task('build', gulp.series('build:js', 'build:html', 'build:css'));

    gulp.task('default', gulp.series('clean', 'build', 'watch'));

}());

