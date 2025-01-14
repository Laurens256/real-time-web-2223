import gulp from 'gulp';
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';

const tsConfig1 = ts.createProject('src/scripts/tsconfig.json');
const tsConfig2 = ts.createProject('src/scripts/tsconfig.json');

// minify all ts files except ts files under socket folder
(() => {
	return gulp
		.src(['src/scripts/**/*.ts', '!src/scripts/socket/*.ts'], { base: './src' })
		.pipe(tsConfig1())
		.pipe(uglify({ mangle: true }))
		.pipe(gulp.dest('./dist/public/'));
})();

// files in socket folder get minified and bundled into socket.js, make sure socket.ts is first, then all other ts files except manager.ts, then manager.ts
(() => {
	return gulp
		.src(['src/scripts/socket/socket.ts', 'src/scripts/socket/!(manager).ts', 'src/scripts/socket/manager.ts'], { base: './src' })
		.pipe(tsConfig2())
		.pipe(concat('socket.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/public/scripts'));
})();
