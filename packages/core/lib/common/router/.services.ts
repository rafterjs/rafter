export default {
  routerProvider: {
    path: `${__dirname}/RouterProviderFactory`,
    dependencies: [],
  },
  configToRouteDtoTransformer: {
    path: `${__dirname}/ConfigToRouteDtoTransformer`,
    dependencies: [`diContainer`],
  },
  routesProvider: {
    path: `${__dirname}/routes-provider`,
    dependencies: [`configToRouteDtoTransformer`, `routerProvider`, `logger`],
  },
};
