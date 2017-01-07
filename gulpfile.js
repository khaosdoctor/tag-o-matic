const gulp = require('gulp');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const useref = require('gulp-useref');
const prefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean-css');
const sourcemap = require('gulp-sourcemaps');
const annotate = require('gulp-ng-annotate');
const bs = require('browser-sync');

const globs = {
  dist: {
    css: "./dist/css",
    js: "./dist/js",
    img: "./dist",
    html: "./dist",
    lib: "./dist/lib"
  },
  src: {
    sass: "./src/sass/*.{scss,sass}",
    js: "./src/js/**/*.js",
    img: "./src/**/*.{png,jpg,jpeg,gif}",
    lib: "./src/lib/**/*",
    html: "./src/**/*.html"
  }
}

gulp.task('transpile', () => {
  console.log(gutil.colors.green.bold("Initializing transpiler"));
  return gulp.src(globs.src.js)
    .pipe(plumber())  
    .pipe(annotate())
    .pipe(babel({ presets: ["es2015"] }))
    .pipe(sourcemap.init())
    .pipe(uglify({mangle: true, compress:true}))
    .pipe(sourcemap.write())
    .pipe(gulp.dest(globs.dist.js));
});


gulp.task('sass', () => {
  console.log(gutil.colors.green.bold("Initializing Sass compiler"));
  return gulp.src(globs.src.sass)
    .pipe(plumber())
    .pipe(sass({ style: "compressed" }).on('error', sass.logError))
    .pipe(prefixer({ browsers: 'last 5 version' }))
    .pipe(sourcemap.init())
    .pipe(clean())
    .pipe(sourcemap.write())
    .pipe(gulp.dest(globs.dist.css))
    .pipe(bs.stream());
});

gulp.task('htmlmin', ['transpile', 'sass'], () => {
  console.log(gutil.colors.green.bold("Initializing HTML minifier"));
  return gulp.src(globs.src.html)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(useref())
    .pipe(htmlmin({
      collapseBooleanAttributes: true,
      decodeEntities: true,
      quoteCharacter: '"',
      removeComments: true,
      removeRedundantAttributes: true,
      useShortDoctype: true
    }))
    .pipe(sourcemap.write())
    .pipe(gulp.dest(globs.dist.html));
});

gulp.task('imagemin', () => {
  console.log(gutil.colors.green.bold("Initializing image optimization"));
  return gulp.src(globs.src.img)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(globs.dist.img))
});

gulp.task('libs', () => {
  return gulp.src(globs.src.lib)
    .pipe(plumber())
    .pipe(gulp.dest(globs.dist.lib))
    .pipe(bs.stream());
});

gulp.task('watch', () => {
  console.log(gutil.colors.cyan.bold(">> My watch has started"));
  gulp.watch(globs.src.js, ['transpile']);
  gulp.watch("./src/sass/**/*.{scss,sass}", ['sass']);
  gulp.watch(globs.src.html, ['htmlmin']);
  gulp.watch(globs.src.img, ['imagemin']);
  gulp.watch(globs.src.lib, ['libs']);
});

gulp.task('default', ['libs','imagemin','htmlmin']);