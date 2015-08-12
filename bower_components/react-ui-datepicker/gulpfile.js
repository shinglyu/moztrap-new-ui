var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require('webpack');
var less = require("gulp-less");

var clean = require('gulp-clean');
gulp.task('clean', function () {
    return gulp.src('./build', {read: false})
        .pipe(clean());
});

require("./require.uncache.js")(require);

var localeConfig = ["zh", "en"];

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> v<%= pkg.version %> <%= pkg.description %>',
  ' * Repository <%= pkg.repository.url %>',
  ' * Homepage <%= pkg.homepage %>',
  ' * Copyright 2015 <%= pkg.author.name %>',
  ' * Licensed under the <%= pkg.license %> License',
  ' */',
  ''].join('\n');

var reactWrapper = require("./wrapper.js");
var reactUglify = require("./react-uglify.js");

var taskNames = ["clean"];

localeConfig.forEach(function(locale){
    GLOBAL.__LOCALE__ = locale;


    GLOBAL.__MODE__ = 1;

    require.uncache("./webpack.config.js");
    var webpackConfigDev = require("./webpack.config.js");

    var taskName = "?locale=" + locale + "&dev=" + GLOBAL.__MODE__;

    gulp.task("webpack" + taskName, function(callback){
        // run webpack
        webpack(webpackConfigDev, function(err, stats){
            if(err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
                // output options
            }));
            callback();
        });
    });

    gulp.task("build" + taskName, ["webpack" + taskName], function(callback){
        gulp.src(webpackConfigDev.output.filename)
            .pipe(reactWrapper(banner + "\n", "", {pkg : pkg}))
            .pipe(gulp.dest("./build"));
    });
    taskNames.push("build" + taskName);


    GLOBAL.__MODE__ = 0;
    require.uncache("./webpack.config.js");
    var webpackConfigBuild = require("./webpack.config.js");

    taskName = "?locale=" + locale + "&dev=" + GLOBAL.__MODE__;

    gulp.task("webpack" + taskName, function(callback){
        // run webpack
        webpack(webpackConfigBuild, function(err, stats){
            if(err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
                // output options
            }));
            callback();
        });
    });

    gulp.task("build" + taskName, ["webpack" + taskName], function(callback){
        gulp.src(webpackConfigBuild.output.filename)
            .pipe(reactUglify(null, (
                "prototype bind state props exports setState " + 
                "push map length replace " + 
                "year month days current active focused isEnter setFullYear getDate setDate date onMouseEvent events"
                ).split(" ")
            ))
            .pipe(reactWrapper(banner + "\n", "", {pkg : pkg}))
            .pipe(gulp.dest("./build"));
    });
    taskNames.push("build" + taskName);
});

gulp.task("less", function(callback){
    gulp.src("./src/datepicker.less")
        .pipe(less())
        .pipe(gulp.dest("./build"));
});

gulp.task("example", function(callback){
    gulp.src(["./bower_components/bootstrap/dist/css/bootstrap.css", "./bower_components/react/react.js"])
        .pipe(gulp.dest("./example"));
});

taskNames.push("less", "example");

gulp.task("default", taskNames, function(){

});