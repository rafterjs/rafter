export default {
    exampleController: {
        path: `${__dirname}/example-controller`,
        dependencies: [
            `config.example.message`
        ]
    },
    preStartService1: {
        path: `${__dirname}/pre-start-service-1`,
        dependencies: [
            `logger`
        ]
    },
    preStartService2: {
        path: `${__dirname}/pre-start-service-2`,
        dependencies: [
            `logger`
        ]
    },
};