import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const route = context.switchToHttp().getRequest().originalUrl;

        const date = new Date();

        console.log(`[REQ] ${route} date : ${date.toLocaleString('kr')}`)

        return next
            .handle()
            .pipe(
                tap(
                    ()=> console.log(`[RES] ${route} date : ${new Date().toLocaleString('kr')} time : ${new Date().getMilliseconds() - date.getMilliseconds()}ms`)
                ),
            );
    }
}