// eslint-disable-next-line no-shadow
export enum METHODS {
  get = 'get',
  post = 'post',
  patch = 'patch',
  put = 'put',
  delete = 'delete',
  head = 'head',
}

export type MethodActions = keyof typeof METHODS;
