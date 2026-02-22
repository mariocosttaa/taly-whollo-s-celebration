import { IsOptional, IsString } from 'class-validator';

export class CreateVisitDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  ip?: string;
}
