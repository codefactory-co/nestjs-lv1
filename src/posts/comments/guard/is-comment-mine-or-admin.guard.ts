import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { UsersModel } from "src/users/entity/users.entity";
import { RolesEnum } from "src/users/const/roles.const";
import { CommentsService } from "../comments.service";

@Injectable()
export class IsCommentMineOrAdminGuard implements CanActivate{
    constructor(
        private readonly commentService: CommentsService,
    ){

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
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

        const commentId = req.params.commentId;

        const isOk = await this.commentService.isCommentMine(
            user.id,
            parseInt(commentId),
        );

        if(!isOk){
            throw new ForbiddenException(
                '권한이 없습니다.',
            );
        }

        return true;
    }
}