import { IMiddlewareConfig, IMiddlewares } from 'rafter';

export default (): IMiddlewares => new Set<IMiddlewareConfig>(['cors', 'apolloServerMiddleware']);
