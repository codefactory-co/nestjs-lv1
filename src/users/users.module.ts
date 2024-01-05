import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { UserFollowersModel } from './entity/user-followers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel, UserFollowersModel]),
  ],
  exports:[UsersService],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
