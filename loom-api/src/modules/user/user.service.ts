import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HashService } from '../auth/hash/hash.service';
import { string } from 'joi';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { SignupDto } from '../auth/dtos/signup.dto';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly hashService: HashService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(data: SignupDto) {
    try {
      const hashedPassword = await this.hashService.hashPassword(data.password);

      if (!hashedPassword) {
        throw new BadRequestException('users.error.passwordSaveError');
      }
      return await this.txHost.tx.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async findUserByEmail(email: string) {
    return await this.txHost.tx.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(id: string) {
    const user = await this.txHost.tx.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    delete user.password;

    return user;
  }

  async createRefreshToken(userId: string, token: string) {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 30);
    return await this.txHost.tx.refreshToken.create({
      data: {
        userId,
        expiresAt: expiration,
        token,
      },
    });
  }
}
