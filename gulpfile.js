const outputDir = '/srv/hosts/dev.omni/metaball';

const gulp = require('gulp');
//const del = require('del');

gulp.task('markup', () => {
    return gulp.src('index.html')
        .pipe(gulp.dest(`${outputDir}/`));
});

gulp.task('styles', () => {
    return gulp.src('*.css')
        .pipe(gulp.dest(`${outputDir}/`));
});

gulp.task('scripts', () => {
    return gulp.src('*.js')
        .pipe(gulp.dest(`${outputDir}/`));
});

gulp.task('watch', () => {
    gulp.watch('index.html', ['markup']);
    gulp.watch('*.js', ['scripts']);
    gulp.watch('*.css', ['styles']);
});

gulp.task('default', ['markup', 'styles', 'scripts', 'watch']);
