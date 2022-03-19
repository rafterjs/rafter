import { ApolloServer } from './ApolloServer';

export default async function startApolloServer(apolloServer: ApolloServer) {
  await apolloServer.start();
}
