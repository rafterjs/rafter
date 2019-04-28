/* eslint-disable no-console */
import { BoxDiAutoLoader } from '@rafter/di-autoloader';
import serviceConfig from './service-config';

const boxDiAutoLoader = new BoxDiAutoLoader(serviceConfig);

boxDiAutoLoader.load();

const config = boxDiAutoLoader.get('config');
const subConfig = boxDiAutoLoader.get('config.foo.bar');
const testClass = boxDiAutoLoader.get('testClass');
const testFunction = boxDiAutoLoader.get('testFunction');

console.log('This is the config: ', config);
console.log('This is the test class calling a method: ', testClass.getBar());
console.log('This is a test function being called: ', testFunction());
console.log('This is some sub config: ', subConfig);
