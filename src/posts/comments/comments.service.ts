import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { PaginatePostDto } from '../dto/paginate-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { UsersModel } from 'src/users/entity/users.entity';
import { UpdateCommentsDto } from './dto/update-comments.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsModel)
        private readonly commentsRepository: Repository<CommentsModel>,
        private readonly commonService: CommonService,
    ) { }

    getRepository(qr?: QueryRunner){
        return qr ? qr.manager.getRepository<CommentsModel>(CommentsModel) : this.commentsRepository;
    }

    async paginateComments(
        dto: PaginatePostDto,
        postId: number,
    ) {
        return this.commonService.paginate(
            dto,
            this.commentsRepository,
            {},
            `posts/${postId}/comments`
        )
    }

    async createComment(
        dto: CreateCommentsDto,
        postId: number,
        author: UsersModel,
        qr?: QueryRunner,
    ) {
        const repository = this.getRepository(qr);

        return repository.save({
            ...dto,
            post: {
                id: postId,
            },
            author,
        })
    }

    async updateComment(
        dto: UpdateCommentsDto,
        commentId: number,
    ){
        const comment = await this.commentsRepository.preload({
            id: commentId,
            ...dto,
        });

        const newComment = await this.commentsRepository.save(
            comment,
        );

        return newComment;
    }

    deleteComment(
        commentId: number,
        qr?: QueryRunner,
    ){
        const repository = this.getRepository(qr);

        return repository.delete(commentId);
    }

    async isCommentMine(userId: number, commentId: number){
        return this.commentsRepository.exist({
            where:{
                id: commentId,
                author:{
                    id: userId,
                },
            },
        });
    }
}
