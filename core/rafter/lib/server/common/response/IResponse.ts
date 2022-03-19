import { Response } from '../../vendor';

export type IResponse<ResBody = any, Locals extends Record<string, any> = Record<string, any>> = Response<
  ResBody,
  Locals
>;
