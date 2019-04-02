# rx-scheduler

Reactive Extensions - an object that specifies an API for scheduling units of work

## Scheduler Types

Schedulers are divided into 3 major groups

| Group | Description |
| --- | --- |
| Current | Schedules on the current thread. |
| Instance | Schedules on a separate Worker thread. |
| Pool | Schedules on an idle Worker thread (separate from the Instance and Current). |

Each group have 3 sub-types

| Type | Description |
| --- | --- |
| Immediate | Runs the task immediately. |
| Micro | Runs the task as a Microtask. |
| Macro | Runs the task as a Macrotask. |

Scheduling a task on ```Current``` and ```Instance``` group queues the task and is executed once the queue has finished earlier tasks. Scheduling a task on ```Pool``` group runs on an idle Worker thread. If there are no idle Worker threads, the task is queued until any of the Workers has finished.

Scheduling a task of type ```Immediate``` will immediately execute that task on the given thread.
Scheduling a task of type ```Micro``` will enqueue and execute that task as a Microtask. Microtasks are tasks that are executed after the current task on the main thread has finished.
Scheduling a task of type ```Macro``` will enqueue and execute that task as a Macrotask. Macrotasks are tasks that are executed after Microtasks.

```Immediate```, ```Micro``` and ```Macro``` are all blocking tasks, and so waits for the former to finish before starting to execute.
