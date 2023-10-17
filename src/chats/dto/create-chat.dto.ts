import { PickType } from "@nestjs/mapped-types";
import { ChatsModel } from "../entity/chats.entity";
import { IsNull } from "typeorm";
import { IsNumber } from "class-validator";

export class CreateChatDto {
    @IsNumber({}, { each: true })
    userIds: number[];
}