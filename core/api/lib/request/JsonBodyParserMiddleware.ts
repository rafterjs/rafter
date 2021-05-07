import { json } from 'body-parser';
import { IMiddleware } from 'rafter';

export default (): IMiddleware => {
  return json();
};
