import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import newer from 'gulp-newer';
import ttf2woff2 from 'gulp-ttf2woff2';

function copyFontAssets() {
  return gulp
    .src([...path.fonts.src, '!' + path.fonts.ttf])
    .pipe(gulp.dest(path.fonts.dest));
}

function convertFonts() {
  return gulp
    .src(path.fonts.ttf)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'FONTS',
          message: error.message,
        })),
      })
    )
    .pipe(newer({ dest: path.fonts.dest, ext: '.woff2' }))
    .pipe(ttf2woff2())
    .pipe(gulp.dest(path.fonts.dest));
}

export default gulp.parallel(copyFontAssets, convertFonts);
