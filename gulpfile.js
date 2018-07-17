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
        sourcemaps = require('gulp-sourcemaps'),
        concat = require('gulp-concat');

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
            .pipe(concat("templates-scat.js"))
            .pipe(uglify())
            .pipe(gulp.dest('build/'));
    });

    gulp.task('build:js', function () {
        return browserify('src/index.js', { transform: strictify })
            .bundle()
            .pipe(source('controllers-scat.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('build/'));
    });

    gulp.task('watch', function() {
        gulp.watch('src/**/*.*', gulp.series('build:html', 'build:js'));
    });

    gulp.task('build', gulp.series('build:html', 'build:js'));

    gulp.task('default', gulp.series('build', 'watch'));

}());
