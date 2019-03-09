# gulp-task-when

Orchestrates a gulp.series based on runtime conditions.

## Installation

### Prerequisites

#### Gulp 4.0+

```bash
npm install -D gulp-task-when 
yarn add -D gulp-task-when
```

### Installing

```bash
npm install -D gulp-task-when
yarn add -D gulp-task-when
```

## Usage

### Simple Pipeline

```javascript
const gulp = require('gulp');
const { when, task } = require('@the-world.io/gulp-task-when');
const rimraf = require('rimraf');

function isCleanArgSet() {
    return process.argv.includes('--clean');
}

function clean(cb) {
    rimraf('out', cb);
}

function compile(cb) {
    // .. do some stuff here
}

module.exports.build = gulp.series(when( task( isCleanArgSet, clean ) ), compile);
```

### Using a FilterFactory

Sometimes, you need to be able to re-use a filter to test different things, like the value 
of a command-line argument. 

```javascript
const { when, task } = require('@the-world.io/gulp-task-when');

function ArgFilterFactory(arg, value) {
    return () => {
        return args[arg] === value;
    }
}

module.exports.task = gulp.parallel(
    task1, 
    someOtherTask, 
    when( 
        task( ArgFilterFactory('label', 'fizz'), fuzz ),
        task( ArgFilterFactory('label', 'buzz'), buzz )
    ),
    gulp.series( 
        seriesTask1, 
        seriesTask2, 
        seriesTask3, 
        when(
            task(ArgFilterFactory('foo','bar'), foobar)
        )
    )
);
```

