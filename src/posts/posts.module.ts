import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/paths.const';
import {v4 as uuid} from 'uuid';
import { PostImageService } from './image/image.service';
import { ImageModel } from 'src/common/entity/image.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([PostsModel, ImageModel]),
    CommonModule,
    AuthModule,
    UsersModule,
    MulterModule.register(
      {
        limits:{
          // 파일 크기 제한
          // 10 메가바이트
          fileSize: 10000000,
        },
        fileFilter: (req, file, cb) => {
          // 확장자를 가져오는 함수
          const ext = extname(file.originalname);
          if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            // 첫번째 파라미터에는 에러가 있을경우 에러 정보를 넣어준다.
            // 두번째 파라미터는 파일을 받을지 말지 boolean을 넣어준다.
            return cb(
              new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
              false,
            );
          }
  
          // 문제가 없을경우 파일 받고 에러 null 반환
          return cb(null, true);
        },
        storage: multer.diskStorage({
          destination: function(req, res, cb){
            cb(null, POST_IMAGE_PATH)
          },
          filename: function(req, file, cb){
            cb(null, `${uuid()}${extname(file.originalname)}`)
          },
        }),
      }
    ),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostImageService]
})
export class PostsModule {}
