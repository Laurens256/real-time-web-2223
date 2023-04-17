import gulp from 'gulp';

(() => {
	return gulp.src('src/assets/**/*.*')
		.pipe(gulp.dest('./dist/public/'));
})();
