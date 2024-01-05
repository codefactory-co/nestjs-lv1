import { IsNumber, IsString } from "class-validator";
import { BaseModel } from "src/common/entity/base.entity";
import { PostsModel } from "src/posts/entity/posts.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class CommentsModel extends BaseModel{
    @ManyToOne(()=> UsersModel, (user) => user.postComments)
    author: UsersModel;

    @ManyToOne(()=> PostsModel, (post) => post.comments)
    post: PostsModel;

    @Column()
    @IsString()
    comment: string;

    @Column({
        default: 0,
    })
    @IsNumber()
    likeCount: number;
}