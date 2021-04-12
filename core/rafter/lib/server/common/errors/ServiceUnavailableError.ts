import { Status } from '../response';
import { HttpError } from './HttpError';

export class ServiceUnavailable extends HttpError {
  constructor(message = `Service Unavailable`) {
    super(Status.SERVICE_UNAVAILABLE, message);
    this.name = 'Service Unavailable';
  }
}
