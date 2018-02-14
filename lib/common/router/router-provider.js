/**
 * A provider that creates new router instances
 *
 * @param {object} express
 * @return {RouterProvider}
 */
export default (express) => {
    /**
     * @namespace RouterProvider
     */
    const RouterProvider = {};
    /**
     * Creates a new router instance.
     *
     * @return {object}
     */
    RouterProvider.createInstance = () => {
        return express.Router();
    };

    return Object.freeze(RouterProvider);
}
