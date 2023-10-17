import { PartialType, PickType } from "@nestjs/mapped-types";
import { PostsModel } from "../entities/posts.entity";
import { CreatePostDto } from "./create-post.dto";
import { IsOptional, IsString } from "class-validator";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";

export class UpdatePostDto extends PartialType(CreatePostDto){
    @IsString({
        message: stringValidationMessage,
    })
    @IsOptional()
    title?: string;

    @IsString({
        message: stringValidationMessage,
    })
    @IsOptional()
    content?: string;
}