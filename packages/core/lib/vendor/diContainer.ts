import { createContainer, InjectionMode } from 'awilix';
import { AwilixContainer } from 'awilix/lib/container';

export default (): AwilixContainer => {
  return createContainer({ injectionMode: InjectionMode.CLASSIC });
};
