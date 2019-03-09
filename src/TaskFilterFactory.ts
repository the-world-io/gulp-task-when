import { TaskFilter } from "./TaskFilter";

export type TaskFilterFactory = (...args: any) => TaskFilter;
