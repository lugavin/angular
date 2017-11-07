/*!
 * ============================== npm & bower ==============================
 *
 * $ npm init   => package.json
 * $ npm install -g bower
 *
 * $ bower init => bower.json
 * $ bower install --save noty
 *
 * 说明：NPM主要运用于NodeJS项目的内部依赖包管理, 安装的模块位于项目根目录下的node_modules文件夹内;
 * 而Bower大部分情况下用于前端开发, 对CSS/JS内容进行依赖管理, 依赖的下载目录(如: assets、vendor、bower_components等)可以自定义;
 * 在实际项目中, 一般将NPM(NodeJS后端)和Bower(前端)组合使用.
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
 * ========================================================================
 */

'use strict';

var gulp = require('gulp'),
    inject = require('gulp-inject'),
    rev = require('gulp-rev'),  // 生成MD5签名, 打包后的文件名后加上MD5签名, 同时生成一个json文件用来保存文件名对应关系.
    revAppend = require('gulp-rev-append'),
    revReplace = require('gulp-rev-replace'),
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
    debug = require('gulp-debug'),
    changed = require('gulp-changed'),
    gulpIf = require('gulp-if'),
    useref = require('gulp-useref'),
    bowerFiles = require('main-bower-files'),
    naturalSort = require('gulp-natural-sort'),
    angularFilesort = require('gulp-angular-filesort'),
    templateCache = require('gulp-angular-templatecache'),
    ngAnnotate = require('gulp-ng-annotate'),
    lazypipe = require('lazypipe'),
    sourcemaps = require('gulp-sourcemaps'),
    wiredep = require('wiredep').stream,
    browserSync = require('browser-sync').create();

var config = {
    root: './',
    app: 'app/',
    tmp: 'tmp/',
    dist: 'www/',
    test: 'test/',
    bower: 'bower_components/',
    revManifest: 'tmp/rev-manifest.json'
};

gulp.task('clean', function () {
    return del([config.dist, config.tmp], {dot: true});
});

gulp.task('scss', [], function () {
    return gulp.src('scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy', ['copy:common']);

gulp.task('copy:common', function () {
    return gulp.src(['favicon.ico', 'manifest.webapp'], {dot: true})
        .pipe(changed(config.dist))
        .pipe(gulp.dest(config.dist));
});

gulp.task('copy:vendor', function () {
    var paths = {
        bowerrc: './.bowerrc',
        bowerJson: './bower.json',
        bowerDirectory: './bower_components'
    };
    return gulp.src(bowerFiles(paths))
        .pipe(changed(config.dist + 'bower_components'))
        .pipe(gulp.dest(config.dist + 'bower_components'));
});

gulp.task('copy:images', function () {
    return gulp.src(bowerFiles({filter: ['**/*.{gif,jpg,png}']}), {base: config.bower})
        .pipe(changed(config.dist + 'bower_components'))
        .pipe(gulp.dest(config.dist + 'bower_components'));
});

gulp.task('inject', function () {
    runSequence(['inject:vendor'], 'inject:app');
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
        .pipe(inject(gulp.src(config.app + '**/*.js')
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
            base: config.tmp,
            merge: true
        }))
        .pipe(gulp.dest(config.tmp))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles', [], function () {
    return gulp.src('assets/css/*.css')
        .pipe(debug())
        .pipe(changed(config.dist + 'assets/css/')) // 只有改动过的文件才会往下执行
        .pipe(autoprefixer('last 2 version')) // 主流浏览器的最新两个版本
        // .pipe(concat('main.css'))       // 将src目录下的css文件和合并到main.css
        .pipe(minCss())                 // 压缩
        // .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(rev())                    // 文件名加md5后缀
        .pipe(gulp.dest(config.dist + 'assets/css/'))  // 输出md5后缀的文件到指定目录
        .pipe(rev.manifest(config.revManifest, {
            base: config.tmp,
            merge: true
        }))
        .pipe(gulp.dest(config.tmp))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', [], function () {
    return gulp.src('assets/js/*.js')
        .pipe(debug())
        .pipe(changed(config.dist + 'assets/js/'))
        // .pipe(concat('main.js'))
        .pipe(uglify())
        // .pipe(rename({suffix: '.min'}))
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'assets/js/'))
        .pipe(rev.manifest(config.revManifest, {
            base: config.tmp,
            merge: true
        }))
        .pipe(gulp.dest(config.tmp))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('template', function () {
    return gulp.src(config.app + '**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateCache({
            module: 'ngApp',
            root: config.app,
            moduleSystem: 'IIFE'
        }))
        .pipe(gulp.dest(config.dist + config.app));
});

gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['scss']);
    gulp.watch('assets/img/**', ['images']);
    gulp.watch('assets/css/*.css', ['styles']);
    gulp.watch('assets/js/*.js', ['scripts']);
    gulp.watch('app/**/*.js', ['inject:app']);
    gulp.watch([config.dist + '*.html', config.dist + 'app/**']).on('change', browserSync.reload);
});

gulp.task('assets:prod', ['images', 'styles', 'scripts', 'template', 'copy:images'], function () {
    var initTask = lazypipe()
        .pipe(sourcemaps.init);
    var jsTask = lazypipe()
        .pipe(ngAnnotate)
        .pipe(uglify);
    var cssTask = lazypipe()
        .pipe(autoprefixer)
        .pipe(cssnano);
    var manifest = gulp.src(config.revManifest);
    return gulp.src([config.root + '**/*.html',
        '!' + config.app + 'app/**/*.html',
        '!' + config.bower + '**/*.html'])
        .pipe(useref({}, initTask))
        .pipe(gulpIf('*.js', jsTask()))
        .pipe(gulpIf('*.css', cssTask()))
        .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulpIf('**/*.!(html)', rev()))
        .pipe(revReplace({manifest: manifest}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist + config.app));
});

gulp.task('build', ['clean'], function (callback) {
    runSequence(['copy', 'inject:vendor'], 'inject:app', 'assets:prod', callback);
});

//========================================================//

// CSS文件合并压缩
gulp.task('css', function () {
    return gulp.src('assets/css/*.css')
        .pipe(autoprefixer('last 2 version')) // 主流浏览器的最新两个版本
        // .pipe(concat('main.css'))       // 将src目录下的css文件和合并到main.css
        .pipe(minCss())                 // 压缩
        // .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(rev())                    // 文件名加md5后缀
        .pipe(gulp.dest(config.dist + 'assets/css/'))  // 输出md5后缀的文件到指定目录
        .pipe(rev.manifest())           // 生成一个rev-manifest.json文件
        .pipe(gulp.dest(config.tmp));   // 将rev-manifest.json文件保存到指定目录
});

// JS文件压缩
gulp.task('js', function () {
    return gulp.src('assets/js/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'assets/js/'))
        .pipe(rev.manifest(config.revManifest, {
            base: config.tmp,
            merge: true
        }))
        .pipe(gulp.dest(config.tmp));
});

// 第三方依赖库
// gulp.task('vendor', function () {
//     return gulp.src('assets/lib/**')
//         .pipe(gulp.dest(config.dist + config.bower));
// });

// IMG文件压缩
gulp.task('img', function () {
    return gulp.src('assets/img/**')
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
        .pipe(gulp.dest(config.dist + 'assets/img/'));
});

gulp.task('app', function () {
    return gulp.src('app/**')
        .pipe(gulp.dest(config.dist + 'app/'))
        .pipe(gulpIf('*.js', rev()))
        .pipe(gulp.dest(config.dist + 'app/'))
        .pipe(rev.manifest(config.revManifest, {
            base: config.tmp,
            merge: true
        }))
        .pipe(gulp.dest(config.tmp));
});
/*
 gulp.task('html', function () {
 return gulp.src('./index.html')
 // .pipe(useref())
 .pipe(gulpIf('*.js', uglify()))
 .pipe(gulpIf('*.css', cssnano()))
 // .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
 .pipe(gulp.dest(config.dist));
 });
 */

gulp.task('rev', function () {
    return gulp.src([config.revManifest, config.dist + '*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['scss']);
    gulp.watch('assets/css/*.css', ['css']);
    gulp.watch('assets/js/*.js', ['js']);
    gulp.watch('assets/img/**', ['img']);
    gulp.watch('app/**', ['app']);
    gulp.watch('www/**').on('change', browserSync.reload);
});

gulp.task('release', function () {
    runSequence(
        'clean',
        ['css', 'js', 'vendor'],
        'img',
        'app',
        'html',
        'rev'
    );
});

gulp.task('default', ['release']);