import { Test, TestingModule } from '@nestjs/testing';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

describe('CommonController', () => {
  let controller: CommonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonController],
      providers: [CommonService],
    }).compile();

    controller = module.get<CommonController>(CommonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
