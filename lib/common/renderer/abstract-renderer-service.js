import RendererServiceInterface from './renderer-service-interface';
import {STATUS} from '../response/response-constants';

/**
 * An Abstract renderer that implements the error handler as this should be common throughout all renderers
 */
class AbstractRendererService extends RendererServiceInterface {
    /**
     * @inheritDoc
     */
    async renderError(req, res, error) {
        let status = STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;
        let message;

        if (error instanceof Error) {
            message = error.message;
            if (error.status) {
                status = error.status;
            }
        } else {
            message = error.toString();
        }

        res.status(status).
        send(message);
    }
}

export default AbstractRendererService;
