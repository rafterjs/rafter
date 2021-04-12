import { createContainer, InjectionMode } from 'awilix';
import { IDiContainer } from './IDiContainer';

export default (): IDiContainer => {
  return createContainer({ injectionMode: InjectionMode.CLASSIC });
};
