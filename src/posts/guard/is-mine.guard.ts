import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostModel } from "../posts.service";
import { PostsModel } from "../entities/posts.entity";

@Injectable()
export class IsPostMineGuard implements CanActivate{
    constructor(
        @InjectRepository(PostsModel)
        private readonly postRepository: Repository<PostsModel>,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const req = context.switchToHttp().getRequest();

        const user = req.user;

        if(!user){
            throw new UnauthorizedException(
                `사용자 정보를 찾을 수 없습니다.`,
            );
        }

        const postId = req.params.postId;

        if(!postId){
            throw new InternalServerErrorException(
                `IsPostMineGuard를 사용할때는 postId 파라미터를 지정 해야합니다.`
            );
        }

        const post = await this.postRepository.findOne({
            where:{
                id: postId,
            },
            relations:{
                author: true,
            }
        });

        if(!post){
            throw new BadRequestException(
                `존재하지 않는 포스트입니다.`,
            )
        }

        if(post.author.id === user.id){
            throw new ForbiddenException(
                `내가 생성한 포스트만 삭제 가능합니다.`,
            )
        }

        return true;
    }
}