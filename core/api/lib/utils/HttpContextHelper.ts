import expressHttpContext from 'express-http-context';

const TRANSACTION_ID_CONTEXT = 'transactionId';

export class HttpContextHelper {
  public setTransactionId(uuid: string): void {
    expressHttpContext.set(TRANSACTION_ID_CONTEXT, uuid);
  }

  public getTransactionId(): string | undefined {
    return expressHttpContext.get(TRANSACTION_ID_CONTEXT);
  }
}

export default HttpContextHelper;
