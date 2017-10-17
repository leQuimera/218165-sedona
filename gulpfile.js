"use strict";

var gulp = require("gulp"); // Подключение gulp
var sass = require("gulp-sass"); // Подключение сборки sass
var plumber = require("gulp-plumber"); // Сообщение об ошибке
var postcss = require("gulp-postcss"); //
var autoprefixer = require("autoprefixer"); // Автопрефиксер
var run = require("run-sequence"); //
var rename = require("gulp-rename"); // Переименование файлов
var del = require("del"); // Удаление файлов
var minify = require("gulp-csso"); // Минификатор
var posthtml = require("gulp-posthtml"); //
var include = require("posthtml-include"); //
var concat = require('gulp-concat'); // Для конкатенации файлов
var uglify = require('gulp-uglifyjs'); // Для сжатия JS
var imagemin = require("gulp-imagemin"); //
var svgstore = require("gulp-svgstore"); //
var webp = require("gulp-webp"); //
var server = require("browser-sync").create(); // Создание локального сервера

// Очистка папки
gulp.task("clean", function () {
  return del("build");
});

// Собираем файл стилей, расставляем автопрефиксы и минимизируем его
gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// Сборка и минимизация библиотек js
gulp.task("scripts", function() {
  return gulp.src("js/*.js")
    .pipe(plumber())
    .pipe(concat("scripts.min.js"))
    //.pipe(uglify())
    .pipe(gulp.dest("build/js"));
});

// SVG-спрайт
gulp.task("sprite", function() {
  return gulp.src("img/sprite/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

// Оптимизация картинок
gulp.task("images", function() {
  return gulp.src("img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progessive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("img"));
});

gulp.task("webp", function() {
  return gulp.src("img/webp/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("img/webp"));
});

gulp.task("html", function() {
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

gulp.task("build", function(done) {
  run("clean", "copy", "style", "scripts", "sprite", "html", done);
});

gulp.task("copy", function() {
  return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "js/**"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"));
});

gulp.task("serve", ["build"], function() {
  server.init({
    server: "build/"
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]);
});
