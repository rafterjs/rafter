import { ILogger, ILoggerFactory } from '@rafterjs/logger-plugin';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';

export type ApiResponse<T> = AxiosResponse<T>;
export type ApiRequestConfig = AxiosRequestConfig;

export class ApiHelper {
  private readonly axios: AxiosStatic;

  private readonly logger: ILogger;

  constructor(loggerFactory: ILoggerFactory) {
    this.axios = axios;
    this.logger = loggerFactory('ApiHelper');
  }

  public async get<T = unknown, R = ApiResponse<T>>(url: string, config?: ApiRequestConfig): Promise<R> {
    return this.axios.get(url, config);
  }

  public async delete<T = unknown, R = ApiResponse<T>>(url: string, config?: ApiRequestConfig): Promise<R> {
    return this.axios.delete(url, config);
  }

  public async post<T = unknown, R = ApiResponse<T>>(url: string, data?: never, config?: ApiRequestConfig): Promise<R> {
    return this.axios.post(url, data, config);
  }

  public async put<T = unknown, R = ApiResponse<T>>(url: string, data?: never, config?: ApiRequestConfig): Promise<R> {
    return this.axios.put(url, data, config);
  }
}

export default ApiHelper;
