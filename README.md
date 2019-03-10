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
#### Gulp3 Task API

While there is significant advantage to using the new Tasks API in Gulp4, it is possible to still use the old tasks api

```javascript
const { when, task, TaskFilterFactory, FILTERS } = require('@the-world.io/gulp-task-when');
const gulp = require('gulp');

const CustomFilters = require('./CustomFilters');
const { clean } = require('./gulp.std.tasks');

gulp.task('compile:ts', async () => {
    // Transpile typescript
});

gulp.task('compile:babel', async () => {
    // Transpile Babel Sources
});

gulp.task('compile:less', async() => {
    // Compile less
});

gulp.task('compile:all', gulp.series(
    clear,
    when(
        task( CustomFilters.HasBabelSource, 'compile:babel' ),
        task( CustomFilters.HasTypeScriptSource, 'compile:ts' ),
        task( CustomFilters.HasLessSource, 'compile:less' )
    )
));
```

### API

#### when(...tasks: [FilteredTask](#filteredtask)): Undertaker.TaskFunction

Returns a composed TaskFunction as if you had called `gulp.series` directly, however will only return tasks who's filter evaluates to true. 

##### Examples

```javascript
module.exports.default = when(filteredTasks);
```

#### task(filter: TaskFilter, ...tasks: Task): FilteredTask

Factory to create [FilteredTask](#filteredtask) instances. Accepts a [TaskFilter](#taskfilter) function and an arbitrary number of tasks to execute in series if that filter evaluates to true.

##### Examples

```javascript
const filteredTask = task( FILTERS.ALWAYS, task1, task2, task3 );
const filteredTask = task( MyCustomFilterFactory(runtimeArg), task1 );
```

#### FilteredTask

An object that composes a filter and an arbitrary number of tasks to be executed in series if the filter evaluates to true. While this object can be called directly, the recommended way to construct a FilteredTask is through the root-level `task()` factory function.

##### Methods

###### constructor(filter: [TaskFilter](#taskfilter), tasks: Function[] | string[])

Returns a new instance of the FilteredTask with the provided filter and an array of tasks to execute if that filter evaluates to true.

##### Properties

* `filter`: [TaskFilter](#taskfilter) - The filter function that determines whether the provided tasks should be run
* `tasks`: Function[] | string[] - The tasks that should be run if the filter evaluates to true

#### TaskFilter

Interface type for filters. TaskFilters are functions that accept no parameters and return a boolean to indicate whether the filter's tasks should be run.

##### Interface

`function TaskFilter(): boolean`

##### Examples

```javascript
const MyCustomFilter = () => {
    if (someRunTimeValue === 'value-wanted') {
        return someOtherRunTimeValue === 'other-value-wanted';
    }
}

module.exports.custom = when(task( MyCustomFilter, task1 ));
```

#### TaskFilterFactory

Factory method invoked at runtime to return a TaskFilter. Use a TaskFilterFactory when you need to accept arguments for a TaskFilter. The signature allows any
arbitrary arguments to be passed and the factory returns a reference to a TaskFilter implementation.

##### Interface

`function TaskFilterFactory(...args: any): TaskFilter`

##### Examples

```javascript
const ArgumentPresentFilterFactory(arg) {
    return process.argv.includes(arg);
}

// Task will be run if --any-argument is passed on the gulp command-line
// gulp argtask --any-argument
module.exports.argtask = when(task(ArgumentPresentFilterFactory('any-argument'), task1));
```

