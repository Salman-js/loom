import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserId } from '../auth/decorator/user_id.decorator';
import { COMPANYID } from 'src/utils/constants/constants';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@UserId() id: string) {
    return this.userService.findUserById(id);
  }
}
