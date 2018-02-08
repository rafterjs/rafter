export default {
    configMiddlewareProvider: {
        path: `${__dirname}/config-middleware-provider`,
        dependencies: [
            `diContainer`,
            `logger`,
        ]
    },
};