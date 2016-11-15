var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var vulcanize = require('gulp-vulcanize');

// Minify HTML
gulp.task('minify-html', function() {
  return gulp.src('./index.html')
    .pipe(replace('src/components.html', 'critical.html'))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(gulp.dest('dist'));
});

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('less/clean-blog.less')
      .pipe(less())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('css'));
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('css/clean-blog.css')
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('css'));
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/clean-blog.js')
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('js'));
});

// Vulcanize Web Components
gulp.task('vulcanize', function () {
    gulp.src('src/components.html')
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
      .pipe(replace('../bower_components/font-awesome/fonts/', 'fonts/'))
      .pipe(rename('critical.html'))
      .pipe(gulp.dest('dist'));
});

// Copy files
gulp.task('copy', function() {
    gulp.src(['posts/**'])
      .pipe(gulp.dest('dist/posts'))
    gulp.src(['img/**'])
      .pipe(gulp.dest('dist/img'))
    gulp.src(['bower_components/font-awesome/fonts/**'])
      .pipe(gulp.dest('dist/fonts'))
    gulp.src(['bower_components/webcomponentsjs/webcomponents-lite.min.js'])
      .pipe(gulp.dest('dist/js'));
})

// Run everything
gulp.task('default', ['less', 'minify-css', 'minify-html', 'minify-js', 'vulcanize', 'copy']);
