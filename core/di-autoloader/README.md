# A dependency injection autoloader

[![Build Status](https://travis-ci.com/crimsonronin/box-di-autoloader.svg?branch=master)](https://travis-ci.com/crimsonronin/box-di-autoloader)

A config driven autoloader for dependency injection.

## Getting started

```
yarn add @rafterjs/di-autoloader
```

## Example

Check out the files in `./example` and `./test/fixtures`

### The autoloading config

```
// service-config.js

const servicesConfig = {
    config: {
        path: `${__dirname}/../test/mocks/test-config`,
        dependencies: []
    },
    testClass: {
        path: `${__dirname}/../test/mocks/test-class`,
        dependencies: [
            `config.foo.bar`,
            'testFunction'
        ]
    },
    testFunction: {
        path: `${__dirname}/../test/mocks/test-function`,
        dependencies: []
    }
};

export default servicesConfig;
```

### Example class with DI

```
// test-class.js

class TestClass {
    // The dependencies will be injected via the constructor
    constructor(bar, testFunction) {
        this._bar = bar;
        this._testFunction = testFunction;
    }

    /**
     * @return {string}
     */
    getBar() {
        return this._bar;
    }

    /**
     * @return {Function}
     */
    getFunction() {
        return this._testFunction;
    }

    /**
     * @return {string}
     */
    getData() {
        return `here's some data`;
    }
}

export default TestClass;
```

### Instantiating the DI container using the autoloader

```
import BoxDiAutoLoader from '../lib/box-di-autoloader';
import serviceConfig from './service-config';

const boxDiAutoLoader = new BoxDiAutoLoader(serviceConfig);
boxDiAutoLoader.load();

const testClass = boxDiAutoLoader.get('testClass');
console.log(testClass.getData());
```

## Why use dependency injection (DI)?

DI is a well vetted programming pattern that encourages decoupling of services and allows you to maintain separation of concerns. This in turn means your code is more testable and maintainable.

Check out: http://tutorials.jenkov.com/dependency-injection/dependency-injection-benefits.html and https://stackoverflow.com/questions/130794/what-is-dependency-injection

### Why should we use it in node?

Just because we have `import` or `require` doesn't mean we should forgo programming best practices. What `import` does is hardcode your dependencies, rather than making them configurable or reusable eg.

Say we have a `DbService` which currently uses `MongoDb`. In an `import` style your code would be something like:

```
import mongoose from 'mongoose';

class DbService {
    async connect(url) {
        return mongoose.connect(url);
    }

    async find(query, Model) {
        return mongoose.find(query, Model);
    }

    ...
}
```

But now your app has grown and you realise that the load on your DB is reducing application performance; you need to introduce a caching layer to reduce the load on the DB.

In our import scenario above that would require a bunch of rewriting at the `DbService` level. Instead if we had structured it like:

```
class DbService {
    constructor(dao) {
        this._dao = dao;
    }

    async connect(url) {
        return this._dao.connect(url);
    }

    async find(query, Model) {
        return this._dao.find(query, Model);
    }

    ...
}
```

We could now inject `MongoDbCacheDao` instead of injecting `mongoose`. This would handle the caching, and delegate through to `Mongo` if needed. The `DbService` doesn't care if it is cached or not; it is none of it's concern. eg

```
import crypto from 'crypto'; // NOTE: importing from the node standard lib is ok

class MongoDbCacheDao {
    constructor(dao) {
        this._dao = dao;
        this._cache = {};
    }

    async connect(url) {
        return this._dao.connect(url);
    }

    async find(query, Model) {
        const md5sum = crypto.createHash('md5');
        md5sum.update(
            JSON.stringify(query) +
            JSON.stringify(Model)
        );

        const cacheId =  md5sum.digest('hex');
        if (!this._cache[cacheId]) {
            this._cache[cacheId] = await this._dao.find(query, Model);
        }

        return this._cache[cacheId];
    }

    ...
}
```

So even though we have import/require in node, it is still valuable to separate concerns and use dependency injection. It will allow you to be much more flexible in the future and adapt to changes more quickly.

## Why use an autoloader with DI

As your application grows, so too does your dependency graph. Handling all your dependencies manually becomes very tedious and you end up with lots of boilerplate code in the form of `factories`. Instead, when using an autoloader, you maintain your dependencies in a simple config file and you only need to create `factories` in rare circumstances when class/function instantiation is much more complex.

Overall, this means less code to write and maintain, which means less complexity and faster time to market.
