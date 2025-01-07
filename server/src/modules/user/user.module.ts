import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashService } from '../auth/hash/hash.service';

@Module({
  providers: [UserService, HashService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
