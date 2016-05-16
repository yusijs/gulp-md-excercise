var gulp = require('gulp')
, concat = require('gulp-concat')
, sourcemaps = require('gulp-sourcemaps')
, uglify = require('gulp-uglify')
, ignore = require("gulp-ignore")
, runSequence = require('run-sequence')
, htmlreplace = require("gulp-html-replace")
, ngAnnotate = require('gulp-ng-annotate')
, cleanCSS = require('gulp-clean-css')
, htmlmin = require('gulp-htmlmin')
, sass = require('gulp-sass')
, del = require("del")
, inject = require("gulp-inject")
, server = require('gulp-server-livereload');

var vendorJs = [
    "node_modules/angular/angular.min.js", 
    "node_modules/angular-animate/angular-animate.min.js",
    "node_modules/angular-aria/angular-aria.min.js",
    "node_modules/angular-messages/angular-messages.min.js",
    "node_modules/angular-material//angular-material.min.js",
    "node_modules/angular-ui-router/release/angular-ui-router.min.js"
  ];



gulp.task('js', function () {
  return gulp.src(['app/*.js', 'app/**/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
})

gulp.task("sass", function() {
  return gulp.src(['assets/**/*.scss', "node_modules/angular-material/angular-material.scss"])
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist'));
})

gulp.task("html", function() {
  return gulp.src('app/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/app'))
})

gulp.task("inject", function() {
  var target = gulp.src("./index.html")
  var sources = gulp.src([
    "dist/vendor.js", 
    "dist/app.js",
    "dist/main.css"
  ], {read: false})
  
  return target.pipe(inject(sources, {
                ignorePath: 'dist',
                addRootSlash: false
            }))
            .pipe(htmlreplace({'dist': ''}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("./dist"))
})

gulp.task('clean', function(cb) {
  return del(['dist'], cb)
})

gulp.task("vendor",function() {
  return gulp.src(vendorJs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist'));
})

gulp.task('watch', ['js','sass','html'], function () {
  gulp.watch(['app/**/*.js'], ['js'])
  gulp.watch(['app/**/*.html'], ['html'])
  gulp.watch(['assets/**/*.scss'], ['sass'])
})

gulp.task('build', function(cb) {
  runSequence(
    'clean',
    ['js','sass','html','vendor'],
    'inject',
    cb
  )
})

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }))
})

gulp.task("serve", ['build'], function() {
  runSequence(['watch', 'webserver']);
})