import gulp from 'gulp';

(() => {
	return gulp.src('views/**/*.hbs', { base: './' }).pipe(gulp.dest('./dist/'));
})();
