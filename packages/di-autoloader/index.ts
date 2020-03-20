import { IDiAutoloader } from './lib/IDiAutoloader';
import { IDiContainer } from './lib/IDiContainer';
import DiAutoloader from './lib/DiAutoloader';

export default DiAutoloader;
export { DiAutoloader, IDiAutoloader, IDiContainer };

export const test = (): string => {
  return 'Hi';
};
