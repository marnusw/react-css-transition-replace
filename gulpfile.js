var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp.src(['src/**', 'demo/app.js', 'demo/components/*.jsx'])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});


// Demo related tasks

var notify = require('gulp-notify');
var flatten = require('gulp-flatten');
var stream = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var assign = require('lodash.assign');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var BABELIFY_OPTIONS = {
  ignore: /node_modules/,
  presets: [
    'es2015',
    'stage-0', // Stage 0 used to enable `es7.objectRestSpread`
    'react'
  ]
};

function bundleJs(bundler) {
  return bundler.bundle()
    .on('error', notify.onError({title: 'Browserify'}))
    .pipe(stream('demo/app.js'))
    .pipe(buffer())
    .pipe(flatten())
    .pipe(gulp.dest('demo/assets'))
}

gulp.task('demo:bundle', function() {
  return bundleJs(browserify('./demo/app.js', {debug: true}) // Append a source map
    .transform(babelify, BABELIFY_OPTIONS));
});

gulp.task('demo:bundleAndWatch', function() {
  var bundler = watchify(browserify('./demo/app.js', assign({debug: true}, watchify.args)))
    .transform(babelify, BABELIFY_OPTIONS);

  bundler.on('update', bundleJs.bind(null, bundler));

  return bundleJs(bundler);
});

gulp.task('demo', ['demo:bundleAndWatch'], function() {
  browserSync.init({
    browser: ['google chrome'],
    notify: false,
    server: {
      baseDir: "demo/assets"
    }
  });

  // Watch JavaScript and lint changes
  gulp.watch(['src/**', 'demo/app.js', 'demo/components/*.jsx'], ['lint']);

  // Reload when the app CSS or bundled JS changes
  gulp.watch('demo/assets/*.css').on('change', reload);
  gulp.watch('demo/assets/app.js').on('change', reload);
});

// gh-pages related tasks

gulp.task('gh-pages', ['demo:bundle'], function() {
  require('del').sync(['gh-pages/**/*.*', '!gh-pages', '!gh-pages/.git']);
  return gulp.src('demo/assets/**/*.*')
    .pipe(gulp.dest('gh-pages'));
});
