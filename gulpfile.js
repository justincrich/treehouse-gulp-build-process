var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    useref = require('gulp-useref'),
    iff = require('gulp-if'),
    csso = require('gulp-csso'),
    del = require('del')
    uglifycss = require('gulp-uglifycss'),
    fs = require('fs'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin')
    htmlreplace = require('gulp-html-replace')
    var webserver = require('gulp-webserver')
    replace = require('gulp-replace');

var options = {
  src: 'src',
  dist: 'dist'
};

//check if dist exists and if not create it
// exists('./'+options.dist);

gulp.task('styles', ()=>{
  return gulp.src(options.src + "/sass/global.scss")
    .pipe(maps.init())
    .pipe(sass())
    .pipe(csso())
    .pipe(rename('all.min.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.dist+'/styles'))
});

gulp.task('scripts', ()=>{
  return gulp.src(options.src+'/**/*.js')
    .pipe(maps.init())
    .pipe(iff('*.js',concat('all.min.js')))
    .pipe(iff('*.js',uglify()))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.dist+"/scripts"))
});

gulp.task('images',()=>{
  return gulp.src(options.src+'/images/*.+(jpg|jpeg|gif|png)')
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist+"/content"))
});

gulp.task('html',()=>{
  return gulp.src(options.src+'/index.html')
             .pipe(htmlreplace({
               'js':'./scripts/all.min.js',
               'css':'./styles/all.min.css'
             }))
             .pipe(replace('images','content'))
             .pipe(gulp.dest(options.dist))
})

gulp.task('clean',()=>{
  return del(options.dist+'/*');
});


gulp.task('build',['clean','scripts','styles','images','html'],()=>{
  return gulp.src(options.src+'/icons/**')
         .pipe(gulp.dest(options.dist+'/icons'))
});

gulp.task("default",['build'], ()=> {
  gulp.src('./dist')
  .pipe(webserver({
      open:true,
      livereload:{
        enable:true,
      }
    })
  )
});
