import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class OtpDto {
  @IsNumber()
  otp: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsString()
  userId: string;
}

export class RefreshTokenDto {
  @IsString()
  userId: string;

  @IsString()
  token: string;
}
export class VeifiyEmailOrPhoneDto {
  @ApiProperty({
    example: '123456',
    description: 'The otp sent to the user',
    required: true,
  })
  @IsNumber()
  otp: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The phone number of the user',
    required: true,
  })
  @IsString()
  userId: string;
}

export class UpdateUserPasswordDto {
  @IsString()
  newPassword: string;
}

export class UpdateSelfPasswordDto {
  @IsString()
  oldPassword: string;
  @IsString()
  newPassword: string;
}
