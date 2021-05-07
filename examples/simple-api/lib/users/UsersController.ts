import {
  JsonController,
  JsonResponseDto,
  IController,
  IControllerAction,
  IRequest,
  IResponse,
  Status,
} from '@rafterjs/api';

interface IHomeController extends IController {
  index: IControllerAction;
}

export default class UsersController extends JsonController implements IHomeController {
  public index(request: IRequest, response: IResponse): void {
    this.render(
      request,
      response,
      new JsonResponseDto({
        message: 'This is the users endpoint',
        data: { name: 'Daniel Ricciardo', email: 'dan@mclaren.com' },
        status: Status.SUCCESS,
      }),
    );
  }
}
