import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRsvpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  attendance: string; // "confirmed" or "declined"

  @IsString()
  @IsOptional()
  message?: string;
}
