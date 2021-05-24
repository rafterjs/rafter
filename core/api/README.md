# Rafter API Server

The `@rafterjs/api` server provides a simple wrapper around `rafter` and `express` to create JSON API's rapidly with all the benefits that [rafter provides](https://github.com/joshystuart/rafter#readme) including autoloading dependency injection.

## Getting started

```
yarn add @rafterjs/api
```

### Add rafter api to your project

Example structure

- config
  - config.ts
  - middleware.ts
  - plugins.ts
  - preStartHooks.ts
  - routes.ts
- lib
  - HomeController.ts
- index.ts

#### index.ts

This is the server entry point. Think of this like your `express()` server definition.

You pass in the paths you want to autoload our dependencies from. In the example below all the `./config` files and `./lib/HomeController.ts` will load into the rafter api server.

```typescript
import { Server } from '@rafterjs/api';
import { join } from 'path';

const paths = [join(__dirname, `{lib,config}/**/`)];

const server = new Server({ paths });

async function run(): Promise<void> {
  try {
    console.info(`Starting the simple rafter api`);
    await server.start();
  } catch (error) {
    console.error(error);
    await server.stop();
    process.exit(1);
  }
}

run();
```

#### lib/HomeController.ts

One of the benefits of the `@rafterjs/api` is that you can extend the provided `JsonController` and it will handle rendering in a consistent format.

```typescript
import {
  JsonController,
  JsonResponseDto,
  IController,
  IControllerAction,
  IRequest,
  IResponse,
  Status,
} from '@rafterjs/api';

interface IHomeController extends IController {
  index: IControllerAction;
}

export default class UsersController extends JsonController implements IHomeController {
  public index(request: IRequest, response: IResponse): void {
    this.render(
      request,
      response,
      new JsonResponseDto({
        message: 'This is the users endpoint',
        data: { name: 'Daniel Ricciardo', email: 'dan@mclaren.com' },
        meta: { totalPages: 1, totalRecords: 1 },
        status: Status.SUCCESS,
      }),
    );
  }
}
```

By extending `JsonController` you call the `this.render` method and pass in the `JsonResponseDto`. This will output the response in the following format:

```json
{
  "transactionId": "399f91a2-77f9-49c2-8df6-e7928f48429e",
  "message": "This is the users endpoint",
  "data": {
    "name": "Daniel Ricciardo",
    "email": "dan@mclaren.com"
  },
  "links": {
    "self": "http://localhost:4000/users"
  },
  "meta": {
    "totalPages": 1,
    "totalRecords": 1
  }
}
```

## Overrides

You can override any of the default `@rafterjs/api` services.

#### JsonResponseTransformer override

By creating a file called `JsonResponseTransformer`, it allows you to change the output of the controller `render` function.

```typescript
import { IJsonResponse, IJsonResponseData, IJsonResponseTransformer, IRequest, JsonResponseDto } from '@rafterjs/api';

export class JsonResponseTransformer implements IJsonResponseTransformer {
  public convert<T extends IJsonResponseData>(
    request: IRequest,
    jsonResponseDto: JsonResponseDto<T>,
  ): IJsonResponse<T> {
    return {
      data: jsonResponseDto.data,
    } as IJsonResponse<T>;
  }
}

export default JsonResponseTransformer;
```

This will change the json response to something much simpler eg.

```json
{
  "data": {
    "name": "Daniel Ricciardo",
    "email": "dan@mclaren.com"
  }
}
```

By allowing you to override the default rafter services, it gives you complete control while still benefiting from the simplicity of rafter.

See the api example [https://github.com/rafterjs/rafter/tree/master/examples/simple-api](https://github.com/rafterjs/rafter/tree/master/examples/simple-api)
