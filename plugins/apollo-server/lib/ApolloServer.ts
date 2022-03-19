import { ApolloServer, gql } from 'apollo-server-express';

export { ApolloServer, gql } from 'apollo-server-express';

export type IApolloServerFactory = () => ApolloServer;

export function apolloServerFactory(): ApolloServer {
  const typeDefs = gql`
    type Book {
      title: String
      author: String
    }

    type Query {
      books: [Book]
    }
  `;

  // Resolver map
  const resolvers = {
    Query: {
      books() {
        return [];
      },
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [],
  });
  console.log('-------------------------- apolloServer', apolloServer);

  return apolloServer;
}

export default apolloServerFactory;
