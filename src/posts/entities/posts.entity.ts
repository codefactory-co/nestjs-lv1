import { Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { join } from "path";
import { ENV_HOST_KEY } from "src/common/const/env-keys.const";
import { POST_IMAGE_PATH, POST_PUBLIC_IMAGE_PATH } from "src/common/const/paths.const";
import { BaseModel } from "src/common/entity/base.entity";
import { ImageModel } from "src/common/entity/image.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentsModel } from "../comments/entity/comments.entity";

@Entity()
export class PostsModel extends BaseModel {
    @ManyToOne(() => UsersModel, (user) => user.posts, {
        nullable: false,
    })
    author: UsersModel;

    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    content: string;

    @OneToMany((type) => ImageModel, (image) => image.post,)
    images: ImageModel[];

    // @Column({
    //     nullable: true,
    // })
    // @Transform(({value}) => value && `/${join(POST_PUBLIC_IMAGE_PATH, value)}`)
    // image?: string;

    @Column()
    likeCount: number;

    @Column()
    commentCount: number;

    @OneToMany(()=> CommentsModel, (comment) => comment.post)
    comments: CommentsModel[];
}