export default {
    listUsersController: {
        path: `${__dirname}/list-users-controller`,
        dependencies: [
            `getRequestDtoProvider`,
            `listUsersInteractor`,
            `usersCollectionResponseDtoToResponseDtoTransformer`,
            `jsonRendererService`,
        ]
    },
    listUsersInteractor: {
        path: `${__dirname}/list-users-interactor`,
        dependencies: [
            `userManager`,
            `filterDtoToFilterObjectTransformer`,
            `sortDtoToQueryObjectTransformer`,
        ]
    },
    userManager: {
        path: `${__dirname}/user-manager`,
        dependencies: [
            `mongooseDbDao`
        ]
    },
};
