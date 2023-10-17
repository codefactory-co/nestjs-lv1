import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chats.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(ChatsModel)
        private readonly chatsRepository: Repository<ChatsModel>,
        private readonly commonService: CommonService,
    ) { }

    async checkIfChatExists(chatId : number){
        const chat = await this.chatsRepository.findOne({
            where:{
                id: chatId,
            }
        });

        return !!chat;
    }

    async createChat(
        userIds: number[],
    ) {
        const chat = await this.chatsRepository.save({
            users: userIds.map((id) => ({ id })),
        });

        return this.chatsRepository.findOne({
            where: {
                id: chat.id,
            }
        });
    }

    paginateChat(
        dto: BasePaginationDto,
        overrideFindOptions: FindManyOptions<ChatsModel> = {},
    ){
        return this.commonService.paginate<ChatsModel>(
            dto,
            this.chatsRepository,
            {
                ...overrideFindOptions,
            },
            'chats',
        )
    }
}
