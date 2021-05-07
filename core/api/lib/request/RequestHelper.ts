import { IRequest } from 'rafter';

const LEGACY_TRANSACTION_ID_HEADER = 'X-transactionId';
const TRANSACTION_ID_HEADER = 'Aemo-transaction-id';

export class RequestHelper {
  public getTransactionIdFromHeader(request: IRequest): string | undefined {
    return request.header(TRANSACTION_ID_HEADER) || request.header(LEGACY_TRANSACTION_ID_HEADER);
  }
}

export default RequestHelper;
