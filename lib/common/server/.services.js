export default {
    server: {
        path: `${__dirname}/express-server`,
        dependencies: [
            `express`,
            `dbDao`,
            `configExpressRouterProvider`,
            `configMiddlewareProvider`,
            `middleware`,
            `routes`,
            `config`,
            `logger`
        ]
    },
    corsMiddleware: {
        path: `${__dirname}/middleware/cors-middleware`,
        dependencies: []
    },
};