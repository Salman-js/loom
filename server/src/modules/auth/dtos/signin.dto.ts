import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email address',
    },
  )
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: true,
  })
  @IsString()
  password: string;
}
