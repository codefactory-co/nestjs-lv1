import { PartialType } from "@nestjs/mapped-types";
import { CreateCommentsDto } from "./create-comments.dto";

export class UpdateCommentsDto extends PartialType(CreateCommentsDto){}
