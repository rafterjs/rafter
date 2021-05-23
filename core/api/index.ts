import { IServerProps, Server } from './lib/Server';

export * from './config';
export * from './lib/response';
export * from './lib/request';
export * from './lib/utils';
export * from './lib/vendor';
export * from './lib/Server';

export default (props: IServerProps): Server => {
  return new Server(props);
};
