import helmet from 'helmet';
import { IMiddleware } from 'rafter';

export default (): IMiddleware => {
  return helmet();
};
