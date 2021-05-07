import {
  HttpError,
  ILogger,
  ILoggerFactory,
  IRequest,
  IResponse,
  JsonController,
  JsonErrorResponseDto,
  JsonResponseDto,
  JsonResponseTransformer,
  Status,
} from '../';

export class HomeController extends JsonController {
  private readonly logger: ILogger;

  constructor(
    protected readonly jsonResponseTransformer: JsonResponseTransformer,
    private readonly loggerFactory: ILoggerFactory,
  ) {
    super(jsonResponseTransformer);
    this.logger = loggerFactory('HomeController');
  }

  public async index(request: IRequest, response: IResponse): Promise<void> {
    try {
      const jsonResponse = new JsonResponseDto({
        message: 'Hello Mars. This is an example of a controller.',
        data: {},
        status: 200,
      });

      this.logger.debug(`Rendering api response`, jsonResponse);

      return this.render(request, response, jsonResponse);
    } catch (error) {
      const jsonResponse = new JsonErrorResponseDto({
        errors: [error as HttpError],
        status: Status.BAD_REQUEST,
      });
      this.logger.error(`Error rendering api response`, jsonResponse);
      return this.renderError(request, response, jsonResponse);
    }
  }
}

export default HomeController;
