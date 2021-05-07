import { IJsonResponseData, IJsonResponseMeta } from './IJsonResponse';
import { Status } from './StatusCodes';

export type JsonResponseParams<T extends IJsonResponseData> = {
  message?: string;
  data?: T;
  status?: Status;
  meta?: IJsonResponseMeta;
};

export class JsonResponseDto<T extends IJsonResponseData> {
  public readonly message?: string;

  public readonly data?: T;

  public readonly meta?: IJsonResponseMeta;

  public readonly status: Status;

  constructor(params: JsonResponseParams<T>) {
    const { message, data, status = Status.SUCCESS, meta } = params;
    this.message = message;
    this.data = data;
    this.status = status;
    this.meta = meta;
  }
}
