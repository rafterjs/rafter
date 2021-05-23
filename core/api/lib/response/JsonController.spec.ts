import { BadGatewayError, IRequest, IResponse } from 'rafter';
import { StubbedInstance, stubConstructor, stubInterface } from 'ts-sinon';

import { JsonController } from './JsonController';
import { JsonErrorResponseDto } from './JsonErrorResponseDto';
import { JsonResponseDto } from './JsonResponseDto';
import { JsonResponseTransformer } from './JsonResponseTransformer';
import { Status } from './StatusCodes';

class TestController extends JsonController {
  constructor(protected readonly jsonResponseTransformer: JsonResponseTransformer) {
    super(jsonResponseTransformer);
  }
}

describe('JsonController', () => {
  let mockJsonResponseTransformer: StubbedInstance<JsonResponseTransformer>;
  let mockRequest: StubbedInstance<IRequest>;
  let mockResponse: StubbedInstance<IResponse>;
  let testController: TestController;

  beforeEach(() => {
    mockJsonResponseTransformer = stubConstructor(JsonResponseTransformer);
    mockRequest = stubInterface<IRequest>();
    mockResponse = stubInterface<IResponse>();
    testController = new TestController(mockJsonResponseTransformer);
  });

  describe('render()', () => {
    it(`should successfully render a json response`, async () => {
      const data = [
        {
          id: '1',
          name: 'Daniel Ricciardo',
        },
      ];

      const jsonResponseDto = new JsonResponseDto({
        data,
        message: 'Best F1 drivers',
      });

      const jsonResponse = {
        transactionId: '123',
        message: 'Best F1 drivers',
        data,
        links: {
          self: 'http://localhost',
        },
      };

      mockJsonResponseTransformer.convert.returns(jsonResponse);
      mockResponse.status.returns(mockResponse);

      await testController.render(mockRequest, mockResponse, jsonResponseDto);

      expect(mockResponse.status.calledOnce).toBeTruthy();
      expect(mockResponse.json.calledOnce).toBeTruthy();

      const status = mockResponse.status.args[0][0];
      expect(status).toEqual(200);

      const json = mockResponse.json.args[0][0];
      expect(json).toEqual(jsonResponse);
    });
  });

  describe('renderError()', () => {
    it(`should successfully render a json error response`, async () => {
      const error = new BadGatewayError();

      const jsonErrorResponseDto = new JsonErrorResponseDto({
        errors: [error],
        status: Status.BAD_GATEWAY,
      });
      const jsonResponse = {
        transactionId: '123',
        errors: [
          {
            code: 503,
            title: 'Bad Gateway',
            detail: '',
          },
        ],
      };

      mockResponse.status.returns(mockResponse);
      mockJsonResponseTransformer.convertError.returns(jsonResponse);

      await testController.renderError(mockRequest, mockResponse, jsonErrorResponseDto);

      expect(mockResponse.status.calledOnce).toBeTruthy();
      expect(mockResponse.json.calledOnce).toBeTruthy();

      const status = mockResponse.status.args[0][0];
      expect(status).toEqual(502);

      const json = mockResponse.json.args[0][0];
      expect(json).toEqual(jsonResponse);
    });
  });
});
