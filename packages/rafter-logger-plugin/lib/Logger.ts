import { ILogger } from './ILogger';
import { loggerFactory } from './LoggerFactory';

// default logger without a category or override config.
export const logger = loggerFactory();
export default (): ILogger => logger;
