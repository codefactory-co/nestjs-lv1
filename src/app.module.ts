import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersModel } from './users/entity/users.entity';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ENV_DB_DATABASE_KEY, ENV_DB_HOST_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEY, ENV_DB_USERNAME_KEY } from './common/const/env-keys.const';
import { PROJECT_ROOT_PATH, PUBLIC_FOLDER_PATH } from './common/const/paths.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageModel } from './common/entity/image.entity';
import { ChatsModule } from './chats/chats.module';
import { MessagesModel } from './chats/messages/entity/messages.entity';
import { ChatsModel } from './chats/entity/chats.entity';
import { CommentsModule } from './posts/comments/comments.module';

@Module({
  imports: [
    PostsModule,
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public'
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY] || 'localhost',
      port: parseInt(process.env[ENV_DB_PORT_KEY]) || 5433,
      username: process.env[ENV_DB_USERNAME_KEY] || 'postgres',
      password: process.env[ENV_DB_PASSWORD_KEY] || 'postgres',
      database: process.env[ENV_DB_DATABASE_KEY] || 'postgres',
      entities: [PostsModel, UsersModel, ImageModel, MessagesModel, ChatsModel],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CommonModule,
    ChatsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  }],
})
export class AppModule { }
