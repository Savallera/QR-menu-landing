import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import svgSprite from 'gulp-svg-sprite';

export default () => {
  return gulp
    .src(path.svgSprite.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'SVG',
          message: error.message,
        })),
      })
    )
    .pipe(newer(path.svgSprite.dest))
    .pipe(imagemin())
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../icons.svg',
          },
        },
      })
    )
    .pipe(gulp.dest(path.svgSprite.dest));
};
