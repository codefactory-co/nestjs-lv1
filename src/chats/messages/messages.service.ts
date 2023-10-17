import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '../../common/common.service';
import { MessagesModel } from './entity/messages.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messageRepository: Repository<MessagesModel>,
    private readonly commonService: CommonService,
  ) {}

  async createMessage(
    chatId: number,
    authorId: number,
    data: CreateMessageDto,
  ) {
    const message = await this.messageRepository.save({
      chatRoom: {
        id: chatId,
      },
      author: {
        id: authorId,
      },
      ...data,
    });

    return this.messageRepository.findOne({
      where: {
        id: message.id,
      },
      relations: ['author'],
    });
  }

  paginateMessage(
    dto: BasePaginationDto,
    overrideFindOptions: FindManyOptions<MessagesModel> = {},
  ) {
    return this.commonService.paginate(
      dto,
      this.messageRepository,
      {
        ...overrideFindOptions,
      },
      'message',
    );
  }
}
