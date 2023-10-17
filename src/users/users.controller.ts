import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './decorator/user.decorator';
import { UsersModel } from './entity/users.entity';
import { TransactionInterceptor } from 'src/posts/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('follow/:id')
  async postFollow(
    @User() user: UsersModel,
    // 여기서는 팔로우하려는 대상의 ID를 파라미터에 제공
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.usersService.followUser(
      user.id,
      followeeId,
    );

    return true;
  }

  @Patch('follow/:id/confirm')
  @UseInterceptors(TransactionInterceptor)
  async patchFolloweeConfirm(
    @User() user: UsersModel,
    // 여기서는 팔로워 ID를 제공 (팔로우 요청 받은게 사용자)
    @Param('id', ParseIntPipe) followerId: number,
    @QueryRunner() qr: QR,
  ) {
    await this.usersService.confirmFollow(
      followerId,
      user.id,
      qr,
    );

    await this.usersService.incrementFollowCount(
      user.id,
      qr,
    );

    return true;
  }

  @Delete('follow/:id')
  async cacelFollow() {

  }
}
