import { IMiddlewareConfig, IMiddlewares } from 'rafter';

export default (): IMiddlewares =>
  new Set<IMiddlewareConfig>([
    'jsonBodyParserMiddleware', // NOTE: jsonBodyParser must come before expressHttpContextMiddleware
    'expressHttpContextMiddleware',
    // 'correlationIdMiddleware',
    // 'requestLoggerMiddleware',
    // 'helmetMiddleware',
    // 'cors',
  ]);
