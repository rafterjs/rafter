# Rafter Framework

Rafter is a lightweight, slightly opinionated Javascript framework for rapid development of web applications.

### Rafter:

- is built on top of [Expressjs](https://expressjs.com/).
- eliminates the tedious wiring of routes, middleware and services.
- allows decoupling of services by utilizing dependency injection via an autoloading service container.
- is flexible and testable.

## Install

```javascript
npm install --save rafter
```

## Getting started

The following configuration files are autoloaded during the Rafter service starting:

- `.config.ts`: a general application or module config.
- `.services.ts`: adds services and their dependencies to a service container.
- `.middleware.js`: registers services as middleware.
- `.routes.ts`: links controller services to route definitions.
- `.pre-start-hooks.js`: loads defined services before Rafter has started the server.

The Rafter autoloader will look for all of these files recursively throughout your project. This allows you to modularize your project rather than defining all your config in one place.

### Config

The config file (`.config.ts`) is a place to define all your application style config.

```javascript
export default {
  db: {
    connectionUrl: 'mongodb://localhost:27000/rafter' || process.env.NODE_DB_CONNECTION,
  },
  server: {
    port: 3000,
  },
  example: {
    message: `Hello Mars`,
  },
};
```

This config can be referenced within the injected dependencies.

### Services

The services file (`.services.ts`) is the heart of the Rafter, and the most opinionated portion of the framework.

It is a manifest of all your services and their dependencies. These will be autoloaded into the service container at run time, and invoked at request time. They are all Singletons, which means we only create 1 instance, and hold it in memory for the entire lifetime of the process.

```javascript
export default {
  exampleController: {
    path: `${__dirname}/example-controller`,
    dependencies: [`config.example.message`],
  },
  logger: {
    path: `${__dirname}/logger`,
    dependencies: [],
  },
  dbDao: {
    path: `${__dirname}/db-dao`,
    dependencies: [`mongoose`, `logger`],
  },
  mongoose: {
    path: `${__dirname}/mongoose-factory`,
    dependencies: [],
  },
  connectDbService: {
    path: `${__dirname}/connect-db-service`,
    dependencies: [`dbDao`, `logger`],
  },
};
```

The object key is the service name, which can be used as the dependency reference. This allows you to quickly and easily change or override dependencies.

### Middleware

The middleware file (`.middleware.js`) exports an array of service name references which will be loaded/registered in the order in which they were defined. eg.

```javascript
export default [`corsMiddleware`, `authenticationMiddleware`];
```

Note; the middleware must be registered in the `.services.ts` config.

### Routes

The routes file (`.routes.ts`) exports an array of objects which define the http method, route, controller and action. eg.

```javascript
export default [
  {
    endpoint: `/`,
    controller: `exampleController`,
    action: `index`,
    method: `get`,
  },
];
```

This would call `exampleController.index(req, res)` when the route `GET /` is hit. Again, the controller `exampleController` has to be registered in the `.services.ts` config.

### Pre start hooks

The routes file (`.pre-start-hooks.js`) exports an array of service references that will be executed before Rafter has started, in the order in which they were defined. This is useful for instantiating DB connections, logging etc.

```javascript
export default [`connectDbService`];
```

An example of the `connectDbService` would be:

```javascript
export default (dbDao, logger) => {
  return async () => {
    logger.info(`Connecting to the database`);
    return dbDao.connect();
  };
};
```

### Rafter instantiation

Along with the aforementioned configs, all that is required to run Rafter is the following:

```javascript
import rafter from 'rafter';

const run = async () => {
  const rafterServer = rafter();
  await rafterServer.start();
};

run();
```

Once `start()` is called, Rafter will:

1. Scan through all your directories looking for config files.
2. Autoload all your services into the service container.
3. Run all the `pre-start-hooks`.
4. Apply all the middleware.
5. Register all the routes.
6. Start the server.

To see an example project, visit the [skeleton rafter app](https://github.com/crimsonronin/rafter-skeleton-app) repository.

# Going deeper

Rafter is slightly opinionated; which means we have outlined specific ways of doing some things. Not as much as say, Sails or Ruby on Rails, but just enough to provide a simple and fast foundation for your project.

The foundations of the Rafter framework are:

- Dependency injection
- Autoloading services
- Configuration

## Dependency injection

With the advent of `RequireJs`, dependency injection (DI) had largely been thrown by the way side in favor of requiring / importing all your dependencies in Node. This meant that your dependencies were hard coded in each file, resulting in code that was not easily unit testable, nor replicable without rewrites.

eg.

### With RequireJs

```javascript
import mongoose from 'mongoose';

const connect = async connectionUrl => {
  await mongoose.connect(connectionUrl);
};

const find = async query => {
  await mongoose.find(query);
};

export { connect };
```

### With DI

```javascript
export default class DbDao {
  constructor(db) {
    this._db = db;
  }

  async connect(connectionUrl) {
    return this._db.connect(connectionUrl);
  }

  async find(query) {
    return this._db.find(query);
  }
}
```

As you can see with DI, we can substitute any DB service rather than being stuck with mongoose. This insulates services which use a data store from caring what particular store it is. eg. If our DB becomes slow, we can simply substitute a `CacheDao` instead, and no other services would have to change.
