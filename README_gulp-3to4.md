// Gulp 3 Task
var gulp = require("gulp");
var rename = require('gulp-rename');
var coreScripts = []; // your main scripts
gulp.task('scripts', function () {
    return gulp.src(coreScripts)
        .pipe(concat('global.js'))
        .pipe(gulp.dest('blah/html/js'))
        .pipe(rename('global.min.js'))
        .pipe(gulp.dest('blah/html/js'))
        //.pipe(browserSync.reload({
        //    stream: true
        //}))
});

// Gulp 4 Task
const { src, dest, series, parallel } = require('gulp');
const rename = require('gulp-rename');
const coreScripts = []; // your main scripts
const scriptsTask = function () {
    return src(coreScripts)
        .pipe(concat('global.js'))
        .pipe(dest('blah/html/js'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('blah/html/js'));

};

exports.build = series(buildScripts, xxx, ...); // for tasks that run in series
// or 
exports.build = parallel(buildScripts, xxx, ...); // for tasks that run in parallel