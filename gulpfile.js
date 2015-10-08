var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    notify = require("gulp-notify"),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    cache = require('gulp-cache'),
    spriter = require('gulp-css-spriter'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    livereload = require('gulp-livereload'),
    autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });

var path = {
    src:"./src",
    dist:"./dist"
};

// minify for html files
gulp.task('minify', function() {
    return gulp.src(path.src +'/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.dist))
        .pipe(notify("minify html computed!"))
});

//process for img
gulp.task('images', function() {
    return gulp.src(path.src+'/img/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
        .pipe(gulp.dest(path.dist+'/img'))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('scripts', function() {
    return gulp.src(path.src+'/js/**/*.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist+'/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

//minify for less files
gulp.task('less',function(){
    var timestamp = +new Date();
    return gulp.src(path.src+'/less/**/*.less')
        .pipe(less({
            plugins: [autoprefix, cleancss]
        }))
        .pipe(spriter({
            // 生成的spriter的位置
            spriteSheet: path.dist+'/img/sprite'+timestamp+'.png',
            // will be ：backgound:url(../images/sprite20324232.png)
            pathToSpriteSheetFromCSS: '../img/sprite'+timestamp+'.png'
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(path.dist+'/css'))
        .pipe(notify("less computed!"))
});

gulp.task('default', ['clean'],function() {
    // default code
    gulp.start('less','scripts','images','minify');
});

gulp.task('clean', function() {
    return gulp.src([path.dist], {read: false})
        .pipe(clean());
});
//server
gulp.task('connectDev',function() {
    connect.server({
        root: path.dist,
        livereload: true
    });
});
//reload server
gulp.task('reload',function() {
    gulp.src(path.dist+'/**/*.*')
        .pipe(connect.reload())
});
// Watch
gulp.task('watch', function() {

    // watch less
    gulp.watch(path.src+'/less/**/*.less', ['less']);

    // watch js
    gulp.watch(path.src+'/scripts/**/*.js', ['scripts']);

    // watch img
    gulp.watch(path.src+'/img/**/*', ['images']);

    //watch html
    gulp.watch(path.src+'/**/*.html', ['minify']);

    //listen pro file
    gulp.watch(path.dist+'/**/*.*',['reload'])
});
gulp.task('main', ['connectDev','watch']);