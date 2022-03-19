export type IApolloServerConfig = {
  resolvers: string[];
};

export const config: IApolloServerConfig = {
  resolvers: [],
};

export default (): IApolloServerConfig => config;
