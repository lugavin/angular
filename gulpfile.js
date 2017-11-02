/*!
 * ============================== bower vs npm vs yarn ==============================
 *
 * $ yarn install
 * $ bower install
 * $ gulp build
 *
 * $ npm init   # package.json
 * $ bower init # bower.json
 *
 * ============================== bower vs npm vs yarn ==============================
 *
 * $ npm cache clean
 * $ npm install -g grunt-cli
 * $ npm install -g bower
 * $ npm install --global gulp
 * $ npm install --save-dev gulp
 * $ npm install --save-dev gulp-rev
 * $ npm install --save-dev gulp-rev-collector
 * $ npm install --save-dev gulp-asset-rev
 * $ npm install --save-dev run-sequence
 * $ npm install --save-dev gulp-ng-annotate
 *
 * ============================== bower & npm ==============================
 *
 * $ bower install --save-dev noty
 *
 * ============================== bower & npm ==============================
 *
 * ============================== npm & yarn 指令对照表 ==============================
 *
 * npm                                         Yarn
 * $ npm install                               $ yarn install
 * (N/A)                                       $ yarn install --flat
 * (N/A)                                       $ yarn install --har
 * (N/A)                                       $ yarn install --no-lockfile
 * (N/A)                                       $ yarn install --pure-lockfile
 * $ npm install [package]                     (N/A)
 * $ npm install --save [package]              $ yarn add [package]
 * $ npm install --save-dev [package]          $ yarn add [package] --dev
 * (N/A)                                       $ yarn add [package] --peer
 * $ npm install --save-optional [package]     $ yarn add [package] --optional
 * $ npm install --save-exact [package]        $ yarn add [package] --exact
 * (N/A)                                       $ yarn add [package] --tilde
 * $ npm install --global [package]            $ yarn global add [package]
 * $ npm uninstall [package]                   (N/A)
 * $ npm uninstall --save [package]            $ yarn remove [package]
 * $ npm uninstall --save-dev [package]        $ yarn remove [package]
 * $ npm uninstall --save-optional [package]   $ yarn remove [package]
 * $ rm -rf node_modules && npm install        $ yarn upgrade
 *
 * ============================== npm & yarn 指令对照表 ==============================
 */

'use strict';

var gulp = require('gulp'),
    inject = require('gulp-inject'),
    rev = require('gulp-rev'),                      // MD5版本号
    revCollector = require('gulp-rev-collector'),   // 路径替换
    del = require('del'),
    runSequence = require('run-sequence'),
    concat = require('gulp-concat'),                // 多文件合并
    minCss = require('gulp-clean-css'),             // CSS压缩
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    changed = require('gulp-changed'),
    gulpIf = require('gulp-if');

gulp.task('clean', function () {
    return del(['www/'], {dot: true});
});

// https://coderwall.com/p/vtkdbg/inject-js-and-css-into-html-using-gulp

gulp.task('assets', function () {
    return gulp.src(['assets/css/*.css', 'assets/js/*.js', 'app/*.js', 'app/**/*.js'])
        .pipe(rev())
        .pipe(rev.manifest('tmp/rev-manifest.json', {
            base: 'www/',
            merge: true
        }))
        .pipe(gulp.dest('www/assets/'));
});

gulp.task('inject', function () {
    return gulp.src('index.html')
        .pipe(inject(gulp.src(['assets/css/*.css', 'assets/js/*.js', 'app/*.js', 'app/**/*.js'], {read: false})))
        .pipe(gulp.dest('www/'));
});

gulp.task('html', ['inject'], function () {
    return gulp.src(['www/tmp/rev-manifest.json', 'www/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('www/'));
});

gulp.task('build', function () {
    runSequence([
        'clean',
        'assets',
        'html'
    ]);
});

gulp.task('default', ['build']);