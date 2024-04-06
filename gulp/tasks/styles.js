import gulp from 'gulp';
import path from '../config/path.js';
import browserSync from 'browser-sync';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import mediaquery from 'postcss-combine-media-query';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cssImport from 'gulp-cssimport';

const sass = gulpSass(dartSass);

export default () => {
  const plugins = [autoprefixer(), mediaquery(), cssnano()];
  return gulp
    .src(path.styles.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'styles',
          message: error.message,
        })),
      })
    )
    .pipe(concat('styles.scss'))
    .pipe(sass())
    .pipe(cssImport())
    .pipe(postcss(plugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(path.styles.dest))
    .pipe(browserSync.stream());
};
