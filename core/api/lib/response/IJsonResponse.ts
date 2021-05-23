export type IJsonResponseData = Record<string, unknown> | Record<string, unknown>[];

export type IJsonResponseLinks = {
  self: string;
  prev?: string;
  next?: string;
};

export type IJsonResponseMeta = {
  totalRecords: number;
  totalPages: number;
};

export type IJsonResponse<T extends IJsonResponseData> = {
  transactionId: string;
  data?: T;
  links: IJsonResponseLinks;
  meta?: IJsonResponseMeta;
  message?: string;
};
