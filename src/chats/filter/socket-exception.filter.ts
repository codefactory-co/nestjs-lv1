import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch(HttpException)
export class SocketCatchHttpExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    super.catch(exception, host);

    const client = host.switchToWs().getClient();

    client.emit('exception', {
      status: 'exception',
      message: exception.getResponse(),
    });
  }
}
