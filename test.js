const AbortController = require('abort-controller');
const Scheduler = require('./index');

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