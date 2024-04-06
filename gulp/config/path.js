const pathSrc = './src';
const pathDest = './dist';

export default {
  root: pathDest,

  html: {
    src: pathSrc + '/pages/*.html',
    watch: [pathSrc + '/pages/*.html', pathSrc + '/blocks/**/*.html'],
    dest: pathDest,
  },

  styles: {
    src: pathSrc + '/styles/styles.scss',
    watch: [
      pathSrc + '/styles/*.scss',
      pathSrc + '/styles/**/*.scss',
      pathSrc + '/blocks/**/*.scss',
    ],
    dest: pathDest + '/styles',
  },

  scripts: {
    src: pathSrc + '/scripts/*.js',
    watch: [
      pathSrc + '/scripts/*.js',
      pathSrc + '/scripts/**/*.js',
      pathSrc + '/blocks/**/*.js',
    ],
    dest: pathDest + '/scripts',
  },

  images: {
    src: [
      pathSrc + '/images/*.{jpg,jpeg,png,gif}',
      pathSrc + '/images/**/*.{jpg,jpeg,png,gif}',
      '!' + pathSrc + '/images/favicon/*.*',
    ],
    watch: [
      pathSrc + '/images/*.{jpg,jpeg,png,gif}',
      pathSrc + '/images/**/*.{jpg,jpeg,png,gif}',
      '!' + pathSrc + '/images/favicon/*.*',
    ],
    dest: pathDest + '/images',
  },

  svg: {
    src: [
      pathSrc + '/images/*.svg',
      pathSrc + '/images/**/*.svg',
      '!' + pathSrc + '/images/icons/*.svg',
    ],
    watch: [
      pathSrc + '/images/*.svg',
      pathSrc + '/images/**/*.svg',
      '!' + pathSrc + '/images/icons/*.svg',
    ],
    dest: pathDest + '/images',
  },

  svgSprite: {
    src: [pathSrc + '/images/icons/*.svg'],
    watch: [pathSrc + '/images/icons/*.svg'],
    dest: pathDest + '/images',
  },

  favicon: {
    src: [pathSrc + '/images/favicon/*.*'],
    watch: [pathSrc + '/images/favicon/*.*'],
    dest: pathDest + '/images/favicon',
  },

  fonts: {
    src: [pathSrc + '/fonts/**/*'],
    watch: [pathSrc + '/fonts/**/*'],
    dest: pathDest + '/fonts',
  },

  files: {
    src: [pathSrc + '/files/**/*'],
    watch: [pathSrc + '/files/**/*'],
    dest: pathDest + '/files',
  },
};
