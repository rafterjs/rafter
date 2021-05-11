import { IJsonResponseData, IJsonResponseMeta } from './IJsonResponse';
import { Status } from './StatusCodes';

export type JsonResponseParams<T extends IJsonResponseData, M = IJsonResponseMeta> = {
  message?: string;
  data?: T;
  status?: Status;
  meta?: M;
};

export class JsonResponseDto<T extends IJsonResponseData, M = IJsonResponseMeta> {
  public readonly message?: string;

  public readonly data?: T;

  public readonly meta?: M;

  public readonly status: Status;

  constructor(params: JsonResponseParams<T, M>) {
    const { message, data, status = Status.SUCCESS, meta } = params;
    this.message = message;
    this.data = data;
    this.status = status;
    this.meta = meta;
  }
}
