import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  BadRequestException,
  ConflictException,
  ConsoleLogger,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UserService } from '../user/user.service';
import { HashService } from './hash/hash.service';
import { SigninDto } from './dtos/signin.dto';
import { JwtGeneratorService } from './jwt/jwt.service';
import {
  UpdateSelfPasswordDto,
  UpdateUserPasswordDto,
  VeifiyEmailOrPhoneDto,
} from '../user/dtos/create-user.dto';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtGeneratorService: JwtGeneratorService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  @Transactional()
  async signup(signupDto: SignupDto) {
    try {
      const existingUser = await this.userService.findUserByEmail(
        signupDto.email,
      );

      if (existingUser) {
        throw new ConflictException('auth.error.emailExists');
      }

      const user = await this.userService.createUser({
        ...signupDto,
      });

      if (!user) {
        throw new BadRequestException('auth.error.createUser');
      }

      return {
        message: 'auth.success.createUser',
        user,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Transactional()
  async signin(signinDto: SigninDto) {
    try {
      this.logger.debug(signinDto);
      const user = await this.userService.findUserByEmail(signinDto.email);
      if (!user) {
        throw new ConflictException('auth.error.noAccount');
      }

      const isPasswordValid = await this.hashService.verifyPassword(
        signinDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('auth.error.incorrectPassword');
      }

      const accessToken = await this.jwtGeneratorService.generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      const refreshToken = await this.jwtGeneratorService.generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      const refreshTokenHash =
        await this.hashService.hashPassword(refreshToken);

      const refreshTokenSave = await this.userService.createRefreshToken(
        user.id,
        refreshTokenHash,
      );

      if (!refreshTokenSave) {
        throw new InternalServerErrorException('auth.error.saveToken');
      }

      this.logger.log(`User logged in: Email: ${user.email} ID: ${user.id}`);

      return {
        message: 'auth.success.login',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async resetAccessToken(id: string, refreshToken: string) {
    try {
      const user = await this.txHost.tx.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
        },
      });
      const accessToken = await this.verifyRefreshToken(
        user.id,
        user.email,
        refreshToken,
      );
      if (accessToken) {
        return { accessToken };
      }
      return { accessToken: null };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async verifyRefreshToken(
    userId: string,
    email: string,
    refreshToken: string,
  ) {
    const existingRefreshTokens = await this.txHost.tx.refreshToken.findMany({
      where: {
        userId,
      },
      select: {
        token: true,
        userId: true,
        expiresAt: true,
      },
    });

    for (const existingRefreshToken of existingRefreshTokens) {
      if (
        this.hashService.verifyPassword(
          refreshToken,
          existingRefreshToken.token,
        ) &&
        existingRefreshToken.expiresAt > new Date()
      ) {
        const accessToken = await this.jwtGeneratorService.generateAccessToken({
          userId,
          email,
        });

        return accessToken;
      }
    }

    return null;
  }

  async me(id: string) {
    try {
      const user = await this.userService.findUserById(id);
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async resetSelfPassword(
    userId: string,
    newPasswordInfo: UpdateSelfPasswordDto,
  ) {
    try {
      const user = await this.txHost.tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      this.logger.debug('user found');

      if (!user) {
        throw new NotFoundException('Your account has not been found.');
      }
      const comparePassword = await this.hashService.verifyPassword(
        newPasswordInfo.newPassword,
        user.password,
      );
      if (comparePassword != true) {
        console.log(
          'Is much ***********************************\n',
          comparePassword,
        );
        throw new BadRequestException('Invalid old password');
      }

      this.logger.debug('hashed found');

      const hashedPassword = await this.hashService.hashPassword(
        newPasswordInfo.newPassword,
      );
      await this.txHost.tx.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
      this.logger.debug('done');

      return { message: 'auth.success.passwordChange' };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async resetSelfPasswordWithEmail(
    userId: string,
    recoveryToken: string,
    newPassword: string,
  ) {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('Your account has not been found.');
      }

      const hashedPassword = await this.hashService.hashPassword(newPassword);
      await this.txHost.tx.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
