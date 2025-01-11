import { Transform } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class DateQueryDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate?: Date;
}