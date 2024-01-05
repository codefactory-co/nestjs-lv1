import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch(HttpException)
export class SocketCatchHttpExceptionFilter extends BaseWsExceptionFilter<HttpException>{
    catch(exception: HttpException, host: ArgumentsHost): void {
        const socket = host.switchToWs().getClient();

        socket.emit(
            'exception',
            {
                data:exception.getResponse(),
            }
        )
    }
}