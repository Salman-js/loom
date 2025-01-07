import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { Public } from './decorator/public_route.decorator';
import {
  UpdateSelfPasswordDto,
  UpdateUserPasswordDto,
  VeifiyEmailOrPhoneDto,
} from '../user/dtos/create-user.dto';
import { UserId } from './decorator/user_id.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @Post('sign-up')
  async register(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto);
  }

  @Get('me')
  me(@UserId() userId: string) {
    return this.authService.me(userId);
  }

  @Post('reset-self-password-with-email')
  resetSelfPasswordWithEmail(
    @UserId() userId: string,
    @Body()
    {
      recoveryToken,
      newPassword,
    }: { recoveryToken: string; newPassword: string },
  ) {
    return this.authService.resetSelfPasswordWithEmail(
      userId,
      recoveryToken,
      newPassword,
    );
    return this.authService.resetSelfPasswordWithEmail(
      userId,
      recoveryToken,
      newPassword,
    );
  }

  @Patch('reset-self-password/:id')
  resetSelfPassword(
    @Param('id') userId: string,
    @Body() newPasswordInfo: UpdateSelfPasswordDto,
  ) {
    return this.authService.resetSelfPassword(userId, newPasswordInfo);
  }

  @Public()
  @Post('refresh-access-token')
  resetAccessToken(
    @Headers('userId') userId: string,
    @Headers('refreshToken') refreshToken: string,
  ) {
    return this.authService.resetAccessToken(userId, refreshToken);
  }
}
