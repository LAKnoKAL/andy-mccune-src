const gulp        = require('gulp');
const sass        = require('gulp-sass');
const rename      = require('gulp-rename');
const cssmin      = require('gulp-cssnano');
const prefix      = require('gulp-autoprefixer');
const plumber     = require('gulp-plumber');
const notify      = require('gulp-notify');
const uglify      = require('gulp-uglify');
const sourcemaps  = require('gulp-sourcemaps');
const inject      = require('gulp-inject');
const concat      = require('gulp-concat');

const series      = require('stream-series');
const runSequence = require('run-sequence');

const paths = {
  src: './src/**/*',
  srcHTML: './*.html',
  srcSASS: './src/**/*.sass',
  srcJS: './src/**/*.js',
  srcXwiperJS: './src/js/xwiper.js',
  srcAppJS: './src/js/main.js',
  srcIMG: './src/img/**/*',
  srcFONTS: './src/fonts/**/*',
  srcPDF: './**/*.pdf',
  nodeLibsJS: [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/jquery-parallax.js/parallax.min.js',
    './node_modules/slick-carousel/slick/slick.min.js',
  ],
  nodeLibsCSS: [
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
  ],
  dist: './dist',
  distHTML: './dist/*.html',
  distCSS: './dist/css',
  distCSSfiles: './dist/css/**/*.css',
  distCSSVendors: './dist/css/vendors.css',
  distCSSApp: './dist/css/style.min.css',
  distJS: './dist/js',
  distJSfiles: './dist/js/**/*.js',
  distJSVendors: './dist/js/vendors.js',
  distJSApp: './dist/js/app.js',
  distIMG: './dist/img',
  distFONTS: './dist/fonts',
};

let onError = function(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};

let sassOptions = {
  outputStyle: 'expanded'
};

let prefixerOptions = {
  browsers: ['last 2 versions', 'IE 10'],
  cascade: false
};

gulp.task('css:vendors', function () {
  return gulp.src(paths.nodeLibsCSS)
    .pipe(concat('vendors.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('js:vendors', function () {
  return gulp.src(paths.nodeLibsJS)
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest(paths.distJS));
});

gulp.task('js:app', function () {
  return gulp.src([
      paths.srcXwiperJS,
      paths.srcAppJS
    ])
    .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.distJS));
});

gulp.task('copy:html', function () {
  return gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:images', function () {
  return gulp.src(paths.srcIMG)
    .pipe(gulp.dest(paths.distIMG));
});

gulp.task('copy:fonts', function () {
  return gulp.src(paths.srcFONTS)
    .pipe(gulp.dest(paths.distFONTS));
});

// gulp.task('copy:pdf', function () {
//   return gulp.src(paths.srcPDF)
//     .pipe(gulp.dest(paths.dist));
// });

gulp.task('inject', function () {
  let distJSVendors = gulp.src(paths.distJSVendors, {read: false});
  let distJSApp = gulp.src(paths.distJSApp, {read: false});
  let distCSSVendors = gulp.src(paths.distCSSVendors, {read: false});
  let distCSSApp = gulp.src(paths.distCSSApp, {read: false});

  return gulp.src(paths.distHTML)
    .pipe(inject(series(distJSVendors, distJSApp), {relative: true}))
    .pipe(inject(series(distCSSVendors, distCSSApp), {relative: true}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', function() {
  return gulp.src(paths.srcSASS)
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('src/css'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('watch', function() {
  gulp.watch('src/sass/**/*.sass', ['styles']);
});

// BUILD TASKS
// ------------
gulp.task('default', function(done) {
  runSequence('styles', 'watch', 'js:vendors', 'js:app', 'css:vendors', 'copy:html', 'copy:images', 'copy:fonts', 'inject', done);
});

gulp.task('build', function(done) {
  runSequence('styles', done);
});
