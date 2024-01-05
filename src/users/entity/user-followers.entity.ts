import { BaseModel } from "src/common/entity/base.entity";
import { UsersModel } from "./users.entity";
import { Column, Entity, ManyToOne, Unique } from "typeorm";

@Entity()
export class UserFollowersModel extends BaseModel {
    @ManyToOne(() => UsersModel, (user) => user.followers)
    follower: UsersModel;

    @ManyToOne(() => UsersModel, (user) => user.followees)
    followee: UsersModel;

    @Column({
        default: false,
    })
    isConfirmed: boolean;
}