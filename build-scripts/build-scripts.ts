import gulp from 'gulp';
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';

const clientSideTs = ts.createProject('src/scripts/tsconfig.json');

// Client side typescript
(() => {
	return gulp
		.src('src/scripts/**/*.ts', { base: './src' })
		.pipe(clientSideTs())
		.pipe(uglify())
		.pipe(gulp.dest('./dist/public/'));
})();

