/**
 * This is just a test controller
 */
export default class ExampleController {
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    index(req, res) {
        res.send(`This is an example controller that overrides the Rafter test front controller`);
    }
}
