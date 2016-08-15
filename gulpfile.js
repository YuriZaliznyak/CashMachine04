var gulp = require('gulp'),
    cleancss = require('gulp-clean-css'),
    rev = require('gulp-rev'),
    jshint = require('gulp-jshint'),
    ngannotate = require('gulp-ng-annotate'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    browserSync = require('browser-sync'),
    del = require('del'),
    less = require('gulp-less');

// Clean
gulp.task('clean', function () {
    return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('jshint', 'less', 'minifyuglify', 'copyfonts', 'images');
});

// JSHint
gulp.task('jshint', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Less task, compile *.less to css
gulp.task('less', function () {
    return gulp.src('./app/**/*/*.less')
        .pipe(less())
        .pipe(gulp.dest('./app'));
});

// Minification-uglification
gulp.task('minifyuglify', function () {
    return gulp.src('./app/**/*.html')
        .pipe(usemin({
            css: [cleancss({compatibility: 'ie8'}), rev()],
            js: [ngannotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
});

// Fonts
gulp.task('copyfonts', function () {
    gulp.src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
});

// Images
gulp.task('images', function () {
    return gulp.src('./app/images/**/*.{jpg,gif,png}*')
        .pipe(gulp.dest('./dist/images'));
});

// Watch .js, .css, .html and .less files
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html,app/**/*/*.less}', ['minifyuglify']);
});

// Serve app in browser
gulp.task('browser-sync', ['default'], function () {
    var files = [
        'app/**/*.html',
        'app/styles/**/*.less',
        'app/styles/**/*.css',
        'app/scripts/**/*.js',
        'dist/**/*'
    ];
    browserSync.init(files, {
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);
});
