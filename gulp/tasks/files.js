import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import newer from 'gulp-newer';

export default () => {
  return gulp
    .src(path.files.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'FILES',
          message: error.message,
        })),
      })
    )
    .pipe(newer(path.files.dest))
    .pipe(gulp.dest(path.files.dest));
};
