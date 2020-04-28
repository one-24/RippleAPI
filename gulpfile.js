let gulp = require("gulp"),
	uglifyJS = require("gulp-uglify"),
	babel = require("gulp-babel"),
	htmlmin = require("gulp-htmlmin"),
	connect = require("gulp-connect"),
	cleanCSS = require('gulp-clean-css'),
	dest = "dist";


gulp.task('connect', function() {
	connect.server({
		root : dest,
		livereload : true
	});
});


gulp.task("js", function(){
	gulp.src("./src/js/*.js")
		.pipe(babel({
            presets: ['env']
        }))
        .pipe(uglifyJS())
		.pipe(gulp.dest("./"+ dest +"/js"))
		.pipe(connect.reload());
});


gulp.task("html", function(){
	gulp.src("./src/**/*.html")
		.pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
		.pipe(gulp.dest("./"+ dest +""))
		.pipe(connect.reload());
});

gulp.task('csscompress', function() {
  return  gulp.src('./src/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest("./"+ dest +"/css"));
});


gulp.task("copy-images", function(){
	gulp.src("./src/images/*.*")
		.pipe(gulp.dest("./"+ dest +"/images"))
		.pipe(connect.reload());
});



gulp.task("copy", ["copy-images"]);


gulp.task('watch', function () {
	gulp.watch(['./src/**/*.html'], ['html']);
	gulp.watch(['./src/js/*.js'], ['js']);
	gulp.watch(['./src/sass/*.scss'], ['sass']);
});


gulp.task('default', [ "js", "html", "copy","csscompress" ,'connect', 'watch']);
