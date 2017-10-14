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
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("scripts-del", function() {
  return del("js/scripts.min.js");
});

// Сборка и минимизация библиотек js
gulp.task("scripts", ["scripts-del"], function() {
  return gulp.src("js/*.js")
    .pipe(plumber())
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("js"));
});

// SVG-спрайт
gulp.task("sprite-del", function() {
  return del("img/sprite.svg");
});

gulp.task("sprite", ["sprite-del"], function() {
  return gulp.src("img/sprite/*.svg")
    .pipe(imagemin(imagemin.svgo()))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("img"));
});

gulp.task("serve", ["sprite", "style", "scripts"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("build", ["clean", "style", "scripts", "sprite"], function() {
  var buildCss = gulp.src("css/style.min.css")
      .pipe(gulp.dest("build/css"))
  var buildFonts = gulp.src("fonts/**/*.*") // Переносим шрифты в продакшен
      .pipe(gulp.dest("build/fonts"))
  var buildJs = gulp.src("js/scripts.min.js") // Переносим скрипты в продакшен
      .pipe(gulp.dest("build/js"))
  var buildHtml = gulp.src("*.html") // Переносим HTML в продакшен
      .pipe(gulp.dest("build"));
  var buildImg = gulp.src("img/**/*.*") // Переносим HTML в продакшен
      .pipe(gulp.dest("build/img"));
});
