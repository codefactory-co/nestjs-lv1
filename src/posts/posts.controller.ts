import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards, Request, Patch, Query, UseInterceptors, UploadedFile, InternalServerErrorException } from '@nestjs/common';
import { PostModel, PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataSource, QueryRunnerAlreadyReleasedError } from 'typeorm';
import { ImageModelType } from 'src/common/entity/image.entity';
import { PostsModel } from './entities/posts.entity';
import { PostImageService } from './image/image.service';
import { LogInterceptor } from './interceptor/log.interceptor';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly postImageService: PostImageService,
        private readonly dataSource: DataSource,
        ) { }

    // 1) GET /posts
    //    모든 post를 다 가져온다.
    //   @Get()
    //   getPosts() {
    //     return this.postsService.getAllPosts();
    //   }
    @Post('random')
    @UseGuards(AccessTokenGuard)
    async postPostsRandom(@User() user: UsersModel) {
        await this.postsService.generatePosts(user.id);

        return true;
    }

    @Get()
    @UseInterceptors(LogInterceptor)
    getPosts(@Query() query: PaginatePostDto) {
        return this.postsService.paginatePosts(query);
    }

    // 2) GET /posts/:id
    //    id에 해당되는 post를 가져온다
    //    예를 들어서 id=1일경우 id가 1인 포스트를 가져온다.
    @Get(':id')
    getPost(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.getPostById(id);
    }

    // 3) POST /posts
    //    POST를 생성한다.
    //
    // DTO - Data Trasfer Object
    @Post()
    @UseGuards(AccessTokenGuard)
    async postPosts(
        @User('id') userId: number,
        @Body() body: CreatePostDto,
        // @Body('title') title: string,
        // @Body('content') content: string,
    ) {
        // 트랜젝션과 관련된 모든 쿼리를 담당할
        // 쿼리 러너를 생성한다.
        const qr = this.dataSource.createQueryRunner();

        let post: PostsModel;

        // 쿼리 러너에 연결한다.
        await qr.connect();
        // 쿼리 러너에서 트랜잭션을 시작한다.
        // 이 시점부터 같은 쿼리 러너를 사용하면
        // 트랜잭션 안에서 데이터베이셔 액션을 실행 할 수 있다.
        await qr.startTransaction();

        try{
            post = await this.postsService.createPost(
                userId, body, qr
            );
    
            for(let i = 0; i < body.images.length; i++){
                await this.postImageService.createPostImage({
                    post,
                    path: body.images[i],
                    order: i,
                    type: ImageModelType.postImage,
                }, qr);
            }

            // 쿼리 러너로 실행한 모든 데이터베이스 액션을
            // 커밋 -> 저장한다.
            await qr.commitTransaction();
        }catch(e){
            // 어떤 에러든 에러가 던져지면
            // 트랜잭션을 종료하고 원래 상태로 되돌린다.
            await qr.rollbackTransaction();
            // 쿼리 러너를 해제한다.
            await qr.release();

            throw new InternalServerErrorException(
                '요청에 실패 했습니다.'
            );
        }

        return this.postsService.getPostById(post.id);
    }


    // 4) PATCH /posts/:id
    //    id에 해당되는 POST를 변경한다.
    @Patch(':id')
    patchPost(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdatePostDto,
        // @Body('title') title?: string,
        // @Body('content') content?: string,
    ) {
        return this.postsService.updatePost(
            id, body,
        );
    }

    // 5) DELETE /posts/:id
    //    id에 해당되는 POST를 삭제한다.
    @Delete(':id')
    deletePost(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.postsService.deletePost(id);
    }
}
