var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var vulcanize = require('gulp-vulcanize');
var pkg = require('./package.json');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('less/clean-blog.less')
        .pipe(less())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
});

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

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('css/clean-blog.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/clean-blog.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
});

// Vulcanize Web Components
gulp.task('vulcanize', function () {
    gulp.src('src/components.html')
      .pipe(vulcanize({
          stripComments: true,
          inlineScripts: true,
          inlineCss: true
      }))
      .pipe(rename('critical.html'))
      .pipe(gulp.dest('dist'));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('dist/vendor/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('dist/vendor/jquery'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('dist/vendor/font-awesome'))

    gulp.src(['img/**'])
        .pipe(gulp.dest('dist/img'))

    gulp.src(['bower_components/webcomponentsjs/webcomponents-lite.min.js'])
        .pipe(gulp.dest('dist/js'))
})

// Run everything
gulp.task('default', ['less', 'minify-html', 'minify-css', 'minify-js', 'vulcanize', 'copy']);
