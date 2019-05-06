# rx-scheduler

Reactive Extensions - an object that specifies an API for scheduling units of work

[![NPM](https://nodei.co/npm/rx-scheduler.png)](https://nodei.co/npm/rx-scheduler/)

[![](https://data.jsdelivr.com/v1/package/npm/rx-scheduler/badge)](https://www.jsdelivr.com/package/npm/rx-scheduler)
[![HitCount](http://hits.dwyl.io/lxsmnsyc/rx-scheduler.svg)](http://hits.dwyl.io/lxsmnsyc/rx-scheduler)

| Platform | Build Status |
| --- | --- |
| Linux | [![Build Status](https://travis-ci.org/LXSMNSYC/rx-scheduler.svg?branch=master)](https://travis-ci.org/LXSMNSYC/rx-scheduler) |
| Windows | [![Build status](https://ci.appveyor.com/api/projects/status/mkjwe462uk80axx4?svg=true)](https://ci.appveyor.com/project/LXSMNSYC/rx-scheduler) |


[![codecov](https://codecov.io/gh/LXSMNSYC/rx-scheduler/branch/master/graph/badge.svg)](https://codecov.io/gh/LXSMNSYC/rx-scheduler)

## Install

NPM

```bash
npm i rx-scheduler
```

CDN

* jsDelivr
```html
<script src="https://cdn.jsdelivr.net/npm/rx-cancellable/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/rx-scheduler/dist/index.min.js"></script>
```

* unpkg
```html
<script src="https://unpkg.com/rx-cancellable/dist/index.min.js"></script>
<script src="https://unpkg.com/rx-scheduler/dist/index.min.js"></script>
```

## Usage

### Loading the module

#### CommonJS

```js
const Scheduler = require('rx-scheduler');
```

Loading the CommonJS module provides the Scheduler class.

#### Browser

Loading the JavaScript file for the rx-scheduler provides the Scheduler class

## Example

```js
import Scheduler from 'rx-scheduler';

Scheduler.immediate.delay(() => console.log('Hello World, Immediate 100'), 100);
Scheduler.timeout.delay(() => console.log('Hello World, Timeout 100'), 100);
Scheduler.async.delay(() => console.log('Hello World, Async 100'), 100);
Scheduler.tick.delay(() => console.log('Hello World, Tick 100'), 100);
Scheduler.current.delay(() => console.log('Hello World, Current 100'), 100);

Scheduler.immediate.schedule(() => console.log('Hello World, Immediate'));
Scheduler.timeout.schedule(() => console.log('Hello World, Timeout'));
Scheduler.async.schedule(() => console.log('Hello World, Async'));
Scheduler.tick.schedule(() => console.log('Hello World, Tick'));
Scheduler.current.schedule(() => console.log('Hello World, Current'));
```

Output:

```
Hello World, Current
Hello World, Tick
Hello World, Async
Hello World, Timeout
Hello World, Immediate
Hello World, Current 100
Hello World, Tick 100
Hello World, Async 100
Hello World, Timeout 100
Hello World, Immediate 100
```

## Scheduler Types

There are three scheduler types

| Type | Description |
| --- | --- |
| Current | Schedules the task as the next task for the current thread. |
| Immediate | Schedules the task immediately for the next frame, using setImmediate (NodeJS) or requestAnimationFrame (Browser). |
| Async | Schedules the task in async fashion. |
| Timeout | Schedules the task using ```setTimeout``` |
| Tick | NodeJS only. Schedules the task immediately after the current thread. |

Each scheduler types has two methods: `schedule`, which executes the schedule immediately on their own threads and `delay`, which schedules the function with a timer on their own threads. Both methods return a Cancellable instance, that allows you to cancel the scheduled functions if necessary.

## Creating your own Scheduler

You can create your own Scheduler that is recognizable by the implementations by extending ```Scheduler.interface```

```js
class MyScheduler extends Scheduler.interface {
  schedule(fn) {
    // scheduling logic
  }

  delay(fn, amount) {
    // delayed scheduling logic
  }
}
```

## Documentation

You can read the documentation at the [official doc site](https://lxsmnsyc.github.io/rx-scheduler/)

## Build

Clone the repo first, then run the following to install the dependencies

```bash
npm install
```

To build the coverages, run the test suite, the docs, and the distributable modules:

```bash
npm run build
```

## Changelogs
* 0.2.5
  - Delayed schedules with 0 time will be executed immediately.
* 0.2.2
  - Compliance with rx-cancellable@0.2.0
* 0.2.1
  - scheduled functions now cancels the `Cancellable` instance when finished.
* 0.2.0
  - Replaced AbortController with [Cancellable](https://lxsmnsyc.github.io/rx-cancellable/).
  - `schedule` and `delay` now returns a `Cancellable` to cancel schedules.
* 0.1.0
  - Release