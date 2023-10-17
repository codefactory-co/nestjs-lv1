import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import { ChatsModel } from './entity/chats.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { EnterChatDto } from './dto/enter-chat.dto';
import { SendMessageDto } from './messages/dto/send-message.dto';
import { MessagesService } from './messages/messages.service';

@WebSocketGateway({
  namespace: 'chat',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService) { }

  handleConnection(client: Socket) {
    console.log('connected');
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatsService.createChat({
      ...data.userIds,
    });

    socket.join(chat.id.toString());

    return {
      status: 'success',
      data: chat,
    }
  }

  @SubscribeMessage('enter_chat')
  async enterChat(
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket,
  ){
    for(const chatId of data.chatIds){
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if(!exists){
        throw new WsException(
          `존재하지 않는 채팅방입니다. Chat ID : ${chatId}`,
        );
      }
    }

    for(const chatId of data.chatIds){
      await socket.join(chatId.toString());
    }

    return {
      status: 'success',
      data,
    }
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() socket: Socket,
  ){
    const chatExists = await this.chatsService.checkIfChatExists(data.chatId);

    if (!chatExists) {
      throw new WsException(
        `존재하지 않는 채팅방입니다. Chat ID : ${data.chatId}`,
      );
    }

    const message = await this.messagesService.createMessage(
      data.chatId,
      socket.user.id,
      {
        message: data.message,
      },
    );

    this.server.in(data.chatId.toString()).emit('receive_message', data);

    return {
      status: 'success',
      data:message,
    };
  }
}
