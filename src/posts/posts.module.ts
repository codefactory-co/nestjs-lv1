import { BadRequestException, MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entity/posts.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import {v4 as uuid} from 'uuid';
import { ImageModel } from 'src/common/entity/image.entity';
import { PostsImagesService } from './image/images.service';
import { LogMiddleware } from 'src/common/middleware/log.middleware';
import { APP_PIPE } from '@nestjs/core';

const validationPipe = new ValidationPipe({
  transform: true,
  transformOptions:{
    enableImplicitConversion: true
  },
  whitelist: true,
  forbidNonWhitelisted: true,
});

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
      ImageModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsImagesService],
  exports: [PostsService]
})
export class PostsModule{ }
