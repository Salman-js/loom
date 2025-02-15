import { Transform } from 'class-transformer';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  @IsDateString()
  publishDate?: string;
}

export class CreateBookmarkDto {
  @IsString()
  cfi: string;
}
export class CreateNoteDto {
  @IsString()
  note: string;

  @IsString()
  cfiRange: string;

  @IsString()
  text: string;
}

export class CreateHighlightDto {
  @IsString()
  color: string;

  @IsString()
  cfiRange: string;

  @IsString()
  text: string;
}
