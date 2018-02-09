export default {
    server: {
        path: `${__dirname}/server`,
        dependencies: [
            `express`,
            `routesProvider`,
            `configMiddlewareProvider`,
            `middleware`,
            `routes`,
            `config`,
            `logger`
        ]
    },
};