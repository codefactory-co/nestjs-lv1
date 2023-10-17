import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
    (data, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();

        // 혹시 Transaction 적용 안하고 QueryRunner 데코레이터만 사용하면
        // 에러를 던질 수 있도록
        if (!req.queryRunner) {
            throw new InternalServerErrorException(
                'QueryRunner Decorator를 사용하려면 Transaction Decorator를 적용해야합니다.',
            );
        }

        // Transaction Decorator가
        return req.queryRunner;
    },
);
