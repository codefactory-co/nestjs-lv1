import { PickType } from '@nestjs/mapped-types';
import { MessagesModel } from '../entity/messages.entity';

export class CreateMessageDto extends PickType(MessagesModel, ['message']) {}
