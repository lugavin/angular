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

// var $ = require('gulp-load-lib')();

var gulp = require('gulp'),
    inject = require('gulp-inject'),
    rev = require('gulp-rev'),  // 生成MD5签名, 打包后的文件名后加上MD5签名, 同时生成一个json文件用来保存文件名对应关系.
    revAppend = require('gulp-rev-append'),   // 生成MD5签名, 打包后的文件名后加上MD5签名, 同时生成一个json文件用来保存文件名对应关系.
    revCollector = require('gulp-rev-collector'),   // 路径替换
    runSequence = require('run-sequence'),          // 按顺序同步执行Gulp任务
    concat = require('gulp-concat'),                // 文件合并
    uglify = require("gulp-uglify"),                // JS压缩
    minCss = require('gulp-clean-css'),             // CSS压缩
    cssnano = require('gulp-cssnano'),              // CSS压缩
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminOptipng = require('imagemin-optipng'),
    rename = require('gulp-rename'),
    del = require('del'),
    changed = require('gulp-changed'),
    gulpIf = require('gulp-if'),
    wiredep = require('wiredep').stream,
    browserSync = require('browser-sync').create();

var config = {
    app: 'www/',
    tmp: 'tmp/',
    dist: 'dist/',
    test: 'test/',
    plugins: 'assets/plugins',
    bower: 'bower_components/',
    revManifest: 'tmp/rev-manifest.json'
};

gulp.task('clean', function () {
    return del([config.dist, config.tmp], {dot: true});
});

gulp.task('css', function () {
    return gulp.src('assets/css/*.css')
        .pipe(autoprefixer({
            // 主流浏览器的最新两个版本
            browsers: ['last 2 version', 'Android >= 4.0']
        }))
        .pipe(concat('app.css'))        // 将src目录下的css文件和合并到app.css
        .pipe(minCss())                 // 压缩
        .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(rev())                    // 文件名加md5后缀
        .pipe(gulp.dest(config.dist + 'css/'))  // 输出md5后缀的文件到指定目录
        .pipe(rev.manifest())           // 生成一个rev-manifest.json文件
        .pipe(gulp.dest(config.tmp));   // 将rev-manifest.json文件保存到指定目录
});

gulp.task('js', function () {
    return gulp.src('assets/js/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'js/'))
        .pipe(rev.manifest(config.tmp + '/rev-manifest.json', {
            base: config.tmp,
            merge: true
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('img', function () {
    gulp.src('assets/img/*.*')
        .pipe(imagemin({
            use: [imageminJpegRecompress({
                accurate: true,         // 高精度模式
                quality: 'high',        // 图片质量(low,medium,high,veryhigh)
                method: 'smallfry',     // 网格优化(mpe,ssim,ms-ssim,smallfry)
                min: 70,                // 最低质量
                loops: 0,               // 循环尝试次数
                progressive: false,     // 基线优化
                subsample: 'default'    // 子采样(default,disable)
            }), imageminOptipng({
                optimizationLevel: 4
            })]
        }))
        .pipe(gulp.dest(config.dist + 'img/'));
});

gulp.task('app', function () {
    gulp.src('app/**')
        .pipe(gulp.dest(config.dist + 'app/'));
});

gulp.task('bower', function () {
    gulp.src('./index.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest(config.dist));
});

// SCSS文件预编译
// gulp.task('scss', function () {
//     gulp.src('src/scss/*.scss')
//         .pipe(sass({
//             outputStyle: 'compressed'
//         }))
//         .pipe(gulp.dest('dist/css'));
// });

// CSS文件压缩
// gulp.task('css', function () {
//     gulp.src('css/*.css')
//         .pipe(minifyCss())
//         .pipe(rename({suffix: '.min'}))
//         .pipe(gulp.dest('dist/css'));
// });

// JS文件压缩
// gulp.task('js', function () {
//     gulp.src('js/*.js')
//         .pipe(uglify())
//         .pipe(rename({suffix: '.min'}))
//         .pipe(gulp.dest('dist/js'));
// });

// HTML文件压缩
// gulp.task('html', function () {
//     gulp.src('html/*.html')
//         .pipe(minifyHtml())
//         .pipe(gulp.dest('dist/html'));
// });

// 文件合并
// gulp.task('concat', function () {
//     gulp.src('js/*.js')
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('dist/js'));
// });

// 文件重命名
// gulp.task('rename', function () {
//     gulp.src('js/jquery.js')
//         .pipe(uglify())
//         .pipe(rename('jquery.min.js'))
//         .pipe(gulp.dest('js'));
// });

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

gulp.task('html', function () {
    return gulp.src(['www/tmp/rev-manifest.json', 'www/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('www/'));
});

gulp.task('release', function (callback) {
    runSequence('clean', [
        'assets',
        'inject',
        'html'
    ], callback);
});

gulp.task('default', ['release']);