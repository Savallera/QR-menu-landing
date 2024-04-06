import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import fileInclude from 'gulp-file-include';
import htmlMinify from 'html-minifier';
import webpHtml from 'gulp-webp-html';

export default () => {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true,
  };
  return (
    gulp
      .src(path.html.src)
      .pipe(fileInclude())
      .pipe(webpHtml())
      .pipe(
        plumber({
          errorHandler: notify.onError((error) => ({
            title: 'HTML',
            message: error.message,
          })),
        }).on('data', function (file) {
          const buferFile = Buffer.from(
            htmlMinify.minify(file.contents.toString(), options)
          );
          return (file.contents = buferFile);
        })
      )
      .pipe(gulp.dest(path.html.dest))
  );
};
