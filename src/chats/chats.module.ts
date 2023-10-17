import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chats.entity';
import { CommonModule } from 'src/common/common.module';
import { MessagesService as ChatsMessagesService } from './messages/messages.service';
import { MessagesModel } from './messages/entity/messages.entity';

@Module({
  imports:[
    CommonModule,
    TypeOrmModule.forFeature(
      [
        ChatsModel,
        MessagesModel,
      ]
    ),
  ],
  providers: [ChatsGateway, ChatsService, ChatsMessagesService]
})
export class ChatsModule {}
