var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var htmlmin = require('gulp-htmlmin');
var minifyInline = require('gulp-minify-inline');
var vulcanize = require('gulp-vulcanize');
var path = require('path');
var swPrecache = require('sw-precache');

// Minify HTML
gulp.task('minify-html', function() {
  return gulp.src('app/index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(replace('src/critical.html', 'critical.html'))
    .pipe(replace('src/deferred.html', 'deferred.html'))
    .pipe(gulp.dest('dist'));
});

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('app/less/clean-blog.less')
      .pipe(less())
      .pipe(gulp.dest('css'));
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('app/css/clean-blog.css')
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('css'));
});

// Vulcanize Web Components
gulp.task('vulcanize', ['minify-css'], function () {
    gulp.src('app/src/critical.html')
      .pipe(vulcanize({
        stripComments: true,
        inlineScripts: true,
        inlineCss: true
      }))
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      }))
      .pipe(minifyInline())
      .pipe(gulp.dest('dist'));

    gulp.src('app/src/deferred.html')
      .pipe(vulcanize({
        stripComments: true,
        inlineScripts: true,
        inlineCss: true
      }))
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      }))
      .pipe(minifyInline())
      .pipe(replace('../../bower_components/font-awesome/fonts/', 'fonts/'))
      .pipe(gulp.dest('dist'));
});

gulp.task('generate-service-worker', function(callback) {
  var rootDir = 'dist';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,jpg,svg,otf,eot,ttf,woff,woff2,md}'],
    stripPrefix: rootDir
  }, callback);
});

// Copy files
gulp.task('copy', function() {
    gulp.src(['app/posts/**'])
      .pipe(gulp.dest('dist/posts'))
    gulp.src(['app/img/**'])
      .pipe(gulp.dest('dist/img'))
    gulp.src(['bower_components/font-awesome/fonts/**'])
      .pipe(gulp.dest('dist/fonts'))
    gulp.src(['bower_components/webcomponentsjs/webcomponents-lite.min.js'])
      .pipe(gulp.dest('dist/js'));
})

// Run everything
gulp.task('default', ['less', 'minify-css', 'minify-html', 'vulcanize', 'copy', 'generate-service-worker']);
