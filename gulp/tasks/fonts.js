import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import newer from 'gulp-newer';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export default () => {
  return gulp
    .src(path.fonts.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'FONTS',
          message: error.message,
        })),
      })
    )
    .pipe(newer(path.fonts.dest))
    .pipe(fonter({ formats: ['woff', 'ttf'] }))
    .pipe(gulp.src(path.fonts.src + '.ttf'))
    .pipe(ttf2woff2())
    .pipe(gulp.dest(path.fonts.dest));
};
