import { FILTERS, task, TaskFilterFactory, when } from "../src";

function noop() {
    return 1;
}
noop.description = "No-Op Task";

describe("Simple Pipeline", () => {
    it("should always return the ALWAYS_TRUE task", () => {
        const tasks = when(task(FILTERS.ALWAYS, noop));
        expect(tasks).toHaveLength(1);
    });

    it("should never return for Filters.NEVER", () => {
        expect(when(task(FILTERS.NEVER, noop), task(FILTERS.ALWAYS, noop))).toHaveLength(1);
    });
});

describe("Filter Factory", () => {
    it("should return a TaskFilter object", () => {
        const factory: TaskFilterFactory = () => () => true;
        expect(when(task(factory(), noop))).toHaveLength(1);
    });
});
