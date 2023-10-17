import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length } from "class-validator";
import { Exclude } from "class-transformer";
import { ChatsModel } from "src/chats/entity/chats.entity";
import { MessagesModel } from "src/chats/messages/entity/messages.entity";
import { CommentsModel } from "src/posts/comments/entity/comments.entity";
import { UserFollowersModel } from "./user-followers.entity";

@Entity()
export class UsersModel extends BaseModel {
    @Column({
        length: 20,
        unique: true,
    })
    @IsString()
    @Length(1, 20)
    nickname: string;

    @Column({
        unique: true,
    })
    @IsString()
    @IsEmail()
    email: string;

    @Column()
    @Length(3, 8)
    @Exclude()
    password: string;

    @Column({
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER,
    })
    role: RolesEnum;

    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostsModel[];

    @ManyToMany(() => ChatsModel, (chat) => chat.users)
    @JoinTable()
    chats: ChatsModel[];

    @OneToMany(() => MessagesModel, (message) => message.author)
    messages: MessagesModel[];

    @OneToMany(() => CommentsModel, (comment) => comment.author)
    postComments: CommentsModel[];

    @OneToMany(() => UserFollowersModel, (userFollowersModel) => userFollowersModel.follower)
    followees: UserFollowersModel[];

    @OneToMany((type) => UserFollowersModel, (userFollowersModel) => userFollowersModel.followee)
    followers: UserFollowersModel[];

    @Column({
        default: 0
    })
    followersCount: number;

    @Column({
        default: 0
    })
    followingsCount: number;
}