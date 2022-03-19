import { IRouterProvider } from 'rafter';
import { ApolloServer } from './ApolloServer';

export function apolloServerMiddlewareFactory(apolloServer: ApolloServer, routerProvider: IRouterProvider) {
  const router = routerProvider.createInstance();
  apolloServer.start();

  console.log('-------------------------- ADDING graphql');
  // @ts-ignore
  apolloServer.applyMiddleware({ app: router, path: '/graphql' });
  console.log('--------------------------Added', apolloServer);

  return router;
}

export default apolloServerMiddlewareFactory;
