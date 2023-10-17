import { IsNumber, IsString } from "class-validator";
import { BaseModel } from "src/common/entity/base.entity";
import { PostsModel } from "src/posts/entities/posts.entity";
import { PostModel } from "src/posts/posts.service";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, IsNull, ManyToOne } from "typeorm";

@Entity()
export class CommentsModel extends BaseModel{
    @ManyToOne(()=> UsersModel, (user) => user.postComments)
    author: UsersModel;

    @ManyToOne(() => PostsModel, (post) => post.comments)
    post: PostModel;

    @Column()
    @IsString()
    comment: string;

    @Column({
        default: 0,
    })
    @IsNumber()
    likeCount: number;
}