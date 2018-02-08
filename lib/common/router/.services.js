export default {
    expressRouterProvider: {
        path: `${__dirname}/express-router-provider-factory`,
        dependencies: []
    },
    configToRouteDtoMapper: {
        path: `${__dirname}/config-to-route-dto-mapper`,
        dependencies: [
            `diContainer`,
        ]
    },
    configExpressRouterProvider: {
        path: `${__dirname}/router-provider`,
        dependencies: [
            `configToRouteDtoMapper`,
            `expressRouterProvider`,
            `logger`,
        ]
    },
};