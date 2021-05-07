export type ILoggerConfig = {
  logger: {
    level: string;
  };
};

export const config: ILoggerConfig = {
  logger: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};

export default (): ILoggerConfig => config;
