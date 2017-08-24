/**
 * npm install --save-dev gulp
 * npm install --save-dev gulp-ng-annotate
 */
var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('default', function () {
    return gulp.src('app/app.js')
        .pipe(ngAnnotate())
        .pipe(gulp.dest('dist'));
});