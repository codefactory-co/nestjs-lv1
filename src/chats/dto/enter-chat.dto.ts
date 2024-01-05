import { IsNumber } from "class-validator";

export class EnterChatDto{
    @IsNumber({}, {each: true})
    chatIds: number[];
}