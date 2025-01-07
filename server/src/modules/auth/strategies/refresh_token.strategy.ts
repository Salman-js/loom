import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { TokenPayload } from '../interface/auth.interface';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.headers['refreshtoken'] as string,
      ]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
      // passRqToCallback: true,
    });
  }

  async validate(payLoad: TokenPayload) {
    return await this.userService.findUserById(payLoad.userId);
  }
}
