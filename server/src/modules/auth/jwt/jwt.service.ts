import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGeneratorService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: { userId: string; email: string }) {
    return this.jwtService.sign(
      { ...payload, logInTimeStamp: Date.now() },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: '1d',
      },
    );
  }

  async generateRefreshToken(payload: { userId: string; email: string }) {
    return this.jwtService.sign(
      { ...payload, logInTimeStamp: Date.now() },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '30d',
      },
    );
  }
}
