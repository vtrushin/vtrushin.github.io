'use strict';

let del = require('del');
let gulp = require('gulp');
let jade = require('gulp-jade');
let sass = require('gulp-sass');
let rollup = require('gulp-rollup');
let babel = require('gulp-babel');

const src = './src';
const dist = '.';
const jadePath = src + '/**/*.jade';
const sassPath = src + '/**/*.sass';
const es6Path = [
	src + '/js/convert.js',
	src + '/js/index.js',
	src + '/js/calculate-matrix.js'
];
const distCssPath = dist + '/';
const distJsPath = dist + '/js';

gulp.task('default', [
	'jade',
	'styles',
	'es6',
	'jade:watch',
	'styles:watch',
	'es6:watch'
]);

gulp.task('jade', function(){
	gulp.src(jadePath)
		.pipe(jade({
			pretty: '\t'
		}))
		.pipe(gulp.dest(dist));
});

gulp.task('styles', function () {
	gulp.src(sassPath)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(distCssPath));
});

gulp.task('es6', function(){
	console.log(src + '/js/dist.js');
	gulp.src(es6Path)
		.pipe(rollup())
		.pipe(babel())
		.pipe(gulp.dest(distJsPath))
});

gulp.task('jade:watch', function () {
	gulp.watch(jadePath, ['jade']);
});

gulp.task('styles:watch', function () {
	gulp.watch(sassPath, ['styles']);
});

gulp.task('es6:watch', function () {
	gulp.watch(src + '/js/**/*.js', ['es6']);
});