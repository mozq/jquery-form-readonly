var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');

var getPackageJson = function() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

gulp.task('bump', function() {
  var pkg = getPackageJson();
  var newVersion = $.util.env.version || pkg.version;

  return gulp.src(['./package.json'])
    .pipe($.bump({
      version: newVersion
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('js', function() {
  var pkg = getPackageJson();
  var header = [
    '/*!',
    ' * jquery-form-readonly v<%= pkg.version %>',
    ' * https://mozq.github.io/jquery-form-readonly/',
    ' * ',
    ' * Copyright (c) 2018 Mozq',
    ' * ',
    ' * Released under the MIT License:',
    ' * https://raw.githubusercontent.com/mozq/jquery-form-readonly/master/LICENSE',
    ' */',
    '',
  ].join('\n');

  return gulp.src('./src/*.js')
    .pipe($.plumber())
    .pipe($.header(header, { pkg: pkg }))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./public'))
    .pipe($.connect.reload());
});

gulp.task('js-min', function() {
  var pkg = getPackageJson();

  return gulp.src('./src/*.js')
    .pipe(sourcemaps.init())
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe($.header('/*! jquery-form-readonly v<%= pkg.version %> - git.io/vALey - Copyright (c) 2018 Mozq - MIT License */\n', {pkg: pkg}))
    .pipe($.rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./public'))
    .pipe($.connect.reload());
});

gulp.task('lint', function() {
  return gulp.src(['./dist/jquery.form-readonly.js', '!node_modules/**'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('serve', function() {
  $.connect.server({
    root: './public',
    livereload: true
  });
});

gulp.task('html', function() {
  return gulp.src('./public/*.html')
    .pipe($.connect.reload());
});

gulp.task('css', function() {
  return gulp.src('./public/*.css')
    .pipe($.connect.reload());
});

gulp.task('watch', ['serve'], function() {
  gulp.watch(['*.css'], {cwd: './public/'}, ['css']);
  gulp.watch(['*.html'], {cwd: './public/'}, ['html']);
  gulp.watch(['*.js'], {cwd: './src/'}, ['js', 'js-min']);
});

gulp.task('zip', function() {
  var pkg = getPackageJson();

  return gulp.src(['./README.md', './LICENSE.txt', './dist/*'])
    .pipe($.zip('jquery-form-readonly_v' + pkg.version + '.zip'))
    .pipe(gulp.dest('./archive'));
});

gulp.task('build',   ['js', 'js-min', 'lint']);
gulp.task('default', ['build', 'watch']);
gulp.task('release', ['bump', 'build', 'zip']);
