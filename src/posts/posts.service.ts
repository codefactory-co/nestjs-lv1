import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, QueryRunner, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { HOST, PROTOCOL } from 'src/common/const/env.const';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { POST_IMAGE_PATH, PUBLIC_FOLDER_NAME, PUBLIC_FOLDER_PATH } from 'src/common/const/paths.const';
import { basename, join } from 'path';
import { promises } from 'fs';
import { ImageModel } from 'src/common/entity/image.entity';
import { CreatePostImageDto } from './image/dto/create-image.dto';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */

export interface PostModel {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
}

let posts: PostModel[] = [
    {
        id: 1,
        author: 'newjeans_official',
        title: '뉴진스 민지',
        content: '메이크업 고치고 있는 민지',
        likeCount: 1000000,
        commentCount: 999999,
    },
    {
        id: 2,
        author: 'newjeans_official',
        title: '뉴진스 해린',
        content: '노래 연습 하고 있는 해린',
        likeCount: 1000000,
        commentCount: 999999,
    },
    {
        id: 3,
        author: 'blackpink_official',
        title: '블랙핑크 로제',
        content: '종합운동장에서 공연중인 로제',
        likeCount: 1000000,
        commentCount: 999999,
    },
];

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>,
        private readonly commonService: CommonService,
    ) { }

    async getAllPosts() {
        return this.postsRepository.find({
            relations: ['author']
        });
    }

    async generatePosts(userId: number) {
        for (let i = 0; i < 100; i++) {
            await this.createPost(userId, {
                title: `임의로 생성된 포스트 제목 ${i}`,
                content: `임의로 생성된 포스트 내용 ${i}`,
                images: []
            });
        }
    }

    // 1) 오름차 순으로 정렬하는 pagination만 구현한다
    async paginatePosts(dto: PaginatePostDto) {
        return this.commonService.paginate(
            dto,
            this.postsRepository,
            {},
            'posts',
        );
    }

    async pagePaginatePosts(dto: PaginatePostDto) {
        const [posts, count] = await this.postsRepository.findAndCount({
            skip: dto.take * dto.page,
            take: dto.take,
            order: {
                createdAt: dto.order__createdAt,
            },
        });

        return {
            data: posts,
            total: count,
        }
    }

    async cursorPaginatePosts(dto: PaginatePostDto) {
        const where: FindOptionsWhere<PostsModel> = {};

        // 페이지기반 페이지네이션이 아닐때만
        if (dto.where__id__less_than) {
            /**
             * {
             *  id: LessThan(dto.where__id_less_than);
             * }
             */
            where.id = LessThan(dto.where__id__less_than);
        } else if (dto.where__id__more_than) {
            where.id = MoreThan(dto.where__id__more_than);
        }
        // 1, 2, 3, 4, 5
        const posts = await this.postsRepository.find({
            where,
            // order__createdAt
            order: {
                createdAt: dto.order__createdAt,
            },
            skip: dto.page ?? 0 * dto.take,
            take: dto.take,
        });

        // 해당되는 포스트가 0개 이상이면
        // 마지막 포스트를 가져오고
        // 아니면 null을 반환한다.
        const lastItem = posts.length > 0 && posts.length === dto.take ? posts[posts.length - 1] : null;

        const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);

        if (nextUrl) {
            /**
             * dto의 키값들을 루핑하면서
             * 키값에 해당되는 벨류가 존재하면
             * param에 그대로 붙여넣는다.
             * 
             * 단, where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
             */
            for (const key of Object.keys(dto)) {
                if (dto[key]) {
                    if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
                        nextUrl.searchParams.append(key, dto[key]);
                    }
                }
            }

            let key = null;

            if (dto.order__createdAt === 'ASC') {
                key = 'where__id_more_than';
            } else {
                key = 'where__id_less_than';
            }

            nextUrl.searchParams.append(key, lastItem.id.toString());
        }

        /**
         * Response
         * 
         * data: Data[],
         * cursor: {
         *    after: 마지막 Data의 ID
         * },
         * count: 응답한 데이터의 갯수
         * next: 다음 요청을 할때 사용할 URL
         */

        return {
            data: posts,
            cursor: {
                after: lastItem?.id ?? null,
            },
            count: posts.length,
            next: nextUrl?.toString() ?? null,
        }
    }

    async getPostById(id: number) {
        const post = await this.postsRepository.findOne({
            where: {
                id,
            },
            relations: ['author'],
        });

        if (!post) {
            throw new NotFoundException();
        }

        return post;
    }

    async checkPostExistsById(id: number){
        return this.postsRepository.exist({
            where:{
                id,
            },
        });
    }

    getRepository(qr?: QueryRunner){
        return qr ? qr.manager.getRepository<PostsModel>(PostsModel) : this.postsRepository;
    }

    async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
        // 1) create -> 저장할 객체를 생성한다.
        // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
        const repository = this.getRepository();

        const post = repository.create({
            author: {
                id: authorId,
            },
            ...postDto,
            images: [],
            likeCount: 0,
            commentCount: 0,
        });

        const newPost = await repository.save(post);

        return newPost;
    }

    async updatePost(postId: number, postDto: UpdatePostDto) {
        const { title, content } = postDto;
        // save의 기능
        // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
        // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.

        const post = await this.postsRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!post) {
            throw new NotFoundException();
        }

        if (title) {
            post.title = title;
        }

        if (content) {
            post.content = content;
        }

        const newPost = await this.postsRepository.save(post);

        return newPost;
    }

    async deletePost(postId: number) {
        const post = await this.postsRepository.findOne({
            where: {
                id: postId,
            }
        });

        if (!post) {
            throw new NotFoundException();
        }

        await this.postsRepository.delete(postId);

        return postId;
    }
}
