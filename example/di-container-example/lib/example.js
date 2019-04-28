/* eslint-ignore-file */
import winston from 'winston';
import TestFactory from './test-factory';
import InvokableTest from './invokable-test';
import Config from './config';
import Box from '../lib/box';

winston.level = 'debug';

Box.setLogger(winston);

Box.register('config', Config);

Box.register('test', TestFactory);
Box.registerInvokable('invokableTest', InvokableTest, ['config']);

const test1 = Box.get('test');
console.log(`test1: ${JSON.stringify(test1.getConfig())}`);

const test2 = Box.get('test');
console.log(`test2: ${JSON.stringify(test2.getConfig())}`);

// the TestFactory uses Singleton=false
console.log(`Is test1 and test2 the same: ${test1 === test2}`);

const invokableTest = Box.get('invokableTest');
console.log(`invokableTest.getData: ${invokableTest.getData()}`);
console.log(`invokableTest.getConfig: ${JSON.stringify(invokableTest.getConfig())}`);

const deepConfigTest = Box.get('config.deep.foo');
console.log(`This is a deep object property test: ${deepConfigTest}`);
