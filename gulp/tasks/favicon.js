import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';

export default () => {
  return gulp
    .src(path.favicon.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'FAVICON',
          message: error.message,
        })),
      })
    )

    .pipe(gulp.src('./src/images/favicon/favicon.ico'))
    .pipe(gulp.dest(path.favicon.dest))

    .pipe(gulp.src(path.favicon.src))
    .pipe(newer(path.favicon.dest))
    .pipe(imagemin())

    .pipe(gulp.dest(path.favicon.dest));
};
