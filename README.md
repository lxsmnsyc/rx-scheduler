# rx-scheduler

Reactive Extensions - an object that specifies an API for scheduling units of work

## Scheduler Types

Schedulers are divided into 3 major groups

| Group | Description |
| --- | --- |
| Current | Schedules on the current thread. |
| Instance | Schedules on a separate Worker thread. |
| New | Schedules on a new Worker thread (separate from the Instance and Current) |

Each group have 3 sub-types

| Type | Description |
| --- | --- |
| Immediate | Runs the task immediately. |
| Micro | Runs the task as a Microtask. |
| Macro | Runs the task as a Macrotask. |
