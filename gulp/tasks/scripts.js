import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import babel from 'gulp-babel';
import webpack from 'webpack-stream';

export default () => {
  return gulp
    .src(path.scripts.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'JS',
          message: error.message,
        })),
      })
    )
    .pipe(babel())
    .pipe(
      webpack({
        mode: 'development',
      })
    )
    .pipe(gulp.dest(path.scripts.dest));
};
