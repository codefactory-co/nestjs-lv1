import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ChatsMessagesService } from "./messages.service";
import { BasePaginationDto } from "src/common/dto/base-pagination.dto";

@Controller('chats/:cid/messages')
export class MessagesController {
    constructor(
        private readonly messagesService: ChatsMessagesService,
    ) {

    }

    @Get()
    paginateMessage(
        @Param('cid', ParseIntPipe) id: number,
        @Query() dto: BasePaginationDto,
    ) {
        return this.messagesService.paginteMessages(
            dto,
            {
                where: {
                    chat: {
                        id,
                    }
                },
                relations:{
                    author: true,
                    chat: true,
                }
            }
        );
    }
}