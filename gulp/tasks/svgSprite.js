import gulp from 'gulp';
import path from '../config/path.js';

// Плагины
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
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
    .pipe(
      svgSprite({
        shape: {
          transform: [
            {
              svgo: {
                multipass: true,
                plugins: [
                  'inlineStyles',
                  'convertStyleToAttrs',
                  {
                    name: 'removeAttrs',
                    params: {
                      attrs: ['svg:(style|display|visibility)', 'style'],
                    },
                  },
                  'removeStyleElement',
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                        moveElemsAttrsToGroup: false,
                        convertPathData: {
                          floatPrecision: 4,
                          makeArcs: false,
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        svg: {
          xmlDeclaration: false,
          doctypeDeclaration: false,
        },
        mode: {
          stack: {
            sprite: '../icons.svg',
          },
        },
      })
    )
    .pipe(gulp.dest(path.svgSprite.dest));
};
