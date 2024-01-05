import { BaseWsExceptionFilter, ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { EnterChatDto } from "./dto/enter-chat.dto";
import { CreateMessagesDto } from "./messages/dto/create-messages.dto";
import { ChatsMessagesService } from "./messages/messages.service";
import { ArgumentsHost, Catch, HttpException, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { SocketCatchHttpExceptionFilter } from "src/common/exception-filter/socket-catch-http.exception-filter";
import { UsersModel } from "src/users/entity/users.entity";
import { SocketBearerTokenGuard } from "src/auth/guard/socket/socket-bearer-token.guard";
import { UsersService } from "src/users/users.service";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
    // ws://localhost:3000/chats
    namespace: 'chats'
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly messagesService: ChatsMessagesService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: any) {
        console.log(`after gateway init`);
    }

    handleDisconnect(socket: Socket) {
        console.log(`on disconnect called : ${socket.id}`);
    }

    async handleConnection(socket: Socket & {user: UsersModel}) {
        console.log(`on connect called : ${socket.id}`);

        const headers = socket.handshake.headers;

        // Bearer xxxxxx
        const rawToken = headers['authorization'];

        if (!rawToken) {
            socket.disconnect();
        }

        try {
            const token = this.authService.extractTokenFromHeader(
                rawToken,
                true,
            );

            const payload = this.authService.verifyToken(token);
            const user = await this.usersService.getUserByEmail(payload.email);

            socket.user = user;

            return true;
        } catch (e) {
            socket.disconnect();
        }
    }

    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    @SubscribeMessage('create_chat')
    async createChat(
        @MessageBody() data: CreateChatDto,
        @ConnectedSocket() socket: Socket & {user: UsersModel},
    ) {
        const chat = await this.chatsService.createChat(
            data,
        );
    }

    @SubscribeMessage('enter_chat')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    async enterChat(
        // 방의 chat ID들을 리스트로 받는다.
        @ConnectedSocket() socket: Socket & {user: UsersModel},
        @MessageBody() data: EnterChatDto,
    ) {
        for (const chatId of data.chatIds) {
            const exists = await this.chatsService.checkIfChatExists(
                chatId,
            );

            if (!exists) {
                throw new WsException({
                    code: 100,
                    message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
                });
            }
        }

        socket.join(data.chatIds.map((x) => x.toString()));
    }

    // socket.on('send_message', (message)=>{ console.log(message)});
    @SubscribeMessage('send_message')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    async sendMessage(
        @MessageBody() dto: CreateMessagesDto,
        @ConnectedSocket() socket: Socket & {user: UsersModel},
    ) {
        const chatExists = await this.chatsService.checkIfChatExists(
            dto.chatId,
        );

        if (!chatExists) {
            throw new WsException(
                `존재하지 않는 채팅방입니다. Chat ID : ${dto.chatId}`,
            );
        }

        const message = await this.messagesService.createMessage(
            dto,
            socket.user.id,
        );

        socket.to(message.chat.id.toString()).emit("receive_message", message.message);
        // this.server.in(
        //     message.chatId.toString()
        // ).emit('receive_message', message.message);
    }
}