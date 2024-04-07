import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

export default () => {
  return gulp
    .src(path.scriptsLibs.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'JS LIBS',
          message: error.message,
        })),
      })
    )
    .pipe(gulp.dest(path.scriptsLibs.dest));
};
