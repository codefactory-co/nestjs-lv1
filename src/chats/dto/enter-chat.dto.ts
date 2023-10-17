import { IsNumber } from "class-validator";
import { IsNull } from "typeorm";

export class EnterChatDto {
    @IsNumber({}, {each: true})
    chatIds: number[];
}