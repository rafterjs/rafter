import { join } from 'path';
import { rafterServerlessFactory } from 'rafter';
import { ILogger, loggerFactory } from '@rafterjs/logger-plugin';

export interface IFunctionProps {
  paths?: string[];
  logger?: ILogger;
}

export type ILambdaFunction = (...args: any[]) => void;
export type ILambdaFactoryFunction = (...args: any[]) => ILambdaFunction;

const LAMBDA_FUNCTION_NAME = 'rafterLambda';

export async function rafterLambda(
  { paths = [], logger = loggerFactory('server') }: IFunctionProps,
  lambdaFactory: ILambdaFactoryFunction,
): Promise<void> {
  const apiPaths = [join(__dirname, `/../{lib,config}/**/`)];

  const server = rafterServerlessFactory({
    paths: [...apiPaths, ...paths],
    logger,
  });

  // register the lambda
  server.register(LAMBDA_FUNCTION_NAME, lambdaFactory);

  await server.start();

  // get the lambda so that it wires the dependencies.
  const lambda = server.get<ILambdaFunction>(LAMBDA_FUNCTION_NAME);

  // execute
  try {
    lambda();
  } catch (error) {
    logger?.error(`Failed to execute lambda`, error);
  } finally {
    await server.stop();
  }
}
