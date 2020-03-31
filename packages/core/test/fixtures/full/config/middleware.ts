import { IMiddlewareConfig } from '../../../../lib/common/middleware';

const middleware = (): Array<IMiddlewareConfig> => ['requestLogger'];

export default middleware;
