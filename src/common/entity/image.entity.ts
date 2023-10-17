import { BaseModel } from './base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { POST_IMAGE_PATH } from '../const/paths.const';
import { join } from 'path';
import { PostsModel } from 'src/posts/entities/posts.entity';

export enum ImageModelType{
    postImage,
}

@Entity()
export class ImageModel extends BaseModel {
  @Column({
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order: number;

  @IsEnum(ImageModelType)
  @IsString()
  type: ImageModelType;

  @Column()
  @Transform(({ value, obj }) =>{
    // 만약에 포스트 이미지 타입이라면
    // 이렇게 매핑하기
    if(obj.type === ImageModelType.postImage){
        return join(
            POST_IMAGE_PATH,
            value,
        )
    }else{
        return value;
    }
  })
  @IsString()
  path: string;

  @ManyToOne((type) => PostsModel, (post) => post.images)
  post?: PostsModel;
}
