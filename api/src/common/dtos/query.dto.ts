import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  IsPositive,
  IsString,
  IsDateString,
} from 'class-validator';
import dayjs from 'dayjs';

export class QueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  size?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  // values are 'asc' or 'desc
  @IsOptional()
  @IsString()
  sortOrder?: string;

  @IsOptional()
  @Transform(({ value }) => transformDate(value))
  @IsDateString()
  date?: string;
}

export const processDate = (dateString: string | Date): string => {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString);
  const day = date.getDate();
  const fullDay = day.toString().length === 1 ? `0${day}` : day;
  const month = date.getMonth() + 1;
  const fullMonth = month.toString().length === 1 ? `0${month}` : month;
  const fullYear = date.getFullYear();
  return `${fullDay}/${fullMonth}/${fullYear}`;
};
function transformDate(value: any): string | undefined {
  if (!value) return undefined;

  const parsedDate = dayjs(value);
  if (!parsedDate.isValid()) {
    throw new Error('Invalid date format');
  }

  // Adjust date based on environment
  return process.env.PRODUCTION
    ? parsedDate.add(1, 'day').toISOString()
    : parsedDate.toISOString();
}
export function roundNumber(num: number): number {
  return Math.round(num * 100) / 100;
}
