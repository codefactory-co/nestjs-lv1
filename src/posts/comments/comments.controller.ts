import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PaginatePostDto } from '../dto/paginte-post.dto';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { UpdateCommentsDto } from './dto/update-comments.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { IsCommentMineOrAdminGuard } from './guard/is-comment-mine-or-admin.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { PostsService } from '../posts.service';


@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService,
    private readonly postsService: PostsService) {
    /**
     * 1) Entity 생성
     * author -> 작성자
     * post -> 귀속되는 포스트
     * comment -> 실제 댓글 내용
     * likeCount -> 좋아요 갯수
     * 
     * id -> PrimaryGeneratedColumn
     * createdAt -> 생성일자
     * updatedAt -> 업데이트일자
     * 
     * 2) GET() pagination
     * 3) GET(':commentId') 특정 comment만 하나 가져오는 기능
     * 4) POST() 코멘트 생성하는 기능
     * 5) PATCH(':commentId') 특정 comment 업데이트 하는 기능
     * 6) DELETE(':commentId') 특정 comment 삭제하는 기능
     */
  }

  @Get()
  @IsPublic()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginateCommentsDto,
  ) {
    return this.commentsService.paginteComments(
      query,
      postId,
    );
  }

  @Get(':commentId')
  @IsPublic()
  getComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentsService.getCommentById(commentId);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateCommentsDto,
    @User() user: UsersModel,
    @QueryRunner() qr: QR,
  ) {
    const resp = await this.commentsService.createComment(
      body,
      postId,
      user,
      qr,
    );

    await this.postsService.incrementCommentCount(
      postId,
      qr,
    );

    return resp;
  }

  @Patch(':commentId')
  @UseGuards(IsCommentMineOrAdminGuard)
  async patchComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentsDto,
  ) {
    return this.commentsService.updateComment(
      body,
      commentId,
    )
  }

  @Delete(':commentId')
  @UseGuards(IsCommentMineOrAdminGuard)
  @UseInterceptors(TransactionInterceptor)
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @QueryRunner() qr: QR,
  ) {
    const resp = await this.commentsService.deleteComment(commentId, qr);

    await this.postsService.decrementCommentCount(postId, qr);

    return resp;
  }
}
