const outputDir = '/srv/hosts/dev.omni/metaball';

const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass');

//const del = require('del');

gulp.task('markup', () => {
    return gulp.src('index.html')
        .pipe(gulp.dest(`${outputDir}/`));
});

const styleList = [
    'styles/**/*.scss',
];
gulp.task('styles', () => {
    return gulp.src('styles/main.scss')
        .pipe(sourcemaps.init())
            .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${outputDir}/`));
});

const scriptList = [
    'config.js',
    'scripts/util.js',
    'scripts/class.point.js',
    'scripts/class.circle.js',
    'scripts/main.js',
];
gulp.task('scripts', () => {
    return gulp.src(scriptList)
        .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${outputDir}/`));
});

gulp.task('watch', () => {
    gulp.watch('index.html', ['markup']);
    gulp.watch(scriptList, ['scripts']);
    gulp.watch(styleList, ['styles']);
});

gulp.task('default', ['markup', 'styles', 'scripts', 'watch']);
