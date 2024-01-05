import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { RolesEnum } from "src/users/const/roles.const";
import { UsersModel } from "src/users/entity/users.entity";

@Injectable()
export class PassIfAdminGuard implements CanActivate{
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const req = context.switchToHttp().getRequest() as Request & {user: UsersModel};

        const {user} = req;

        if(!user){
            throw new UnauthorizedException(
                '사용자 정보를 가져올 수 없습니다.',
            );
        }

        if(user.role === RolesEnum.ADMIN){
            return true;
        }

        return false;
    }
}