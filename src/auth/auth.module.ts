import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
    JwtModule.register({}),
    UsersModule,
  ],
  exports:[AuthService],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
