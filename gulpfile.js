/*!
 * $ npm install --global gulp
 * $ npm install --save-dev gulp
 * $ npm install --save-dev gulp-rev
 * $ npm install --save-dev gulp-rev-collector
 * $ npm install --save-dev gulp-asset-rev
 * $ npm install --save-dev run-sequence
 * $ npm install --save-dev gulp-ng-annotate
 */

'use strict';

var gulp = require('gulp'),
    rev = require('gulp-rev'), // MD5哈希值版本号
    revCollector = require('gulp-rev-collector'), // 路径替换
// concat = require('gulp-concat'), // 多文件合并
// minifyCss = require('gulp-minify-css'), // CSS压缩
// htmlmin = require('gulp-htmlmin'),
// imagemin = require('gulp-imagemin'),
// rename = require('gulp-rename'),
// changed = require('gulp-changed'),
// gulpIf = require('gulp-if'),
// del = require('del'),
    runSequence = require('run-sequence'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('revCss', [], function () {
    return gulp.src('assets/css/**/*.css')
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('revJs', function () {
    return gulp.src('assets/js/**/*.js')
        .pipe(ngAnnotate())
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('revHtml', function () {
    return gulp.src(['dist/**/*.json', 'index.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('public'));
});

gulp.task('install', function () {
    runSequence([
        'revCss',
        'revJs',
        'revHtml'
    ]);
});

gulp.task('default', ['install']);