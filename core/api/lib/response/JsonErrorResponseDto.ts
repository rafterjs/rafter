import { HttpError } from 'rafter';
import { Status } from './StatusCodes';

export type JsonErrorResponseParams = {
  errors: HttpError[];
  status: Status;
};

export class JsonErrorResponseDto {
  public readonly errors: HttpError[];

  public readonly status: number;

  constructor(params: JsonErrorResponseParams) {
    const { errors = [], status = Status.INTERNAL_SERVER_ERROR } = params;
    this.errors = errors;
    this.status = status;
  }
}
