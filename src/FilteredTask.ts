import { Task } from "undertaker";
import { TaskFilter } from "./TaskFilter";

export class FilteredTask {
    public filter: TaskFilter;
    public tasks: Task[];

    constructor(filter: TaskFilter, tasks: Task[]) {
        this.filter = filter;
        this.tasks = tasks;
    }
}
