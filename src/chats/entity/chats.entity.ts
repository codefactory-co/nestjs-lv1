import { IsNumber } from "class-validator";
import { BaseModel } from "src/common/entity/base.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Entity, IsNull, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { MessagesModel } from "../messages/entity/messages.entity";

@Entity()
export class ChatsModel extends BaseModel{
    @ManyToMany(()=> UsersModel, (user) => user.chats)
    users: UsersModel[];

    @OneToMany(()=> MessagesModel, (message) => message.chatRoom)
    messages: MessagesModel;
}