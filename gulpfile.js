const gulp = require('gulp');
const rimraf = require('rimraf');
const typescript = require('gulp-typescript');
const tslint = require('gulp-tslint');
const through2 = require('through2');
const PluginError = require('plugin-error');
const jest = require('jest-cli');

const TS_GLOB = "src/**/*.ts";
const OUT = "out";

function clean(cb) {
    rimraf('out', cb);
}

async function compile_ts() {
    const project = typescript.createProject('./tsconfig.json', {
        sourceRoot: 'src/'
    });
    return gulp.src(TS_GLOB).pipe(project()).js.pipe(gulp.dest(OUT));
}

async function lint_ts() {
    return gulp.src(TS_GLOB).pipe(tslint({
        formatter: 'stylish'
    })).pipe(tslint.report())
}

async function test(cb) {
    jest.runCLI({ config: require('./jest.config') }, '.', (done) => {
        done();
    })
}

module.exports.clean = clean;
module.exports.compile = compile_ts;
module.exports.test = test;
module.exports.default = module.exports.build = gulp.series(lint_ts, compile_ts, test);

/*
function jest_runner(options = {}) {
    return through2.obj((file, enc, cb) => {
        console.log("Running Test: " + file.relative);
        options = Object.assign({
            rootDir: file ? process.cwd() : undefined
        }, options);

        jest.runCLI(options, [options.rootDir]).then(({results}) => {
            console.log(results.toString());

        });
    });
}
*/