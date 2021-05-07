import { HttpError } from 'rafter';

export interface IResponseDto {
  message: string;
  data: Record<string, unknown>;
  status: number;
}

export interface IErrorResponseDto {
  errors: HttpError[];
  status: number;
}
