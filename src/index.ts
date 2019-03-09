import { FilteredTask } from "./FilteredTask";
import { TaskFilter } from "./TaskFilter";

import { series, TaskFunction } from "gulp";
import { Task } from "undertaker";

export function when(...tasks: FilteredTask[]): TaskFunction {
    const outTasks: Task[] = [];

    for (const t of tasks) {
        if (t.filter()) {
            Array.prototype.push.apply(outTasks, t.tasks);
        }
    }

    return series(outTasks);
}

export { TaskFilter } from "./TaskFilter";
export { TaskFilterFactory } from "./TaskFilterFactory";

export const FILTERS = {
    ALWAYS: () => true,
    NEVER: () => false,
};

export const task = (filter: TaskFilter, ...tasks: Task[]): FilteredTask => {
    return new FilteredTask(filter, tasks);
};
