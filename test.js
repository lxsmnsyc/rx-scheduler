const AbortController = require('abort-controller');
const Scheduler = require('./index');

Scheduler.current.macro.delay(() => console.log('Hello World, Macro 100'), 100);
Scheduler.current.micro.delay(() => console.log('Hello World, Micro 100'), 100);
Scheduler.current.immediate.delay(() => console.log('Hello World, Immediate 100'), 100);

Scheduler.current.macro.schedule(() => console.log('Hello World, Macro'));
Scheduler.current.micro.schedule(() => console.log('Hello World, Micro'));
Scheduler.current.immediate.schedule(() => console.log('Hello World, Immediate'));

