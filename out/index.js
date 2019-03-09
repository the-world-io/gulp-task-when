"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilteredTask_1 = require("./FilteredTask");
var gulp_1 = require("gulp");
function when() {
    var tasks = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tasks[_i] = arguments[_i];
    }
    var outTasks = [];
    for (var _a = 0, tasks_1 = tasks; _a < tasks_1.length; _a++) {
        var t = tasks_1[_a];
        if (t.filter()) {
            Array.prototype.push.apply(outTasks, t.tasks);
        }
    }
    return gulp_1.series(outTasks);
}
exports.when = when;
exports.FILTERS = {
    ALWAYS: function () { return true; },
    NEVER: function () { return false; },
};
exports.task = function (filter) {
    var tasks = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        tasks[_i - 1] = arguments[_i];
    }
    return new FilteredTask_1.FilteredTask(filter, tasks);
};
