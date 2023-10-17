import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(
        private reflector: Reflector,
    ){}

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        // roles에 대한 메타데이터를 가져오는 방법
        // decorator는 controller와 method에 모두 적용이 가능하다
        // method의 적용은 getAllAndOverride를 했을때 class에서 
        const requiredRoles = this.reflector.getAllAndOverride(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ],
        );

        if(!requiredRoles){
            return true;
        }

        const {user} = context.switchToHttp().getRequest();
        return requiredRoles !== user.role;
    }
}