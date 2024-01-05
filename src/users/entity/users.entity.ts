import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostsModel } from "src/posts/entity/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length, ValidationArguments } from "class-validator";
import { lengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";
import { Exclude, Expose } from "class-transformer";
import { ChatsModule } from "src/chats/chats.module";
import { ChatsModel } from "src/chats/entity/chats.entity";
import { MessagesModel } from "src/chats/messages/entity/messages.entity";
import { CommentsModel } from "src/posts/comments/entity/comments.entity";
import { UserFollowersModel } from "./user-followers.entity";

/**
 * id: number
 * 
 * nickname: string
 * 
 * email: string
 * 
 * password: string
 * 
 * role: [RolesEnum.USER, RolesEnum.ADMIN]
 */
@Entity()
export class UsersModel extends BaseModel {
    @Column({
        // 1)
        length: 20,
        // 2)
        unique: true,
    })
    @IsString({
        message: stringValidationMessage,
    })
    @Length(1, 20, {
        message: lengthValidationMessage,
    })
    // 1) 길이가 20을 넘지 않을 것
    // 2) 유일무이한 값이 될 것
    nickname: string;

    @Column({
        unique: true,
    })
    @IsString({
        message: stringValidationMessage,
    })
    @IsEmail({}, {
        message: emailValidationMessage,
    })
    // 1) 유일무이한 값이 될 것
    email: string;

    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    @Length(3, 8, {
        message: lengthValidationMessage,
    })
    /**
     * Request
     * frontend -> backend
     * plain object (JSON) -> class instance (dto)
     * 
     * Response
     * bakcend -> frontend
     * class instance (dto) -> plain object (JSON)
     * 
     * toClassOnly -> class instance로 변환될때만
     * toPlainOnly -> plain object로 변환될때만
     */
    @Exclude({
        toPlainOnly: true,
    })
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
    messages: MessagesModel;

    @OneToMany(() => CommentsModel, (comment) => comment.author)
    postComments: CommentsModel[];

    // 내가 팔로우 하고 있는 사람들
    @OneToMany(() => UserFollowersModel, (ufm) => ufm.follower)
    followers: UserFollowersModel[];

    // 나를 팔로우 하고 있는 사람들
    @OneToMany(() => UserFollowersModel, (ufm) => ufm.followee)
    followees: UserFollowersModel[];

    @Column({
        default: 0,
    })
    followerCount: number;

    @Column({
        default: 0,
    })
    followeeCount: number;
}