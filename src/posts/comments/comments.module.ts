import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { PostExistsMiddleware } from './middleware/post-exists.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [CommentsModel]
    ),
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PostExistsMiddleware)
      .forRoutes(CommentsController)
  }
}
