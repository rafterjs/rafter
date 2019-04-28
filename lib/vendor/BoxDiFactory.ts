import {Box, IBox} from 'box-di';

export type IDiContainer = IBox;

export default (): IDiContainer => {
  return Box;
};
