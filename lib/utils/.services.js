export default {
    dbDao: {
        path: `${__dirname}/mongoose-db-dao`,
        dependencies: [
            `config.db.connectionUrl`
        ]
    },
    winston: {
        path: `${__dirname}/winston-factory`,
        dependencies: [
            `config.logger.level`,
        ]
    },
    moment: {
        path: `${__dirname}/moment-factory`,
        dependencies: []
    },
    logger: {
        path: `${__dirname}/logger`,
        dependencies: [
            `winston`
        ]
    },
};
