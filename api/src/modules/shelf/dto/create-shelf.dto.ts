import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateShelfDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  books?: string[];
}
