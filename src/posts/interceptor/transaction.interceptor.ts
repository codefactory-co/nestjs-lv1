import {
    CallHandler,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
  } from '@nestjs/common';
  import { DataSource } from 'typeorm';
  import { catchError, Observable, tap } from 'rxjs';
  
  @Injectable()
  export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly dataSource: DataSource) {}
  
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
      const req = context.switchToHttp().getRequest();
  
      const qr = await this.dataSource.createQueryRunner();
  
      await qr.connect();
      // transaction isolation level에 대해 설명한다.
      // https://www.postgresql.org/docs/current/transaction-iso.html
      await qr.startTransaction();
  
      req.queryRunner = qr;
  
      // next.handle()을 실행하면 일단 적용된 메서드가 실행된다.
      return next.handle().pipe(
        catchError(async (e) => {
          await qr.rollbackTransaction();
          await qr.release();
  
          throw new InternalServerErrorException(e.message);
        }),
        tap(async () => {
          await qr.commitTransaction();
          await qr.release();
        }),
      );
    }
  }
  