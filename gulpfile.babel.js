// gulp in v4 for auth0-example gulpfile.babel.js
const gulp = require('gulp'); //v3: import gulp from "gulp";
const cp = require("child_process"); //import cp from "child_process";
const gutil = require("gulp-util"); //import gutil from "gulp-util";

const postcss = require("gulp-postcss"); //import postcss from "gulp-postcss";
const cssImport = require("postcss-import"); //import cssImport from "postcss-import";
const cssnext = require("postcss-cssnext"); //import cssnext from "postcss-cssnext";

const browserSync = require("browser-sync").create();
const webpack = require("webpack");
const webpackStream = require("webpack-stream"); //import webpack from "webpack";
const webpackConfig = require("./webpack.config.js");
//v3:import webpackConfig from "./webpack.conf";
//const webpackStream = require('webpack-stream');
const hugoBin = "hugo";
const defaultArgs = ["-d", "../dist", "-s", "site", "-v"];
const {src, dest, parallel, series, watch} = require('gulp');

// gulp.task("hugo", (cb) => buildSite(cb));
exports.hugo = buildSite;

//gulp.task("hugo-preview", (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));
function hugo_preview(cb) {
    buildSite(cb, ["--buildDrafts", "--buildFuture"]);
    cb();
}
exports.hugo_preview = hugo_preview;

//gulp.task("build", ["css", "js", "hugo"]);
exports.build = series(parallel(genCSS, genJS), buildSite);

//gulp.task("build-preview", ["css", "js", "hugo-preview"]);
exports.build_preview = series(parallel(genCSS, genJS), hugo_preview);

/* gulp V3:
gulp.task("css", () => (
  gulp.src("./src/css/*.css")
    .pipe(postcss([cssnext(), cssImport({from: "./src/css/main.css"})]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));
 */

function genCSS() {
  return src("./src/css/*.css")
    .pipe(postcss([cssnext(), cssImport({from: "./src/css/main.css"})]))
    .pipe(dest("./dist/css"))
    .pipe(browserSync.stream());
}
exports.css = genCSS;

/*
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
}); 
*/
/*
function genJS(cb) {
  //const myConfig = Object.assign({}, webpackConfig);
  const myConfig = webpackConfig;
  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
} */
function genJS() {
  return src("./src/app.js")
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(dest("./dist"))
    .pipe(browserSync.stream());
}
exports.js = genJS;

/* V3
gulp.task("server", ["hugo", "css", "js"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  }); */
//  gulp.watch("./src/js/**/*.js", ["js"]);
//  gulp.watch("./src/css/**/*.css", ["css"]);
//  gulp.watch("./site/**/*", ["hugo"]);
//});
exports.server = function(){
  watch("./src/**/*.js", genJS);
  watch("./src/css/**/*.css", genCSS);
  watch("./site/**/*", buildSite);
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
};

function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
exports.build = buildSite;
