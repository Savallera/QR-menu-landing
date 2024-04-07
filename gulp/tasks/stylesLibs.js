import gulp from 'gulp';
import path from '../../../HOC/gulp/config/path.js';
import browserSync from 'browser-sync';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

export default () => {
  return gulp
    .src(path.stylesLibs.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'SCSS LIBS',
          message: error.message,
        })),
      })
    )
    .pipe(gulp.dest(path.stylesLibs.dest))
    .pipe(browserSync.stream());
};
