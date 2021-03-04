import { IMiddlewareConfig } from '../../../../lib/server/common/middleware';

const middleware = (): IMiddlewareConfig[] => ['requestLogger'];

export default middleware;
