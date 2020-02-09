import { createContainer, InjectionMode } from 'awilix';
import { AwilixContainer } from 'awilix/lib/container';

// TODO move this to the autoloader so we dont expose the container
export default (): AwilixContainer => {
  return createContainer({ injectionMode: InjectionMode.CLASSIC });
};
