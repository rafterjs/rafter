export default {
    preStartHooksProvider: {
        path: `${__dirname}/pre-start-hooks-provider`,
        dependencies: [
            `diContainer`,
            `logger`,
        ]
    },
};