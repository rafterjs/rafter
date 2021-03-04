# Rafter

Rafter is a lightweight, slightly opinionated Javascript framework for rapid development of web applications.

### Rafter:

- is built using [Typescript](https://www.typescriptlang.org/).
- is built on top of [Expressjs](https://expressjs.com/).
- eliminates the tedious wiring of routes, middleware and services.
- allows decoupling of services by utilizing dependency injection via the autoloading service
  container [Awilix](https://github.com/jeffijoe/awilix).
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

Dependency autoloading is at the heart of _Rafter_, and the most opinionated portion of the framework. Rafter
utilizes [Awilix](https://github.com/jeffijoe/awilix) under the hood
to [automatically scan your application directory and register services](https://github.com/jeffijoe/awilix#containerloadmodules)
. So there's no need to maintain configuration or add annotations, as long as the function or constructor arguments are
the same name, it will wire everything up automatically.

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
  constructor(private readonly logger: ILogger) {}

  public run(): void {
    this.logger.log('I have been autowired');
  }
}
```

The _Rafter_ autoloader will look recursively throughout your project for services, functions and config. This means you
do not need to statically `import` all your dependencies, which maintains separation of concerns and improves
reusability.

## Rafter specific config files

The following configuration files are autoloaded by _Rafter_.

- `config.ts`: a general application or module config.
- `middleware.ts`: registers services as middleware and loads them into the routes stack.
- `routes.ts`: links controller services to route definitions.
- `preStartHooks.ts`: loads defined services before Rafter has started the server.
- `plugins.ts`: a config file outlining which plugins to load.

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

The middleware file (`middleware.js`) exports an array of service name references which will be loaded/registered in the
order in which they were defined. eg.

```typescript
export default (): IMiddlewares => new Set<IMiddlewareConfig>([`corsMiddleware`, `authenticationMiddleware`]);
```

#### Routes

The routes file (`routes.ts`) exports an array of objects which define the http method, route, controller and action.
eg.

```typescript
export default (): IRoutes =>
  new Set<IRouteConfig>([
    {
      endpoint: `/`,
      controller: `exampleController`,
      action: `index`,
      method: `get`,
    },
  ]);
```

This would call `exampleController.index(req, res)` when the route `GET /` is hit. `exampleController` will be the name
of the autoloaded service.

#### Pre start hooks

The routes file (`pre-start-hooks.js`) exports an array of service references that will be executed before Rafter has
started, in the order in which they were defined. This is useful for instantiating DB connections, logging etc.

```typescript
export default (): IPreStartHooks => new Set<IPreStartHookConfig>([`connectDbService`]);
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

By adding `async` to the function, _Rafter_ will wait for it to be successfully returned before continuing to the next
pre start hook, or will finish starting up if there are no more hooks.

### Starting your Rafter application

Along with the aforementioned configs, all that is required to run Rafter is the following in an `test.ts` file:

```typescript
import rafter from 'rafter';

const run = async () => {
  // define the paths you want to autoload
  const paths = [join(__dirname, '/**/!(*.spec).@(ts|js)')];

  // instantiate rafter
  const rafterServer = rafter({ paths });

  // start rafter server
  await rafterServer.start();
};

run();
```

Once `start()` is called, Rafter will:

1. Scan through all your directories looking for config files, plugins and services.
2. Autoload all `plugins`.
3. Autoload all other services, injecting their dependencies.
4. Run all the `pre-start-hooks`.
5. Apply all the `middleware`.
6. Register all the `routes`.
7. Start the server.

To see an example project, visit the [skeleton rafter app](https://github.com/joshystuart/rafter-skeleton-app)
repository, or look at the included `boilerplate` application
within [packages](https://github.com/joshystuart/rafter/tree/master/packages/boilerplate).

# Going deeper

Rafter is slightly opinionated; which means we have outlined specific ways of doing some things. Not as much as say,
Sails or Ruby on Rails, but just enough to provide a simple and fast foundation for your project.

The foundations of the Rafter framework are:

- Dependency injection
- Autoloading services
- Configuration

## Dependency injection (DI)

With the advent of `RequireJs`, dependency injection (DI) had largely been thrown by the wayside in favor of requiring /
importing all your dependencies. This meant that your dependencies were hard coded in each file, resulting in code that
was not easily unit tested, nor replicable without rewrites.

eg.

### With RequireJs

```typescript
import mongoose from 'mongoose';

const connect = async (connectionUrl) => {
  await mongoose.connect(connectionUrl);
};

const find = async (query) => {
  await mongoose.find(query);
};

export { connect, find };
```

### With DI

```typescript
export default class DbDao {
  constructor(private readonly db: IDatabaseDao, private readonly config: { connectionUrl: string }) {}

  public async connect(): Promise<IDatabaseConnection> {
    return this.db.connect(this.config.connectionUrl);
  }

  public async find<T>(query: any): Promise<T> {
    return this.db.find(query);
  }
}
```

As you can see with DI, we can substitute any DB service rather than being stuck with mongoose. This insulates services
which use a data store from caring what particular store it is. eg. If our DB becomes slow, we can simply substitute
a `CacheDao` instead, and no other services would have to change.

## How DI Works in Rafter

Many other DI frameworks require you to use special decorators to specify which services are injected where. Rafter on
the other hand, utilizes the KISS method of dependency injection;

1. All services you want to be available in the DI container must have a `default` export.
2. The `file name` of the service is the `camelCase` reference in the DI container eg.
   - File name: `lib/users/UserManager.ts`
   - Reference in DI container: `userManager`
3. The variable names in the `class constructor` or `function arguments` match the reference names (see above) in the DI
   container.

### Example

We have the following service with the filename: `lib/CommentManager.ts`

```typescript
export default class CommentManager {
  constructor(private readonly dbDao: DbDao, private readonly logger: ILogger) {}

  public async getComment(id: string): Promise<Comment> {
    this.logger.info(`Getting comment for id: ${id}`);
    return this.dbDao.find(`SELECT * FROM comments WHERE id=${id}`);
  }
}
```

If we want to inject the `CommentManager` into another service we must name the variable in the constructor
`commentManager`. eg.

```typescript
export default class CommentController {
  constructor(private readonly commentManager: CommentManager) {}

  public async index(request: IRequest, response: IResponse): Promise<void> {
    const comment = await this.commentManager.getComment(1);
    response.json(comment);
  }
}
```

Or, if you prefer to use functional programming, make sure the argument name is a `camelCase` version of
the `file name`:

```typescript
export default (commentManager: CommentManager) => {
  return async (request: IRequest, response: IResponse): Promise<void> => {
    const comment = await this.commentManager.getComment(1);
    response.json(comment);
  };
};
```
