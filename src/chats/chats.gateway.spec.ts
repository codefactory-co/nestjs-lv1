import { Test, TestingModule } from '@nestjs/testing';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';

describe('ChatsGateway', () => {
  let gateway: ChatsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatsGateway, ChatsService],
    }).compile();

    gateway = module.get<ChatsGateway>(ChatsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
