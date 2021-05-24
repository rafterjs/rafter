# Rafter API Server

The `@rafterjs/lambda` server provides a simple wrapper around `rafter` that allows you to execute a single function but still maintain all the benefits that [rafter provides](https://github.com/joshystuart/rafter#readme) including autoloading dependency injection. This is perfect for serverless and CLI applications.

## Getting started

```
yarn add @rafterjs/lambda
```

### Add rafter api to your project

Example structure

- config
  - config.ts
- lib
  - MessageController.ts
  - MessageDao.ts
- index.ts

#### index.ts

This is the function entry point. So this would be the file that either your CLI or Serverless config would execute.

```typescript
import { join } from 'path';
import { rafterLambda } from '@rafterjs/lambda';
import { messageController } from './lib/MessageController';

const paths = [join(__dirname, `/{lib,config}/**/`)];

/**
 * This is an example function that benefits from rafter auto dependency injection.
 * This means that you can reuse all the services and code you have written for an API or other apps within a
 * cron job, CLI app or serverless app.
 */
async function run(): Promise<void> {
  await rafterLambda({ paths }, messageController);
}

run();
```

#### ./lib/MessageController.ts

This is essentially a factory. Rafter injects the dependencies in via the first function, and then returns a new function. The returned function is what rafter uses to execute.

```typescript
export const messageController = (logger: ILogger) => (): void => {
  logger.info('Hey there, this is a lambda with dependency injection!');
};
```
