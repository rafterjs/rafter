import { ILogger } from '@rafterjs/logger-plugin';
import sinon, { StubbedInstance, stubInterface } from 'ts-sinon';

export const mockLogger: StubbedInstance<ILogger> = stubInterface<ILogger>();
export const mockLoggerFactory = sinon.stub();
mockLoggerFactory.returns(mockLogger);
