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
var watch = require('gulp-watch');
var merge = require('merge-stream');

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
gulp.task('minify-css', gulp.series('less', function() {
    return gulp.src('css/clean-blog.css')
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('css'));
}));

// Vulcanize Web Components
gulp.task('vulcanize', gulp.series('minify-css', function () {
    var critical = gulp.src('app/src/critical.html')
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

    var deferred = gulp.src('app/src/deferred.html')
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
    
    return merge(critical, deferred);
}));

// Service Worker
gulp.task('generate-service-worker', function(callback) {
  var rootDir = 'dist';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,jpg,png,svg,ico,otf,eot,ttf,woff,woff2,md,json}'],
    stripPrefix: rootDir
  }, callback);
});

// Copy files
gulp.task('copy', function() {
    var manifest = gulp.src(['app/manifest/**'])
      .pipe(gulp.dest('dist/manifest'))
    var posts = gulp.src(['app/posts/**'])
      .pipe(gulp.dest('dist/posts'))
    var img = gulp.src(['app/img/**'])
      .pipe(gulp.dest('dist/img'))
    var fonts = gulp.src(['bower_components/font-awesome/fonts/**'])
      .pipe(gulp.dest('dist/fonts'))
    var webcomponentsjs = gulp.src(['bower_components/webcomponentsjs/webcomponents-lite.min.js'])
      .pipe(gulp.dest('dist/js'));
    return merge(manifest, posts, img, fonts, webcomponentsjs);
})

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch('app/index.html', ['minify-html', 'generate-service-worker'])
  gulp.watch(['app/less/**', 'app/src/**'], ['vulcanize', 'generate-service-worker'])
  gulp.watch(['app/img/**', 'app/manifest/**', 'app/posts/**'], ['copy', 'generate-service-worker'])
});

// Run everything
gulp.task('default', gulp.series('less', 'minify-css', 'minify-html', 'vulcanize', 'copy', 'generate-service-worker'));
