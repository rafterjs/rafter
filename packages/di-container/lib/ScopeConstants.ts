const Singleton = Symbol('singleton');
const Prototype = Symbol('prototype');

export type IScope = typeof Singleton | typeof Prototype;

export { Singleton, Prototype };
