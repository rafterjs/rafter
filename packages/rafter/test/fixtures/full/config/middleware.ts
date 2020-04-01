import { IMiddlewareConfig } from '../../../../lib/common/middleware';

const middleware = (): IMiddlewareConfig[] => ['requestLogger'];

export default middleware;
