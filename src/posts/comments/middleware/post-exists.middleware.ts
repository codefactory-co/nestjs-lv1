import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NestMicroserviceOptions } from "@nestjs/common/interfaces/microservices/nest-microservice-options.interface";
import { NextFunction, Request, Response } from "express";
import { PostsService } from "src/posts/posts.service";

@Injectable()
export class PostExistsMiddleware implements NestMiddleware{
    constructor(
        private readonly postService: PostsService,
    ){

    }

    async use(req: Request, res: Response, next: NextFunction) {
        const postId = req.params.postId;

        if(!postId){
            throw new BadRequestException(
                'Post ID 파라미터를 입력해주세요!',
            );
        }

        const exists = await this.postService.checkPostExistsById(
            parseInt(postId),
        );

        if(!exists){
            throw new BadRequestException(
                '존재하지 않는 포스트입니다.',
            );
        }

        next();
    }
}