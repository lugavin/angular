/*!
 * ============================== npm & bower ==============================
 *
 * 1. Use npm to manage NodeJS modules
 * 2. Use bower to manage front-end assets
 * 3. We need to insert dependencies downloaded by bower into HTML layout
 *
 * I.E. $ npm init   => package.json
 *      $ npm install -g bower
 *      $ bower init => bower.json
 *      $ bower install --save noty
 *
 * NPM + Gulp + Bower VS NPM + Webpack + YARN
 *
 * ============================== npm & yarn ==============================
 *
 * npm                                         yarn
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
 * https://excodus.com/en/blog/post/managing-development-and-production-assets-gulp
 */

'use strict';

var fs = require('fs'),
    es = require('event-stream'),
    gulp = require('gulp'),
    inject = require('gulp-inject'),
    rev = require('gulp-rev'),  // 生成MD5签名, 打包后的文件名后加上MD5签名, 同时生成一个json文件用来保存文件名对应关系.
    revReplace = require('gulp-rev-replace'),
    runSequence = require('run-sequence'),  // 按顺序同步执行Gulp任务
    concat = require('gulp-concat'),        // 文件合并
    uglify = require("gulp-uglify"),        // JS压缩
    minCss = require('gulp-clean-css'),     // CSS压缩
    cssnano = require('gulp-cssnano'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    del = require('del'),
    debug = require('gulp-debug'),
    changed = require('gulp-changed'),
    gulpIf = require('gulp-if'),
    useref = require('gulp-useref'),
    bowerFiles = require('main-bower-files'),
    naturalSort = require('gulp-natural-sort'),
    angularFilesort = require('gulp-angular-filesort'),
    templateCache = require('gulp-angular-templatecache'),
    ngAnnotate = require('gulp-ng-annotate'),
    footer = require('gulp-footer'),
    flatten = require('gulp-flatten'),
    lazypipe = require('lazypipe'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();

var config = {
    root: './',
    tmp: 'tmp/',
    dist: 'www/',
    bower: 'bower_components/',
    revManifest: 'tmp/rev-manifest.json'
};

gulp.task('clean', function () {
    return del([config.dist], {dot: true});
});

gulp.task('scss', [], function () {
    return gulp.src('scss/*.scss')
        .pipe(debug())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer('last 2 version'))
        .pipe(minCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('copy', ['copy:i18n', 'copy:fonts', 'copy:common', 'copy:data']);

gulp.task('copy:i18n', function () {
    return gulp.src(config.root + 'i18n/**')
        .pipe(changed(config.dist + 'i18n/'))
        .pipe(gulp.dest(config.dist + 'i18n/'));
});

gulp.task('copy:fonts', function () {
    return es.merge(gulp.src(config.bower + 'bootstrap/fonts/*.*')
            .pipe(changed(config.dist + 'assets/fonts/'))
            .pipe(rev())
            .pipe(gulp.dest(config.dist + 'assets/fonts/'))
            .pipe(rev.manifest(config.revManifest, {
                base: config.dist,
                merge: true
            }))
            .pipe(gulp.dest(config.dist)),
        gulp.src(config.root + 'assets/**/*.{woff,woff2,svg,ttf,eot,otf}')
            .pipe(changed(config.dist + 'assets/fonts/'))
            .pipe(flatten())
            .pipe(rev())
            .pipe(gulp.dest(config.dist + 'assets/fonts/'))
            .pipe(rev.manifest(config.revManifest, {
                base: config.dist,
                merge: true
            }))
            .pipe(gulp.dest(config.dist))
    );
});

gulp.task('copy:common', function () {
    return gulp.src(['favicon.ico', 'manifest.webapp'], {dot: true})
        .pipe(changed(config.dist))
        .pipe(gulp.dest(config.dist));
});

gulp.task('copy:data', function () {
    return gulp.src(config.root + 'data/**')
        .pipe(changed(config.dist + 'data/'))
        .pipe(gulp.dest(config.dist + 'data/'));
});

gulp.task('copy:images', function () {
    return gulp.src(bowerFiles({filter: ['**/*.{gif,jpg,png}']}), {base: config.bower})
        .pipe(changed(config.dist + 'bower_components'))
        .pipe(gulp.dest(config.dist + 'bower_components'));
});

gulp.task('inject', function () {
    runSequence('inject:vendor', 'inject:app');
});

gulp.task('inject:vendor', function () {
    return gulp.src(config.root + 'index.html')
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {
            name: 'bower',
            relative: true
        }))
        .pipe(gulp.dest(config.root));
});

gulp.task('inject:app', function () {
    return gulp.src(config.root + 'index.html')
        .pipe(inject(gulp.src(config.root + 'app/**/*.js')
            .pipe(naturalSort())
            .pipe(angularFilesort()), {relative: true}))
        .pipe(gulp.dest(config.root));
});

gulp.task('images', function () {
    return gulp.src('assets/img/*.{gif,jpg,png}')
        .pipe(debug())
        .pipe(changed(config.dist + 'assets/img/'))
        .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'assets/img/'))
        .pipe(rev.manifest(config.revManifest, {
            base: config.dist,
            merge: true
        }))
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles', [], function () {
    return gulp.src('assets/css/*.css')
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', [], function () {
    return gulp.src('assets/js/*.js')
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('vendor', [], function () {
    return gulp.src(config.root + 'assets/lib/**')
        .pipe(debug())
        .pipe(changed(config.dist + 'assets/lib/'))
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'assets/lib/'))
        .pipe(rev.manifest(config.revManifest, {
            base: config.dist,
            merge: true
        }))
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function () {
    return gulp.src(config.root + 'app/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateCache({
            module: 'app',
            root: 'app/',
            moduleSystem: 'IIFE'
        }))
        .pipe(gulp.dest(config.tmp));
});

gulp.task('assets:prod', ['images', 'styles', 'html', 'copy:images'], function () {
    var templates = fs.readFileSync(config.tmp + '/templates.js');
    var initTask = lazypipe()
        .pipe(sourcemaps.init);
    var jsTask = lazypipe()
        .pipe(ngAnnotate)
        .pipe(uglify);
    var cssTask = lazypipe()
        .pipe(autoprefixer)
        .pipe(cssnano);
    var manifest = gulp.src(config.revManifest);
    return gulp.src([config.root + '*.html',
        '!' + config.root + 'app/**/*.html',
        '!' + config.bower + '**/*.html'])
        .pipe(useref({}, initTask))
        .pipe(gulpIf('**/app.js', footer(templates)))
        .pipe(gulpIf('*.js', jsTask()))
        .pipe(gulpIf('*.css', cssTask()))
        .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulpIf('**/*.!(html)', rev()))
        .pipe(revReplace({manifest: manifest}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist));
});

gulp.task('watch', function () {
    gulp.watch(config.root + 'assets/img/**', ['images']);
    gulp.watch(config.root + 'assets/css/*.css', ['styles']);
    gulp.watch(config.root + 'assets/js/*.js', ['scripts']);
    gulp.watch(config.root + 'app/**/*.js', ['inject:app']);
    gulp.watch([config.root + '*.html', config.root + 'app/**', config.root + 'i18n/**']).on('change', browserSync.reload);
});

gulp.task('build', ['clean'], function (callback) {
    runSequence(['copy', 'inject:vendor'], 'inject:app', 'assets:prod', callback);
});

gulp.task('default', ['build']);