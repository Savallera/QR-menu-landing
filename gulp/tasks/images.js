import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

export const imagesDev = gulp.parallel(
  function copyImages() {
    return gulp
      .src([...path.images.src, ...path.images.optimized, ...path.svg.src])
      .pipe(newer(path.images.dest))
      .pipe(gulp.dest(path.images.dest));
  },
  function webpImages() {
    return gulp
      .src(path.images.src)
      .pipe(newer({ dest: path.images.dest, ext: '.webp' }))
      .pipe(webp())
      .pipe(gulp.dest(path.images.dest));
  }
);

export default () => {
  return gulp
    .src(path.images.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'IMAGES',
          message: error.message,
        })),
      })
    )
    .pipe(newer(path.images.dest))
    .pipe(avif({ quality: 50 }))

    .pipe(gulp.src(path.images.src))
    .pipe(newer(path.images.dest))
    .pipe(webp())

    .pipe(gulp.src(path.images.src))
    .pipe(newer(path.images.dest))
    .pipe(imagemin())

    .pipe(gulp.src(path.svg.src))
    .pipe(newer(path.svg.dest))
    .pipe(imagemin())

    .pipe(gulp.src(path.images.optimized, { allowEmpty: true }))
    .pipe(gulp.dest(path.images.dest));
};
