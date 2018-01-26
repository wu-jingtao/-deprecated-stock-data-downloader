const gulp = require("gulp");
const ts = require("gulp-typescript").createProject('tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');

//编译TS代码
gulp.task("compileTS", function () {
    return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('bin'));
});

//复制资源文件
gulp.task("copeFile", function () {
    return gulp.src('src/**/*.!(ts)')
        .pipe(gulp.dest('bin'));
});