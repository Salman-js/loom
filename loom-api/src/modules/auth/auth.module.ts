import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashService } from './hash/hash.service';
import { JwtGeneratorService } from './jwt/jwt.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AccessTokenStrategy } from './strategies/access_token.strategy';

@Module({
  imports: [UserModule],
  providers: [
    AuthService,
    HashService,
    JwtGeneratorService,
    AccessTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
