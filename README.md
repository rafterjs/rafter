Rafter
======
Rafter is a lightweight, slightly opinionated Javascript framework for rapid development of web applications.

### Rafter:

- is built using [Typescript](https://www.typescriptlang.org/).
- is built on top of [Expressjs](https://expressjs.com/).
- eliminates the tedious wiring of routes, middleware and services.
- allows decoupling of services by utilizing dependency injection via the autoloading service container [Awilix](https://github.com/jeffijoe/awilix).
- is flexible, reusable and testable.

## Install
```
yarn add rafter
```

## Run
```
yarn bootstrap & yarn build & yarn start:boilerplate
```

This will build and run the boilerplate project. You can access it via [http://localhost:3000](http://localhost:3000).

## Building your own Rafter application

### Dependency autoloading

Dependency autoloading is at the heart of _Rafter_, and the most opinionated portion of the framework. Rafter utilizes [Awilix](https://github.com/jeffijoe/awilix) under the hood to [automatically scan your application directory and register services](https://github.com/jeffijoe/awilix#containerloadmodules). So there's no need to maintain configuration or add annotations, as long as the function or constructor arguments are the same name, it will wire everything up automatically.

_Logger.ts_
```typescript
class Logger implements ILogger {
  public log(...args: any[]): void {
    console.log(args);
  }
}
```

_MyService.ts_
```typescript
class MyService {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }
  
  public run(): void {
    this.logger.log('I have been autowired');
  }
}
```

The _Rafter_ autoloader will look recursively throughout your project for services, functions and config. This means you do not need to statically `import` all your dependencies, which maintains separation of concerns and improves reusability.

## Rafter specific config files
The following configuration files are autoloaded by _Rafter_.

- `config.ts`: a general application or module config.
- `middleware.js`: registers services as middleware and loads them into the routes stack.
- `routes.ts`: links controller services to route definitions.
- `pre-start-hooks.js`: loads defined services before Rafter has started the server.

#### Config

The config file (`config.ts`) is a place to define all your application style config.

```typescript
export default () => ({
  db: {
    connection: 'mongodb://localhost:27000/rafter' || process.env.NODE_DB_CONNECTION,
  },
  server: {
    port: 3000,
  },
  example: {
    message: `Hello Mars`,
  },
});
```

This config can be referenced within the injected dependencies.

#### Middleware

The middleware file (`middleware.js`) exports an array of service name references which will be loaded/registered in the order in which they were defined. eg.

```typescript
export default (): IMiddlewareConfig[] => [`corsMiddleware`, `authenticationMiddleware`];
```

#### Routes

The routes file (`routes.ts`) exports an array of objects which define the http method, route, controller and action. eg.

```typescript
export default (): IRouteConfig[] => [
  {
    endpoint: `/`,
    controller: `exampleController`,
    action: `index`,
    method: `get`,
  },
];
```

This would call `exampleController.index(req, res)` when the route `GET /` is hit. Again, the controller `exampleController` has to be registered in the `.services.ts` config.

#### Pre start hooks

The routes file (`.pre-start-hooks.js`) exports an array of service references that will be executed before Rafter has started, in the order in which they were defined. This is useful for instantiating DB connections, logging etc.

```typescript
export default (): IPreStartHookConfig[] => [`connectDbService`];
```

An example of the `connectDbService` pre start hook would be:

```typescript
export default (dbDao: IDBDatabaseDao, logger: ILogger) => {
  return async function connect(): Promise<IDbConnection> {
    logger.info(`Connecting to the database`);
    return dbDao.connect();
  };
};
```

By adding `async` to the function, _Rafter_ will wait for it to be successfully returned before continuing to the next pre start hook, or will finish starting up if there are no more hooks.

### Starting your Rafter application

Along with the aforementioned configs, all that is required to run Rafter is the following in an `index.ts` file:

```typescript
import rafter from 'rafter';

const run = async () => {
  const rafterServer = rafter();
  await rafterServer.start();
};

run();
```

Once `start()` is called, Rafter will:

1. Scan through all your directories looking for config files and services.
2. Autoload all your services into the service container.
3. Run all the `pre-start-hooks`.
4. Apply all the `middleware`.
5. Register all the `routes`.
6. Start the server.

To see an example project, visit the [skeleton rafter app](https://github.com/crimsonronin/rafter-skeleton-app) repository, or look at the included `boilerplate` application within [packages](https://github.com/crimsonronin/rafter/tree/master/packages/boilerplate).

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

```typescript
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

```typescript
export class DbDao {
  private db: IDatabaseDao;
  private config: {connectionUrl: string};

  constructor(db: IDatabaseDao, config: {connectionUrl: string}) {
    this.db = db;
    this.config = config;
  }

  public async connect(): Promise<IDatabaseConnection> {
    return this.db.connect(this.config.connectionUrl);
  }

  public async find<T>(query: any): Promise<T> {
    return this.db.find(query);
  }
}
```

As you can see with DI, we can substitute any DB service rather than being stuck with mongoose. This insulates services which use a data store from caring what particular store it is. eg. If our DB becomes slow, we can simply substitute a `CacheDao` instead, and no other services would have to change.
