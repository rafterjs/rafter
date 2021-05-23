export type IJsonError = {
  code: number;
  title: string;
  detail?: string;
  source?: string;
};

export type IJsonErrorResponse = {
  errors: IJsonError[];
};
