export default {
  routerProvider: {
    path: `${__dirname}/router-provider-factory`,
    dependencies: [],
  },
  configToRouteDtoTransformer: {
    path: `${__dirname}/config-to-route-dto-transformer`,
    dependencies: [`diContainer`],
  },
  routesProvider: {
    path: `${__dirname}/routes-provider`,
    dependencies: [`configToRouteDtoTransformer`, `routerProvider`, `logger`],
  },
};
