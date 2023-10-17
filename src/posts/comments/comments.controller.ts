import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PaginatePostDto } from '../dto/paginate-post.dto';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { GuardsConsumer } from '@nestjs/core/guards';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { UpdateCommentsDto } from './dto/update-comments.dto';

@Controller('posts/:pid/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService
  ) { }

  @Get()
  getComments(
    @Param('pid', ParseIntPipe) pid: number,
    @Query() query: PaginatePostDto,
  ) {
    return this.commentsService.paginateComments(
      query,
      pid,
    );
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postComments(
    @Param('pid', ParseIntPipe) pid: number,
    @Body() body: CreateCommentsDto,
    @User() user: UsersModel,
  ) {
    return this.commentsService.createComment(
      body,
      pid,
      user,
    );
  }

  @Patch(':cid')
  @UseGuards(AccessTokenGuard)
  async patchComments(
    @Param('cid') cid: number,
    @Body() body: UpdateCommentsDto,
  ){
    const comment = await this.commentsService.updateComment(
      body,
      cid,
    );

    return comment;
  }

  @Delete(':cid')
  async deleteComment(
    @Param('cid') cid: number,
  ){
    return await this.commentsService.deleteComment(
      cid,
    );
  }
}
