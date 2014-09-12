var gulp = require('gulp'),
	watch = require('gulp-watch'),
	lr = require('gulp-livereload'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	plumber = require('gulp-plumber');

gulp.task('js',function() {
    gulp.src('./jquery-paginator.js')
    	.pipe(plumber())
  		.pipe(jshint())
  		.pipe(jshint.reporter('jshint-stylish'))
  		.pipe(jshint.reporter('fail'))
  		.pipe(uglify())
  		.pipe(rename({extname: '.min.js'}))
  		.pipe(gulp.dest('./'));
});

gulp.task('watch', ['js'], function () {
	gulp.watch('./jquery-paginator.js', ['js']);
});

gulp.task('default',['js']);