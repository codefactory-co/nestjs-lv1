import { IsNumber } from "class-validator";

export class CreateChatDto{
    @IsNumber({}, {each: true})
    userIds: number[];
}